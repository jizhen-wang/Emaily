const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('./emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');
const _ = require('lodash');
const Path = require('path-parser').default;
const { URL } = require('url');

module.exports = app => {
    app.get('/api/surveys', requireLogin, async (req, res) => {
        const surveys = await Survey.find({ _user: req.user.id }).select({
            recipients: false
        });

        res.send(surveys);
    });
    app.get('/api/surveys/delete/:surveyId', requireLogin, async (req, res) => {
        await Survey.findOne({ _id: req.params.surveyId }, (err, survey) => {
            if (err) {
                return;
            }
            if (req.user._id.equals(survey._user)) {
                survey.remove();
            }
        });
        res.redirect('/surveys');
    });

    app.get('/api/surveys/:surveyId/:choice', (req, res) => {
        res.send('Thanks for voting!');
    });

    app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
        const { title, subject, body, emails } = req.body;
        const survey = new Survey({
            title,
            subject,
            body,
            recipients: emails.split(',').map(email => ({ email })),
            _user: req.user.id,
            dateSent: Date.now()
        });

        // Great place to send an email!
        const mailer = new Mailer(survey, surveyTemplate(survey));

        try {
            await mailer.send();
            await survey.save();
            req.user.credits -= 1 * emails.split(',').length;
            const user = await req.user.save();

            res.send(user);
        } catch (err) {
            res.status(422).send(err);
        }
    });
    app.post('/api/surveys/webhooks', (req, res) => {
        const p = new Path('/api/surveys/:surveyId/:choice');
        const events = _.chain(req.body)
            .map(({ email, url }) => {
                const match = p.test(new URL(url).pathname);
                if (match) {
                    return { email, surveyId: match.surveyId, choice: match.choice };
                }
            })
            .compact()
            .uniqBy('email', 'surveyId')
            .each(({ surveyId, email, choice }) => {
                Survey.updateOne(
                    {
                        _id: surveyId,
                        recipients: {
                            $elemMatch: { email: email, responded: false }
                        }
                    },
                    {
                        $inc: { [choice]: 1 },
                        $set: { 'recipients.$.responded': true },
                        lastResponded: Date.now()
                    }
                ).exec();
            })
            .value();
        console.log(events);
        res.send({});
    });
};