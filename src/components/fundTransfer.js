
import React, { Component } from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import LoadingOverlay from "react-loading-overlay";
import ClockLoader from 'react-spinners/ClockLoader'
import { forkJoin } from 'rxjs';
import * as routes from '../constants/routes'
import SideBar from '../components/common/sidebar'
import Header from '../components/common/header'

// yup object
const FundTransferSchema = Yup.object().shape({
    to: Yup.string().required('To is Required').max(10, "Account Number has Max 10 Characters"),
    amount: Yup.number().required('Amount is Required'),
});


class FundTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountSummary: {},
            beneficiaryDetails: [],
            toAccountDetails: {},
            loading: true
        }
        this.submitFundTransferDetails = this.submitFundTransferDetails.bind(this);
    }

    componentDidMount() {

        // fetching beneficiary details and account summary of a user

        this.sessionData = JSON.parse(localStorage.getItem('userData')) // data from localstorage

        this.serviceAPICall = forkJoin(
            {
                beneficiaryDetails: axios.get(`${process.env.REACT_APP_DEV_URL}/beneficiaryDetails?userCode=${this.sessionData.userCode}`),
                accountSummary: axios.get(`${process.env.REACT_APP_DEV_URL}/accountSummary?userCode=${this.sessionData.userCode}`),
            }
        ).subscribe((response) => {
            this.setState({
                beneficiaryDetails: response.beneficiaryDetails.data,
                accountSummary: response.accountSummary.data[0],
                loading: false
            })
        }, (error) => {
            toast.error('Unable to connect to server')
        });
        // fetching beneficiary details and account summary of a user
    }

    // submit user details
    async submitFundTransferDetails(data) {
        this.setState({
            loading: true
        })
        // validating to account 
        let accountValidator = await this.validateAccount(data.to)
        if (accountValidator == false) { this.setState({ loading: false }); toast.error('Invalid Account Number'); return false; }
        if (this.state.accountSummary.balance < data.amount) { this.setState({ loading: false }); toast.error('Unable to transfer due to Insufficient Fund. Please check your balance. '); return false; }

        this.sessionData = JSON.parse(localStorage.getItem('userData')) // data from localstorage

        let fundTransfer = {
            from: this.state.accountSummary.accountNumber,
            to: data.to,
            amount: data.amount,
            comments: data.comments,
            userCode: [this.sessionData.userCode, this.state.toAccountDetails.userCode],
        }

        Promise.all([this.fundTransfer(fundTransfer), this.updatingBalanceAmount(this.state.accountSummary.id, data.amount)])
            .then((res) => {
                this.setState({
                    loading: false
                })
                toast.success('Fund Transfered Successfully')
                this.props.history.push(routes.TRANSACTION_HISTORY);
            }).catch((error) => {
                console.log(error)
            })
    }
    // submit user details

    // validating account
    validateAccount(toAccount) {
        return new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_DEV_URL}/accountSummary?accountNumber=${toAccount}`)
                .then(res => {
                    if (res.data.length > 0) {
                        this.setState({
                            toAccountDetails: res.data[0]
                        })
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
        })
    }

    // fund transfer
    fundTransfer(data) {
        return new Promise((resolve, reject) => {
            axios.post(`${process.env.REACT_APP_DEV_URL}/fundTransfer`, data)
                .then(res => {
                    if (res.data) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
        })
    }

    // updating balance amount
    updatingBalanceAmount(id, amount) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                axios.patch(`${process.env.REACT_APP_DEV_URL}/accountSummary/${id}`, { balance: this.state.accountSummary.balance - amount })
                    .then(res => {
                        if (res.data) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
            })
        }, 3000)
    }


    render() {
        // initial values for the form
        const initialValues = {
            to: '',
            amount: '',
            comments: '',
        };
        return (
            <React.Fragment>
                <LoadingOverlay active={this.state.loading} spinner={<ClockLoader color="white" />}>
                    <div>
                        <Header />
                        <div className="row">
                            <div className="col-sm-3">
                                <SideBar />
                            </div>
                            <div className="col-sm-9">
                                <br /><h3>Fund Transfer</h3><br />
                                <div className="login-form">
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={FundTransferSchema}
                                        onSubmit={values => {
                                            // same shape as initial values
                                            this.submitFundTransferDetails(values);
                                        }}
                                    >{({ errors, touched }) => (
                                        <Form>
                                            <div className="form-group">
                                                <label>From Account Number</label>
                                                <input type="text" className="form-control" value={this.state.accountSummary.accountNumber} disabled />
                                            </div>
                                            <div className="form-group">
                                                <Field as="select" className="form-control" placeholder="Enter To Account Number" name="to">
                                                    <option value="">Select Account</option>
                                                    {this.state.beneficiaryDetails.map((item, key) => <option key={key} value={item.accountNumber}>{item.accountNumber}-{item.IFSCCode}</option>)}
                                                </Field>
                                                {errors.to && touched.to ? (
                                                    <div className="errorText">{errors.to}</div>
                                                ) : null}
                                            </div>
                                            <div className="form-group">
                                                <Field type="number" className="form-control" placeholder="Enter Amount" name="amount" />
                                                {errors.amount && touched.amount ? (
                                                    <div>{errors.amount}</div>
                                                ) : null}
                                            </div>
                                            <div className="form-group">
                                                <Field as="textarea" className="form-control" placeholder="Enter Comments" name="comments" rows="5" />
                                                {errors.comments && touched.comments ? (
                                                    <div>{errors.comments}</div>
                                                ) : null}
                                            </div>
                                            <div className="form-group">
                                                <button type="submit" style={{ width: 100 }} className="btn btn-dark btn-block">Submit</button>
                                            </div>
                                        </Form>
                                    )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ToastContainer delay={3000} />
                </LoadingOverlay>
            </React.Fragment>
        )

    }

    componentWillUnmount() {
        this.serviceAPICall.unsubscribe() // unsubscribing service call
    }
}
export default withRouter(FundTransfer);