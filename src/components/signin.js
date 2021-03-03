
import React, { Component } from 'react';
import axios from 'axios'
import { withRouter } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import * as routes from '../constants/routes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import LoadingOverlay from "react-loading-overlay";
import ClockLoader from 'react-spinners/ClockLoader'


// yup object
const SigninSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email Id is Required'),
    password: Yup.string().required('Password is Required'),
});


class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
        this.submitUserDetails = this.submitUserDetails.bind(this);
    }


    // submit user details
    submitUserDetails(data) {
        this.setState({
            loading: true
        })
        axios.get(`${process.env.REACT_APP_DEV_URL}/users?emailId=${data.email}&password=${data.password}`)
            .then(res => {
                if (res.data.length > 0) {
                    this.setState({
                        loading: false
                    })
                    localStorage.setItem('userData', JSON.stringify(res.data[0]))
                    this.props.history.push(routes.ACCOUNT_SUMMARY);
                    return false;
                } else {
                    this.setState({
                        loading: false
                    })
                    toast.error('Email Id/ Password is incorrect')
                }
            })
    }
    // submit user details


    render() {

        // initial values for the form
        const initialValues = {
            email: "",
            password: ""
        };

        return (
            <React.Fragment>
                <LoadingOverlay active={this.state.loading} spinner={<ClockLoader color="white"/>}>
                    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                        <a className="navbar-brand">
                            <FontAwesomeIcon icon={faMoneyCheckAlt} />
                        &nbsp;Fund Transfer App
                </a>
                    </nav>
                    <br />
                    <div className="row">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-4">
                            <div className="login-form">
                                <Formik
                                    initialValues={initialValues}
                                    validationSchema={SigninSchema}
                                    onSubmit={values => {
                                        // same shape as initial values
                                        this.submitUserDetails(values);
                                    }}
                                >{({ errors, touched }) => (
                                    <Form>

                                        <h3 className="text-center">Sign In</h3>
                                        <div className="form-group">
                                            <Field name="email" type="text" className="form-control" placeholder="Enter Email Id" />
                                            {errors.email && touched.email ? (
                                                <div>{errors.email}</div>
                                            ) : null}
                                        </div>

                                        <div className="form-group">
                                            <Field type="password" className="form-control" placeholder="Enter Password" name="password" />
                                            {errors.password && touched.password ? (
                                                <div>{errors.password}</div>
                                            ) : null}
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-dark btn-block">Log in</button>
                                        </div>
                                    </Form>
                                )}
                                </Formik>
                            </div>
                        </div>
                        <div className="col-sm-4"></div>
                    </div>
                    <ToastContainer delay={3000} />
                </LoadingOverlay>
            </React.Fragment>
        )

    }
}
export default withRouter(SignIn);