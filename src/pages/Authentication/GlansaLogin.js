import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Button, Container, Label } from "reactstrap";
import { useForm, Controller } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import logodark from "../../assets/images/logo-dark.png";
import logolight from "../../assets/images/logo-light.png";
import { API_BASE_URL } from "../ApiConfig/ApiConfig";
import Swal from 'sweetalert2';
//add css
import './Auth.css';

const GlansaLogin = () => {
  const navigate = useNavigate();
  const [loginType, setLoginType] = useState('company');
  const [showPassword, setShowPassword] = useState(false);

 const { control, handleSubmit, setValue, formState: { errors } } = useForm({
  defaultValues: {
    username: '',
    password: '',
    member_no: '',
    aadhar_no: '',
    type: '',
  }
});

useEffect(() => {
  if (loginType === 'member') {
    setValue('member_no', '4');
    setValue('aadhar_no', '9017 0989 9897');
  }
}, [loginType, setValue]);

  const onSubmit = (data) => {
    const payload = { username: data.username, password: data.password, type: 'glansa' }

    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    .then(async (res) => {
    const responseData = await res.json();

    if (!res.ok) {
      // Show backend error message (e.g. subscription expired)
      throw new Error(responseData.message || 'Login failed');
    }

    return responseData;
  })
    .then(data => {
      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('companyId', data.user.company_id);
        localStorage.setItem('RoleId', data.user.role_id);
        localStorage.setItem('UserType', data.user.name);
        localStorage.setItem('selectedCompanyId', 0);
         if (loginType === 'member') {
            localStorage.setItem('mencpt', data.user.m_no_encpt);
          }

        navigate('/dashboard');
      } else {
        console.error('Token not found');
      }
    })
    .catch(error => {
      Swal.fire({
        title: 'Login Failed',
        text: error.message,
        icon: 'error',
        confirmButtonText: 'Try Again'
      });
    });
  };

  return (
    <Container fluid className="p-0">
      <Row className="g-0">
        <Col lg={4}>
          <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
            <div className="w-100">
              <Row className="justify-content-center">
                <Col lg={10}>
                  <div className="text-center">
                    <Link to="/">
                      <img src={logodark} alt="" height="50" className="auth-logo logo-dark mx-auto" />
                      <img src={logolight} alt="" height="50" className="auth-logo logo-light mx-auto" />
                    </Link>
                    <h4 className="font-size-18 mt-4">Welcome Back!</h4>
                    <p className="text-muted">Sign in to continue</p>
                  </div>

                 
                  <div className="p-2 mt-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {/* Company Login */}
                      <div className={`login-section `}>
                        {/* Demo Login Buttons */}
                       

                        {/* Username */}
                        <div className="auth-form-group-custom mb-4">
                          <i className="ri-user-2-line auti-custom-input-icon"></i>
                          <Label htmlFor="username">Username</Label>
                          <Controller
                            name="username"
                            control={control}
                            rules={{ required: loginType === 'company' && "Username is required" }}
                            render={({ field }) => (
                              <Input
                                id="username"
                                placeholder="Enter username"
                                className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                {...field}
                              />
                            )}
                          />
                          {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
                        </div>

                        {/* Password with Toggle */}
                        <div className="auth-form-group-custom mb-4 position-relative">
                          <i className="ri-lock-2-line auti-custom-input-icon"></i>
                          <Label htmlFor="password">Password</Label>
                          <Controller
                            name="password"
                            control={control}
                            rules={{ required: loginType === 'company' && "Password is required" }}
                            render={({ field }) => (
                              <div className="position-relative1">
                                <Input
                                  id="password"
                                  type={showPassword ? "text" : "password"}
                                  placeholder="Enter password"
                                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                  {...field}
                                />
                                <span
                                  onClick={() => setShowPassword(!showPassword)}
                                  style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    cursor: "pointer"
                                  }}
                                >
                                  <i className={`ri-eye${showPassword ? "-off" : ""}-line`}></i>
                                </span>
                              </div>
                            )}
                          />
                          {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
                        </div>
                        <div className="mt-4 text-center">
                          <Link to="/forgot-password?type=company" className="text-muted">
                            <i className="mdi mdi-lock me-1"></i> Forgot your password?
                          </Link>
                        </div>
                      </div>
     

                      <div className="mt-4 text-center">
                        <Button color="primary" className="w-md" type="submit">Log In</Button>
                      </div>

                      
                    </form>
                  </div>

                  <div className="mt-5 text-center">
                    <p>© 2025 Glansa</p>
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
  );
};

export default GlansaLogin;

