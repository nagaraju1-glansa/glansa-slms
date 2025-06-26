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

const Login = () => {
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
    const payload = loginType === 'company' 
      ? { username: data.username, password: data.password, type: loginType } 
      : { member_no: data.member_no, aadhar_no: data.aadhar_no, type: loginType };

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

                  <div className="login-toggle-buttons">
                    <button 
                      className={loginType === 'company' ? 'active' : ''} 
                      onClick={() => setLoginType('company')}
                    >
                      Company
                    </button>
                    <button 
                      className={loginType === 'member' ? 'active' : ''} 
                      onClick={() => setLoginType('member')}
                    >
                      Member
                    </button>
                  </div>

                  <div className="p-2 mt-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      {/* Company Login */}
                      <div className={`login-section ${loginType !== 'company' ? 'hidden' : ''}`}>
                        {/* Demo Login Buttons */}
                        <div className="mb-3 text-center">
                          <span className="me-2">Try Demo:</span>
                          <Button size="sm" color="info" className="me-2 mb-1" onClick={() => {
                            setValue("username", "superadmin");
                            setValue("password", "superadmin");
                          }}>SuperAdmin</Button>
                          <Button size="sm" color="primary" className="me-2 mb-1" onClick={() => {
                            setValue("username", "admin");
                            setValue("password", "admin123");
                          }}>Admin</Button>
                          <Button size="sm" color="success" className=" mb-1" onClick={() => {
                            setValue("username", "employee");
                            setValue("password", "employee123");
                          }}>Employee</Button>
                        </div>

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
                      {/* Member Login */}
                      <div className={`login-section ${loginType !== 'member' ? 'hidden' : ''}`}>
                        <div className="auth-form-group-custom mb-4">
                          <i className="ri-user-3-line auti-custom-input-icon"></i>
                          <Label htmlFor="member_no">Member No.</Label>
                          <Controller
                            name="member_no"
                            control={control}
                            rules={{ required: loginType === 'member' && "Member No. is required" }}
                            value = "4"
                            render={({ field }) => (
                              <Input
                                id="member_no"
                                placeholder="Enter Member No."
                                className={`form-control ${errors.member_no ? 'is-invalid' : ''}`}
                                {...field}
                              />
                            )}
                          />
                          {errors.member_no && <div className="invalid-feedback">{errors.member_no.message}</div>}
                        </div>

                        <div className="auth-form-group-custom mb-4">
                          <i className="ri-fingerprint-line auti-custom-input-icon"></i>
                          <Label htmlFor="aadhar_no">Aadharcard No.</Label>
                          <Controller
                            name="aadhar_no"
                            control={control}
                            rules={{ required: loginType === 'member' && "Aadharcard No. is required" }}
                            render={({ field }) => (
                              <Input
                                id="aadhar_no"
                                placeholder="Enter Aadharcard No."
                                className={`form-control ${errors.aadhar_no ? 'is-invalid' : ''}`}
                                {...field}
                              />
                            )}
                          />
                          {errors.aadhar_no && <div className="invalid-feedback">{errors.aadhar_no.message}</div>}
                        </div>
                        {/* <div className="mt-4 text-center">
                          <Link to="/forgot-password?type=member" className="text-muted">
                            <i className="mdi mdi-lock me-1"></i> Forgot your password?
                          </Link>
                        </div> */}
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

export default Login;



// import React from 'react';
// import { Row, Col, Input, Button, Container, Label } from "reactstrap";
// import { useForm, Controller } from 'react-hook-form';
// import { Link, useNavigate } from 'react-router-dom';

// import logodark from "../../assets/images/logo-dark.png";
// import logolight from "../../assets/images/logo-light.png";
// import {API_BASE_URL} from "../ApiConfig/ApiConfig";
// import { useEffect, useState } from 'react';
// import {CustomFetch} from '../ApiConfig/CustomFetch';
// import Swal from 'sweetalert2';


// const Login = () => {
//   const navigate = useNavigate();
//   const [company_id, setCompanyId] = useState([]);

//   const { control, handleSubmit, formState: { errors } } = useForm({
//     defaultValues: {
//       username: '',
//       password: '',
//       company_id: ''
//     }
//   });


//   const onSubmit = (data) => {
//     console.log(data);
//     const encryptedCompanyId = encodeURIComponent( data.company_id);
//     fetch(`${API_BASE_URL}/auth/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//       body: JSON.stringify({
//         username: data.username,
//         password: data.password,
//         // company_id: encryptedCompanyId
//       }),
//     })
//     .then(res => {
//       if (!res.ok) throw new Error('Login failed');
//       return res.json();
//     })
//     .then(data => {
//       if (data.access_token) {
//         localStorage.setItem('token', data.access_token);
//         localStorage.setItem('companyId', data.user.company_id);
//         localStorage.setItem('RoleId', data.user.role_id);
//         localStorage.setItem('UserType', data.user.usertype);
//         localStorage.setItem('selectedCompanyId', 0);

//         navigate('/dashboard'); 
//       } else {
//         console.error('Token not found');
//       }
//     })
//     .catch(error => {
//       console.error('Fetch error:', error);
//       Swal.fire({
//         title: 'Login Failed',
//         text: 'Please check your username, password, or company selection.',
//         icon: 'error',
//         confirmButtonText: 'Try Again'
//       });
//     });

    
//   };

//   return (
//     <Container fluid className="p-0">
//       <Row className="g-0">
//         <Col lg={4}>
//           <div className="authentication-page-content p-4 d-flex align-items-center min-vh-100">
//             <div className="w-100">
//               <Row className="justify-content-center">
//                 <Col lg={9}>
//                   <div>
//                     <div className="text-center">
//                       <Link to="/">
//                         <img src={logodark} alt="" height="50" className="auth-logo logo-dark mx-auto" />
//                         <img src={logolight} alt="" height="50" className="auth-logo logo-light mx-auto" />
//                       </Link>
//                       <h4 className="font-size-18 mt-4">Welcome Back!</h4>
//                       <p className="text-muted">Sign in to continue to Glansa-S&LM.</p>
//                     </div>
//                     <div className="p-2 mt-5">
//                       <form onSubmit={handleSubmit(onSubmit)}>

//                         {/* */}
//                         <div className="auth-form-group-custom mb-4">
//                           <i className="ri-user-2-line auti-custom-input-icon"></i>
//                           <Label htmlFor="username">Username</Label>
//                           <Controller
//                             name="username"
//                             control={control}
//                             rules={{ required: "Username is required" }}
//                             render={({ field }) => (
//                               <Input
//                                 id="username"
//                                 placeholder="Enter username"
//                                 className={`form-control ${errors.username ? 'is-invalid' : ''}`}
//                                 {...field}
//                               />
//                             )}
//                           />
//                           {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
//                         </div>

//                         <div className="auth-form-group-custom mb-4">
//                           <i className="ri-lock-2-line auti-custom-input-icon"></i>
//                           <Label htmlFor="userpassword">Password</Label>
//                           <Controller
//                             name="password"
//                             control={control}
//                             rules={{ required: "Password is required" }}
//                             render={({ field }) => (
//                               <Input
//                                 id="userpassword"
//                                 type="password"
//                                 placeholder="Enter password"
//                                 className={`form-control ${errors.password ? 'is-invalid' : ''}`}
//                                 {...field}
//                               />
//                             )}
//                           />
//                           {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
//                         </div>

//                         <div className="form-check">
//                           <Input type="checkbox" className="form-check-input" id="customControlInline" />
//                           <Label className="form-check-label" htmlFor="customControlInline">Remember me</Label>
//                         </div>

//                         <div className="mt-4 text-center">
//                           <Button color="primary" className="w-md waves-effect waves-light" type="submit">Log In</Button>
//                         </div>

//                         <div className="mt-4 text-center">
//                           <Link to="/forgot-password" className="text-muted"><i className="mdi mdi-lock me-1"></i> Forgot your password?</Link>
//                         </div>
//                       </form>
//                     </div>

//                     <div className="mt-5 text-center">
//                       {/* <p>Don't have an account? <Link to="/register" className="fw-medium text-primary"> Register </Link></p> */}
//                       <p>© 2025 Glansa</p>
//                     </div>
//                   </div>
//                 </Col>
//               </Row>
//             </div>
//           </div>
//         </Col>
//         <Col lg={8}>
//           <div className="authentication-bg">
//             <div className="bg-overlay"></div>
//           </div>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Login;
