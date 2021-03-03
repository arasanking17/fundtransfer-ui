
import React, { Component } from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import * as Yup from 'yup';
import LoadingOverlay from "react-loading-overlay";
import { forkJoin } from 'rxjs';
import ClockLoader from 'react-spinners/ClockLoader'
import * as routes from '../constants/routes'
import SideBar from '../components/common/sidebar'
import Header from '../components/common/header'

// yup object
const BeneficiaryDetailsSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email Id is Required'),
    name: Yup.string().required('Name is Required'),
    IFSCCode: Yup.string().required('IFSC Code is Required'),
    branchName: Yup.string().required('Branch Name is Required'),
    accountNumber: Yup.string().required('Account Number is Required').max(10, "Account Number has Max 10 Characters"),
});

class BeneficiaryDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            accountSummary: {},
            accountNumbers: [],
            ifscCodes: []
        }
        this.submitBeneficiaryDetails = this.submitBeneficiaryDetails.bind(this);
    }

    componentDidMount() {
        this.fetchingBeneficiaryEssentials()           // fetching beneficiary essentials
    }

    fetchingBeneficiaryEssentials() {

        this.sessionData = JSON.parse(localStorage.getItem('userData')) // data from localstorage

        this.serviceAPICall = forkJoin(
            {
                accountSummary: axios.get(`${process.env.REACT_APP_DEV_URL}/accountSummary?userCode=${this.sessionData.userCode}`),
                accountNumbers: axios.get(`${process.env.REACT_APP_DEV_URL}/accountNumbers`),
                ifscCodes: axios.get(`${process.env.REACT_APP_DEV_URL}/IFSCCodes`),
            }
        ).subscribe((response) => {
            this.setState({
                accountSummary: response.accountSummary.data[0],
                accountNumbers: response.accountNumbers.data.filter(val=>val.accountNumber != response.accountSummary.data[0].accountNumber),
                ifscCodes: response.ifscCodes.data.filter(val=>val.IFSCcode != response.accountSummary.data[0].IFSCCode),
                loading: false
            })
        }, (error) => {
            toast.error('Unable to connect to server')
        });
    }

    // validating account
    validateAccountNumber(account) {
        return new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_DEV_URL}/accountNumbers?accountNumber=${account}`)
                .then(res => {
                    if (res.data.length > 0) {
                        resolve(res.data)
                    } else {
                        resolve(false)
                    }
                })
        })
    }

    // validating IFSC code
    validateIFSCCode(ifsc) {
        return new Promise((resolve, reject) => {
            axios.get(`${process.env.REACT_APP_DEV_URL}/IFSCCodes?IFSCcode=${ifsc}`)
                .then(res => {
                    if (res.data.length > 0) {
                        resolve(res.data)
                    } else {
                        resolve(false)
                    }
                })
        })
    }

    // submit user details
    async submitBeneficiaryDetails(data) {
        this.setState({
            loading: true
        })
        // validating to account 
        let accountValidator = await this.validateAccountNumber(data.accountNumber)
        if (accountValidator == false) {
            this.setState({ loading: false });
            toast.error('Invalid Account Number');
            return false;
        }

        if (this.state.accountSummary['accountNumber'] == data.accountNumber) {
            this.setState({ loading: false });
            toast.error('From and To account number cannot be same');
            return false;
        }

        // validating IFSC code
        let ifscValidator = await this.validateIFSCCode(data.IFSCCode)

        if (ifscValidator == false) {
            this.setState({ loading: false });
            toast.error('Invalid IFSC Code');
            return false;
        }


        this.sessionData = JSON.parse(localStorage.getItem('userData')) // data from localstorage
        const beneficiaryDetailsObj = {
            name: data.name,
            accountNumber: data.accountNumber,
            IFSCCode: data.IFSCCode,
            branchName: data.branchName,
            email: data.email,
            userCode: this.sessionData.userCode,
        }
        axios.post(`${process.env.REACT_APP_DEV_URL}/beneficiaryDetails`, beneficiaryDetailsObj)
            .then(res => {
                if (res.data) {
                    this.setState({
                        loading: false
                    })
                    toast.success('Details Saved Successfully')
                    this.props.history.push(routes.VIEW_BENEFICIARY_DETAILS);
                }
            })
    }
    // submit user details

    componentWillUnmount() {
        this.serviceAPICall.unsubscribe() // unsubscribing service call
    }


    render() {
        // initial values for the form
        const initialValues = {
            name: '',
            accountNumber: '',
            IFSCCode: '',
            branchName: '',
            email: '',
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
                                <br /><h3>Add Beneficiary Details</h3><br />
                                <div className="login-form">
                                    <Formik
                                        initialValues={initialValues}
                                        validationSchema={BeneficiaryDetailsSchema}
                                        onSubmit={values => {
                                            // same shape as initial values
                                            this.submitBeneficiaryDetails(values);
                                        }}
                                    >{({ errors, touched }) => (
                                        <Form>
                                            <div className="form-group">
                                                <label>Your Account Number</label>
                                                <input  type="text" className="form-control" value={this.state.accountSummary.accountNumber} disabled/>
                                            </div>
                                            <div className="form-group">
                                                <Field name="name" type="text" className="form-control" placeholder="Enter Name" />
                                                {errors.name && touched.name ? (
                                                    <div>{errors.name}</div>
                                                ) : null}
                                            </div>

                                            <div className="form-group">
                                                <Field as="select" className="form-control" name="accountNumber">
                                                    <option value="">Select Account</option>
                                                    {this.state.accountNumbers.map((item, key) => <option key={key} value={item.accountNumber}>{item.accountNumber}</option>)}
                                                </Field>
                                                {errors.accountNumber && touched.accountNumber ? (
                                                    <div>{errors.accountNumber}</div>
                                                ) : null}
                                            </div>
                                            <div className="form-group">
                                                <Field as="select" className="form-control" name="IFSCCode">
                                                    <option value="">Select IFSCCode</option>
                                                    {this.state.ifscCodes.map((item, key) => <option key={key} value={item.IFSCcode}>{item.IFSCcode}</option>)}
                                                </Field>
                                                {errors.IFSCCode && touched.IFSCCode ? (
                                                    <div>{errors.IFSCCode}</div>
                                                ) : null}
                                            </div>
                                            <div className="form-group">
                                                <Field type="text" className="form-control" placeholder="Enter Branch name" name="branchName" />
                                                {errors.branchName && touched.branchName ? (
                                                    <div>{errors.branchName}</div>
                                                ) : null}
                                            </div>
                                            <div className="form-group">
                                                <Field type="text" className="form-control" placeholder="Enter Email" name="email" />
                                                {errors.email && touched.email ? (
                                                    <div>{errors.email}</div>
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
                </LoadingOverlay>
                <ToastContainer delay={3000} />
            </React.Fragment>
        )

    }
}
export default withRouter(BeneficiaryDetails);