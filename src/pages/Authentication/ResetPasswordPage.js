import React, { useEffect, useState } from "react";
import { Row, Col, Alert, Button, Container, Label, Input, Form } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { connect } from "react-redux";
import { Link ,useLocation, useNavigate  } from "react-router-dom";
import { forgetUser } from '../../store/actions';
import logodark from "../../assets/images/logo-dark.png";
import { API_BASE_URL } from "../ApiConfig/ApiConfig";
import { CustomFetch } from "../ApiConfig/CustomFetch";

const ResetPasswordPage = () => {
    const { control, handleSubmit, watch, formState: { errors } } = useForm();
    const location = useLocation();
    const navigate = useNavigate();

    const query = new URLSearchParams(location.search);
    const token = query.get("token");
    const email = query.get("email");
    const type = query.get("type");

    const onSubmit = async (data) => {
    try {
        const res = await CustomFetch("/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                token,
                password: data.password,
                password_confirmation: data.confirm_password,
                type,
            }),
        });

        const result = await res.json();

        if (!res.ok) {
            throw new Error(result.error || "Reset failed");
        }

        alert(result.message || "Password reset successful!");
        navigate("/login");
    } catch (error) {
        alert(error.message || "Reset failed");
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
                                                            {/* {forgetError && <Alert color="danger">{forgetError}</Alert>}
                                                            {message && <Alert color="success">{message}</Alert>} */}
        
                                                            <Form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3">
                            <Label>New Password</Label>
                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters" }
                                }}
                                render={({ field }) => <Input type="password" {...field} />}
                            />
                            {errors.password && <span className="text-danger">{errors.password.message}</span>}
                        </div>
                        <div className="mb-3">
                            <Label>Confirm Password</Label>
                            <Controller
                                name="confirm_password"
                                control={control}
                                rules={{
                                    validate: value => value === watch("password") || "Passwords do not match"
                                }}
                                render={({ field }) => <Input type="password" {...field} />}
                            />
                            {errors.confirm_password && <span className="text-danger">{errors.confirm_password.message}</span>}
                        </div>
                        <Button type="submit" color="primary">Update Password</Button>
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

export default ResetPasswordPage;
