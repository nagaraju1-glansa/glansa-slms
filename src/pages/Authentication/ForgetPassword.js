import React, { useEffect, useState } from "react";
import { Row, Col, Alert, Button, Container, Label, Input, Form } from "reactstrap";
import { useForm, Controller  } from "react-hook-form";
import { connect } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { forgetUser } from '../../store/actions';
import logodark from "../../assets/images/logo-dark.png";
import { API_BASE_URL } from "../ApiConfig/ApiConfig";
import { CustomFetch } from "../ApiConfig/CustomFetch";
import Swal from "sweetalert2";

const ForgetPasswordPage = ({ forgetUser, forgetError, message, loading }) => {
    const { handleSubmit, control, formState: { errors } } = useForm();
    const [userType, setUserType] = useState("company");

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get("type");

    // const history = useHistory();

    useEffect(() => {
        document.body.classList.add("auth-body-bg");
        return () => {
            document.body.classList.remove("auth-body-bg");
        };
    }, []);
const handleValidSubmit = async (data) => {
    try {
        const response = await CustomFetch("/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: data.useremail,
                type: type,
            }),
        });

        // If using fetch internally, parse JSON manually
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || result.error || "Failed to send reset link.");
        }

        Swal.fire({
            icon: "success",
            title: "Success",
            text: result.message || "Reset link sent successfully!",
        });

    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "Something went wrong.",
        });
    }
};

    return (
        <React.Fragment>
            <div>
                <Container fluid className="p-0">
                    <Row className="g-0">
                        <Col lg={4}>
                            <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
                                <div className="w-100">
                                    <Row className="justify-content-center">
                                        <Col lg={9}>
                                            <div>
                                                <div className="text-center">
                                                    <Link to="/" className="logo"><img src={logodark} height="50" alt="logo" /></Link>
                                                    <h4 className="font-size-18 mt-4">Reset Password</h4>
                                                    <p className="text-muted">Reset your password to Glansa - S&LM.</p>
                                                </div>

                                                <div className="p-2 mt-5">
                                                    {forgetError && <Alert color="danger">{forgetError}</Alert>}
                                                    {message && <Alert color="success">{message}</Alert>}

                                                    <Form onSubmit={handleSubmit(handleValidSubmit)}>
                                                        {/* <div className="mb-3">
                                                            <Label>User Type</Label>
                                                            <Input type="select" value={userType} onChange={e => setUserType(e.target.value)}>
                                                                <option value="company">Company</option>
                                                                <option value="member">Member</option>
                                                            </Input>
                                                        </div> */}

                                                        <div className="auth-form-group-custom mb-4">
                                                            <i className="ri-mail-line auti-custom-input-icon"></i>
                                                            <Label>Email</Label>
                                                            <Controller
                                                                name="useremail"
                                                                control={control}
                                                                rules={{
                                                                    required: "Email is required",
                                                                    pattern: {
                                                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                                        message: "Invalid email",
                                                                    }
                                                                }}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        type="email"
                                                                        placeholder="Enter email"
                                                                        invalid={!!errors.useremail}
                                                                    />
                                                                )}
                                                            />
                                                            {errors.useremail && <span className="text-danger">{errors.useremail.message}</span>}
                                                        </div>

                                                        <div className="mt-4 text-center">
                                                            <Button color="primary" className="w-md" type="submit">
                                                                {loading ? "Loading..." : "Send Reset Link"}
                                                            </Button>
                                                        </div>
                                                    </Form>
                                                </div>

                                                <div className="mt-5 text-center">
                                                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                                                    <p>© {new Date().getFullYear()} Glansa.</p>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>

                        <Col lg={8}>
                            <div className="authentication-bg">
                                <div className="bg-overlay"></div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    const { message, forgetError, loading } = state.Forget;
    return { message, forgetError, loading };
};

export default connect(mapStateToProps, { forgetUser })(ForgetPasswordPage);

