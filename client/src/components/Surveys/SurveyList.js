import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
    componentDidMount() {
        this.props.fetchSurveys();
    }
    renderSurveys() {
        return this.props.surveys.reverse().map(survey => {
            return (
                < div class="row" key={survey._id}>
                    <div class="col s12 m6">
                        <div class="card">
                            <div class="card-content black-text">
                                <span class="card-title">{survey.title}</span>
                                <p><a href="#!">Sent on: {new Date(survey.dateSent).toLocaleDateString()}</a></p>
                                <p>{survey.body}</p>
                            </div>
                            <div class="card-action">
                                <a href="#!"> Yes: {survey.yes}</a>
                                <a href="#!"> No: {survey.no}</a>
                            </div>
                        </div>
                    </div>
                </div >);
        })
    }
    render() {
        return this.renderSurveys();
    }

}
function mapStateToProps({ surveys }) {
    return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);