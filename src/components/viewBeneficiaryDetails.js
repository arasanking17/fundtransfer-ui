
import React, { Component } from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import SideBar from '../components/common/sidebar'
import LoadingOverlay from "react-loading-overlay";
import ClockLoader from 'react-spinners/ClockLoader'
import Header from '../components/common/header'

class ViewBeneficiaryDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            beneficiaryDetails: [],
            loading: true
        }
    }

    componentDidMount() {

        // fetching beneficiary details of a user

        this.sessionData = JSON.parse(localStorage.getItem('userData')) // data from localstorage

        axios.get(`${process.env.REACT_APP_DEV_URL}/beneficiaryDetails?userCode=${this.sessionData.userCode}`)
            .then(res => {
                this.setState({
                    beneficiaryDetails: res.data,
                    loading:false
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
                            <br /><h3>Beneficiary Details List</h3><br />
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Account Number</th>
                                        <th scope="col">IFSC Code</th>
                                        <th scope="col">Email</th>
                                        <th scope="col">Branch Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.beneficiaryDetails.length > 0 ? this.state.beneficiaryDetails.map((data, i) =>
                                        <tr key={i}>
                                            <td>{data.name}</td>
                                            <td>{data.accountNumber}</td>
                                            <td>{data.IFSCCode}</td>
                                            <td>{data.email}</td>
                                            <td>{data.branchName}</td>
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