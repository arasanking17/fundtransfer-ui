
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Nav, Modal, Button } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faPlusCircle, faList, faHistory, faSignOutAlt, faMoneyCheck } from '@fortawesome/free-solid-svg-icons'
import * as routes from '../../constants/routes'
import '../../styles/sidebar.css'

class SideBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    openModal = () => this.setState({ isOpen: true });
    closeModal = () => { this.setState({ isOpen: false }); }
    signOut = () => { this.props.history.push(routes.SIGN_IN); this.setState({ isOpen: false }); }


    render() {
        const linkStyle = {
            color: "white",
        };

        return (
            <Nav className="col-md-12 d-none d-md-block bg-dark sidebar">
                <div>
                    <table className="table table-dark">
                        <tbody>
                            <tr><th><FontAwesomeIcon icon={faUser} />&nbsp;<Link style={linkStyle} to={routes.ACCOUNT_SUMMARY}>Account Summary</Link></th></tr>
                            <tr><th><FontAwesomeIcon icon={faPlusCircle} />&nbsp;<Link style={linkStyle} to={routes.ADD_BENEFICIARY_DETAILS}>Add Beneficiary</Link></th></tr>
                            <tr><th><FontAwesomeIcon icon={faList} />&nbsp;<Link style={linkStyle} to={routes.VIEW_BENEFICIARY_DETAILS}>List / View Beneficiary</Link></th></tr>
                            <tr><th><FontAwesomeIcon icon={faMoneyCheck} />&nbsp;<Link style={linkStyle} to={routes.FUND_TRANSFER}>Fund Transfer</Link></th></tr>
                            <tr><th><FontAwesomeIcon icon={faHistory} />&nbsp;<Link style={linkStyle} to={routes.TRANSACTION_HISTORY}>Transaction History</Link></th></tr>
                            <tr><th onClick={this.openModal}><FontAwesomeIcon icon={faSignOutAlt}/>&nbsp;Sign Out</th></tr>
                        </tbody>
                    </table>
                </div>
                <Modal show={this.state.isOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Fund Transfer App</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure do you want to sign out?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="dark" onClick={this.signOut}>Sign Out</Button>
                    </Modal.Footer>
                </Modal>
            </Nav>
        )

    }
}
export default withRouter(SideBar);