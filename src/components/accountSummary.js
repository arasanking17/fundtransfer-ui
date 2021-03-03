
import React, { Component } from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import LoadingOverlay from "react-loading-overlay";
import ClockLoader from 'react-spinners/ClockLoader'
import SideBar from '../components/common/sidebar'
import Header from '../components/common/header'
import '../styles/sidebar.css'

class AccountSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountSummary: {},
            loading: true
        }
    }

    componentDidMount() {

        // fetching account summary of a user

        this.sessionData = JSON.parse(localStorage.getItem('userData')) // data from localstorage

        axios.get(`${process.env.REACT_APP_DEV_URL}/accountSummary?userCode=${this.sessionData.userCode}`)
            .then(res => {
                this.setState({
                    accountSummary: res.data[0],
                    loading:false
                })
            })
        // fetching account summary of a user
    }


    render() {
        return (
            <div>
                <LoadingOverlay active={this.state.loading} spinner={<ClockLoader color="white" />}>
                    <Header />
                    <div className="row">
                        {/* side heading display */}
                        <div className="col-sm-3">
                            <SideBar />
                        </div>
                        {/* side heading display */}
                        {/* account summary display */}
                        <div className="col-sm-9">
                            <br /><h3>Account Summary</h3><br />
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">IFSC Code</th>
                                        <th scope="col">Account Number</th>
                                        <th scope="col">Account Type</th>
                                        <th scope="col">Balance</th>
                                        <th scope="col">Branch Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">{this.state.accountSummary.IFSCCode}</th>
                                        <td>{this.state.accountSummary.accountNumber}</td>
                                        <td>{this.state.accountSummary.accountType}</td>
                                        <td>₹ {this.state.accountSummary.balance}</td>
                                        <td>{this.state.accountSummary.branchName}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* account summary display */}
                    </div>
                </LoadingOverlay>
            </div>
        )

    }
}
export default withRouter(AccountSummary);