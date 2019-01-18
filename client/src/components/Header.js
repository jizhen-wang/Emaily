import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Payments from './Payments';

class Header extends Component {
    renderContent() {
        switch (this.props.auth) {
            case null:
                return;
            case false:
                return (
                    <li><a className="waves-effect waves-light btn modal-trigger" href="#modal1">Login</a></li>
                );
            default:
                console.log(this.props.auth);
                return [
                    <li key="1"><Payments /></li>,
                    <li key="1" style={{ margin: '0 10px' }}>Credits:{this.props.auth.credits}</li>,
                    <li key="3" > <a href="/api/logout">Logout</a></li >
                ];
        }
    }
    render() {
        console.log(this.props);
        return (
            <nav className="row">
                <div className="nav-wrapper col s12">
                    <Link to={this.props.user ? '/surveys' : '/'} className="brand-logo">
                        Emaily
                    </Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        {this.renderContent()}
                    </ul>
                </div>
            </nav>
        );
    }
}

function mapStateToProps({ auth }) {
    return { auth };
}

export default connect(mapStateToProps)(Header);