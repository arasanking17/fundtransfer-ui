
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons'

class Header extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <a className="navbar-brand">
                    <FontAwesomeIcon icon={faMoneyCheckAlt} />
                        &nbsp;Fund Transfer App
                </a>
            </nav>
        )

    }
}
export default withRouter(Header);