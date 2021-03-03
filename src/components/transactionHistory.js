
import React, { Component } from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import LoadingOverlay from "react-loading-overlay";
import ClockLoader from 'react-spinners/ClockLoader'
import SideBar from '../components/common/sidebar'
import Header from '../components/common/header'

class ViewBeneficiaryDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            transactionHistory: [],
            loading: true
        }
    }

    componentDidMount() {

        // fetching beneficiary details of a user

        this.sessionData = JSON.parse(localStorage.getItem('userData')) // data from localstorage

        axios.get(`${process.env.REACT_APP_DEV_URL}/fundTransfer?userCode_like=${this.sessionData.userCode}`)
            .then(res => {
                this.setState({
                    transactionHistory: res.data,
                    loading: false
                })
            })
        // fetching beneficiary details of a user
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
                            <br /><h3>Transaction History</h3><br />
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">From Account Number</th>
                                        <th scope="col">To Account Number</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Comments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.transactionHistory.length > 0 ? this.state.transactionHistory.map((data, i) =>
                                        <tr key={i}>
                                            <td>{data.from}</td>
                                            <td>{data.to}</td>
                                            <td>₹ {data.amount}</td>
                                            <td>{data.comments}</td>
                                        </tr>
                                    ) : <tr><td>No Records Found</td></tr>}
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
export default withRouter(ViewBeneficiaryDetails);
