import React, { useState, useEffect , } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  TabContent,
  TabPane,
  NavItem,
  NavLink,
  Label,
  Input,
  Form,
  Progress,
  Container,
} from "reactstrap";
import classnames from "classnames";
import { Link, useParams , useNavigate} from "react-router-dom";

// Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CustomFetch } from "../ApiConfig/CustomFetch";
import Swal from "sweetalert2";
import { RoleId } from '../ApiConfig/ApiConfig';
import {
  validatePhoneNumber,
  validateTextOnly,
  validateAadhaar,
  validatePAN
} from "../../assets/js/validation";

const EmployeeAdd = () => {
  const [breadcrumbItems] = useState([
    { title: "Employee Registration", link: "/members" },
    { title: "Add", link: "#" },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [activeTabProgress, setActiveTabProgress] = useState(1);
  const [progressValue, setProgressValue] = useState(25);
  const { id } = useParams();  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
     name: "",
     email: "",
     password: "",
     username: "",
     phonenumber: "",
     role_id: "",
     doj: "",
     dob: "",
     aadhaarno: "",
     panno: "",
     hno: "",
     colony: "",
     mandal: "",
     dist: "",
     pincode: "",
     acntno: "",
     ifsccode: "",
     acntname: "",
     bankname: "",
     status: 1,


  });
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);

  const [sameAsCurrent, setSameAsCurrent] = useState(false);
  const roleId = RoleId();

  // Fetch data for the existing member if `id` exists in the URL
  useEffect(() => {
          fetchRoles();
    if (id) {
      const fetchData = async () => {
        try {
          const res = await CustomFetch(`/get-user/${id}`);
          const data = await res.json();
          if (data.success) {
            setFormData(data.user);
            console.log(data.user);
          }
        } catch (err) {
          console.log("Error fetching member data:", err);
        }
      };
      fetchData();

    }
    else{
      setFormData({});
    }
  }, [id]);


  const fetchRoles = async () => {
          const res = await CustomFetch('/roles');
          const data = await res.json();
          setRoles(data);
      };
  

  const toggleTab = (tab) => {
    if (activeTab !== tab && tab >= 1 && tab <= 4) {
      setActiveTab(tab);
    }
  };

  const handleInput = (e) => {
  const { name, type, value, checked, files } = e.target;

  let updated = {
    ...formData,
    [name]:
      type === 'checkbox' ? (checked ? 1 : 0) :
      // type === 'file' ? files[0] :
      type === 'number' ? parseInt(value || 0) :
      type === 'text' ? value.trimStart() :
      value,
  };

  setFormData(updated);
};

// const handleInput = (e) => {
//   const { name, type, value, checked } = e.target;
//   let updated = {};

//    if (type == 'checkbox') {
//     updated = {
//       ...formData,
//       [name]: checked ? 1 : 0, // ✅ Use 1 for checked, 0 for unchecked
//     };
    
//   }
//   else {
//     updated = {
//       ...formData,
//       [name]: value,
//     };
//   }

//   setFormData(updated);
// //   console.log(updated);
 
// };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };


  const handleNextClick = () => {
    const {
      name,
      phonenumber,
      doj,
      surname,
      aadhaarno,
      hno,
      colony,
      mandal,
      dist,
      password,
      username,
      role_id,
      dob,
      email
    } = formData;
    const newErrors = {};

    if (activeTab === 1) {
      if (!(name || "").trim()) newErrors.name = "Name is required.";
      if (!(phonenumber || "").trim()) newErrors.phonenumber = "Phone number is required.";
      if (!(doj || "").trim()) newErrors.doj = "Date of Join is required.";
      if (!(dob || "").trim()) newErrors.dob = "Date of Birth is required.";

    //   if (!(surname || "").trim()) newErrors.surname = "Surname is required.";
    //   if (!(aadhaarno || "").trim()) newErrors.aadhaarno = "Adhaar number is required.";
      if (!id && !(formData.password || "").trim()) newErrors.password = "Password is required.";
      if (!(email || "").trim()) newErrors.email = "Email is required.";
      if (!(username || "").trim()) newErrors.username = "Username is required.";
      if (!(role_id || "")) newErrors.role_id = "Role is required.";



      if (!validatePhoneNumber(formData.phonenumber) && formData.phonenumber) {
        newErrors.phonenumber = "Enter a valid 10-digit mobile number.";
      }

      if (!validateTextOnly(formData.name)) {
        newErrors.name = "Name should contain only letters.";
      }

      if (!validateAadhaar(formData.aadhaarno) && formData.aadhaarno) {
        newErrors.aadhaarno = "Enter a valid 12-digit Aadhaar number.";
      }

      if (!validatePAN(formData.panno)  && formData.panno ) {
        newErrors.panno = "Enter a valid PAN number (e.g. ABCDE1234F).";
      }



      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      toggleTab(2);
    } else if (activeTab === 2) {
      if (!(hno || "").trim()) newErrors.hno = "Temporary House No is required.";
      if (!(mandal || "").trim()) newErrors.mandal = "Temporary Mandal is required.";
      if (!(colony || "").trim()) newErrors.colony = "Temporary Mandal is required.";
      if (!(dist || "").trim()) newErrors.dist = "Temporary District is required.";




      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      toggleTab(3);
    } else if (activeTab === 3) {

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      toggleTab(4);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const url = id ? `/edit-user/${id}` : `/add-user`;  // If `id` exists, it's an update, else it's add
      const form = new FormData();
    //     Object.entries(formData).forEach(([key, value]) => {
    //     form.append(key, value);
    //   });
    Object.entries(formData).forEach(([key, value]) => {
  if (value && value !== 'null') {
    form.append(key, value);
  }
});
      if (image) {
        form.append('image', image);
      }
      const res = await CustomFetch(url, {
        method : 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.success) {
        // alert(data.message);
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK',
        })
        setPreview('');
        roleId == 3 ? navigate('/profile') :  navigate('/employees');

      }
      else{
        // alert(data.error);
        Swal.fire({
          title: 'Error',
          html: data.errors
            ? Object.values(data.errors).map(errArr => errArr.join('<br>')).join('<br><hr>')
            : 'Something went wrong',
          icon: 'error',
        })
      }
      // console.log("Success:", data);
    } catch (err) {
      console.log(err, "Error found");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs
            title="Employee Registration"
            breadcrumbItems={breadcrumbItems}
          />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Member</h4>

                  <div id="basic-pills-wizard" className="twitter-bs-wizard">
                    <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === 1 })}
                        >
                          <span className="step-number">01</span>
                          <span className="step-title">Employee Details</span>
                        </NavLink>
                      </NavItem>
                      {/*  */}
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === 2 })}
                        >
                          <span className="step-number">02</span>
                          <span className="step-title">Address Details</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames({ active: activeTab === 3 })}
                        >
                          <span className="step-number">03</span>
                          <span className="step-title">Bank Details</span>
                        </NavLink>
                      </NavItem>
                    </ul>
                    <TabContent
                      activeTab={activeTab}
                      className="twitter-bs-wizard-tab-content"
                    >
                      <TabPane tabId={1}>
                        <Form>
                          <Row>
                            <Col lg="6">
                              <div className="mb-3">
                                <Label className="form-label" htmlFor="name">
                                  First name{" "}
                                  <span className="text-danger"> *</span>
                                </Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="name"
                                  name="name"
                                  value={formData.name || " "}
                                  onChange={handleInput}
                                  required
                                />
                                {errors.name && (
                                  <div className="text-danger mt-1">
                                    {errors.name}
                                  </div>
                                )}
                              </div>
                              <div className="mb-3">
                                <Label className="form-label" htmlFor="surname">
                                  Surname{" "}
                                 {/* <span className="text-danger"> *</span> */}
                                </Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="surname"
                                  name="surname"
                                  value={formData.surname || ""}
                                  onChange={handleInput}
                                  required
                                />
                                {errors.surname && (
                                  <div className="text-danger mt-1">
                                    {errors.surname}
                                  </div>
                                )}
                              </div>

          

                               <div className="mb-3">
                                <Label className="form-label" htmlFor="phone1">
                                  Mobile {" "}
                                 <span className="text-danger"> *</span>
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="phonenumber"
                                  name="phonenumber"
                                  value={formData.phonenumber || ""}
                                  onChange={handleInput}
                                  required
                                />
                                {errors.phonenumber && (
                                  <div className="text-danger mt-1">
                                    {errors.phonenumber}
                                  </div>
                                )}
                              </div>

                              <div className="mb-3">
                                <Label className="form-label" htmlFor="phone1">
                                  Email
                                 <span className="text-danger"> *</span>
                                </Label>
                                <Input
                                  type="email"
                                  className="form-control"
                                  id="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInput}
                                  required
                                />
                                {errors.email && (
                                  <div className="text-danger mt-1">
                                    {errors.email}
                                  </div>
                                )}
                              </div>


                              <div className="mb-3">
                                <Label className="form-label" htmlFor="phone1">
                                  Username
                                 <span className="text-danger"> *</span>
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="username"
                                  name="username"
                                  value={formData.username || ""}
                                  onChange={handleInput}
                                  required
                                />
                                {errors.username && (
                                  <div className="text-danger mt-1">
                                    {errors.username}
                                  </div>
                                )}
                              </div>

                              <div className="mb-3">
                                <Label className="form-label" htmlFor="phone1">
                                  Password
                                 <span className="text-danger"> *</span>
                                </Label>
                                <Input
                                  type="password"
                                  className="form-control"
                                  id="password"
                                  name="password"
                                  value={formData.password || ""}
                                  onChange={handleInput}
                                  required
                                />
                                {errors.password && (
                                  <div className="text-danger mt-1">
                                    {errors.password}
                                  </div>
                                )}
                              </div>



                              <div className="mb-3">
                                <Label className="form-label" htmlFor="image">
                                  Upload Image
                                </Label>
                                <input
                                  type="file"
                                  className="form-control"
                                  id="image"
                                  name="image"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />
                              </div>
                              {preview && (
                                  <div className="mt-3">
                                    <p>Image Preview:</p>
                                    <img src={preview} alt="Preview" style={{ maxWidth: '300px', height: '300px' }} />
                                  </div>
                                )}
                                {formData.image &&(
                                  <div className="mt-3">
                                    <p>Image :</p>
                                      <img
                                        src={
                                          formData.image
                                            ? `${process.env.REACT_APP_APIURL_IMAGE}employees/${formData.image}`
                                            : `${process.env.REACT_APP_APIURL_IMAGE}/user.jpg`
                                        }
                                        alt="Preview"
                                        style={{ maxWidth: '300px', height: '300px' }}
                                      />
                                  </div>
                                )}
                              
                            </Col>

                            <Col lg="6">
                              <div className="mb-3">
                                <Label className="form-label" htmlFor="jdate">
                                  Joining date{" "}
                                  <span className="text-danger"> *</span>
                                </Label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="doj"
                                  name="doj"
                                  value={formData.doj}
                                  onChange={handleInput}
                                  required
                                />
                                {errors.doj && (
                                  <div className="text-danger mt-1">
                                    {errors.doj}
                                  </div>
                                )}
                              </div>
                               <div className="mb-3">
                                <Label className="form-label" htmlFor="dob">
                                  Date of birth{" "}
                                  <span className="text-danger"> *</span>
                                </Label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="dob"
                                  name="dob"
                                  value={formData.dob}
                                  onChange={handleInput}
                                  required
                                />
                                {errors.dob && (
                                  <div className="text-danger mt-1">
                                    {errors.dob}
                                  </div>
                                )}
                              </div>
   
                            <div className="mb-3">
                                <Label>Select Role
                                  <span className="text-danger"> *</span>
                                </Label>
                                <select
                                  className="form-select"
                                  name="role_id"
                                  value={formData.role_id || ""}
                                  onChange={handleInput}
                                >
                                  <option value="">--Select Role--</option>
                                  {roles && roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                      {role.name}
                                    </option>
                                  ))}
                                  {/* <option value="2">Admin</option>
                                  <option value="3">Manager</option>
                                  <option value="4">Employee</option> */}
                                  {/* <option value="Secretary">Secretary</option>
                                  <option value="Vice President">Vice President</option>
                                  <option value="President">President</option> */}
                                </select>
                                {errors.role_id && (
                                  <div className="text-danger mt-1">
                                    {errors.role_id}
                                  </div>
                                )}
                              </div>

                               <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="aadhaarno"
                                >
                                  Aadhaar no.{" "}
                                  {/* <span className="text-danger"> *</span> */}
                                </Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="aadhaarno"
                                  name="aadhaarno"
                                  value={formData.aadhaarno || ""}
                                  onChange={handleInput}
                                  required
                                />
                                {errors.aadhaarno && (
                                  <div className="text-danger mt-1">
                                    {errors.aadhaarno}
                                  </div>
                                )}
                              </div>
                               <div className="mb-3">
                                <Label className="form-label" htmlFor="panno">
                                  Enter Pan number
                                </Label>
                                <input
                                  type="text"
                                  name="panno"
                                  className="form-control"
                                  id="panno"
                                  value={formData.panno || ""}
                                  onChange={handleInput}
                                />
                                {errors.panno && (
                                  <div className="text-danger mt-1">
                                    {errors.panno}
                                  </div>
                                )}
                              </div>
                                <div className="mb-3">
                                <Label className="form-label" htmlFor="panno">
                                 Status
                                </Label>
                                <select
                                  type="select"
                                  name="status"
                                  className="form-control"
                                //   id="status"
                                  value={formData.status || ""}
                                  onChange={handleInput}
                                >
                                  <option value="Active">Active</option>
                                  <option value="Inactive">Inactive</option>
                                </select>
                                </div>


                            </Col>

                          </Row>
                        </Form>
                      </TabPane>
                      <TabPane tabId={2}>
                        <div>
                          <Form>
                            <h3 className="card-title mb-4">Current Address</h3>
                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-pancard-input5"
                                  >
                                    Enter H.No
                                    <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      {" "}
                                      *{" "}
                                    </span>
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    name="hno"
                                    value={formData.hno || ""}
                                    id="basicpill-pancard-input5"
                                    onChange={handleInput}
                                  />
                                  {errors.hno && ( <div className="text-danger mt-1">{errors.hno}</div> )}
                                </div>
                              </Col>

                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-vatno-input6"
                                  >
                                    Enter landmark
                                   
                                  </Label>
                                  <Input
                                    type="text"
                                    name="landmark"
                                    value={formData.landmark || ""}
                                    className="form-control"
                                    id="basicpill-vatno-input6"
                                    onChange={handleInput}
                                  />
                                  
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-cstno-input7"
                                  >
                                    Enter Colony
                                     <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      {" "}
                                      *{" "}
                                    </span>
                                  </Label>
                                  <Input
                                    type="text"
                                    name="colony"
                                    value={formData.colony || ""}
                                    className="form-control"
                                    id="basicpill-cstno-input7"
                                    onChange={handleInput}
                                  />
                                   {errors.colony && ( <div className="text-danger mt-1">{errors.colony}</div> )}
                                </div>
                              </Col>

                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-servicetax-input8"
                                  >
                                    Enter District
                                     <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      {" "}
                                      *{" "}
                                    </span>
                                  </Label>
                                  <Input
                                    type="text"
                                    name="dist"
                                    value={formData.dist || ""}
                                    className="form-control"
                                    id="basicpill-servicetax-input8"
                                    onChange={handleInput}
                                  />
                                    {errors.dist && ( <div className="text-danger mt-1">{errors.dist}</div> )}
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-companyuin-input9"
                                  >
                                    Enter mandal
                                     <span
                                      style={{
                                        color: "red",
                                        marginLeft: "4px",
                                      }}
                                    >
                                      {" "}
                                      *{" "}
                                    </span>
                                  </Label>
                                  <Input
                                    type="text"
                                    name="mandal"
                                    value={formData.mandal || ""}
                                    className="form-control"
                                    id="basicpill-companyuin-input9"
                                    onChange={handleInput}
                                  />
                                    {errors.mandal && ( <div className="text-danger mt-1">{errors.mandal}</div> )}
                                </div>
                              </Col>

                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-declaration-input10"
                                  >
                                    Enter pincode
                                  </Label>
                                  <Input
                                    type="text"
                                    name="pincode"
                                    value={formData.pincode || ""}
                                    className="form-control"
                                    id="basicpill-Declaration-input10"
                                    onChange={handleInput}
                                  />
                                </div>

                                
                              </Col>

                             
      
                              

                             
           
                            </Row>
                          </Form>
                        </div>
                      </TabPane>
                      <TabPane tabId={3}>
                        <div>
                          <Form>
                          
                            <Row>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-cardno-input12"
                                  >
                                    Account no
                                   
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-cardno-input12"
                                    name="acntno"
                                    value={formData.acntno || ""}
                                    onChange={handleInput}
                                    required
                                  />
                                  {errors.acntno && (
                                    <div className="text-danger mt-1">
                                      {errors.acntno}
                                    </div>
                                  )}
                                </div>
                              </Col>

                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-cardno-input12"
                                  >
                                    IFSC Code
                                   
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-cardno-input12"
                                    name="ifsccode"
                                    value={formData.ifsccode || ""}
                                    onChange={handleInput}
                                    required
                                  />
                                  {errors.ifsccode && (
                                    <div className="text-danger mt-1">
                                      {errors.ifsccode}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-cardno-input12"
                                  >
                                    Account holder name
                                    
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-cardno-input12"
                                    name="acntname"
                                    value={formData.acntname || ""}
                                    onChange={handleInput}
                                    required
                                  />
                                  {errors.acntname && (
                                    <div className="text-danger mt-1">
                                      {errors.acntname}
                                    </div>
                                  )}
                                </div>
                              </Col>
                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-cardno-input12"
                                  >
                                    Bank name
                                   
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    id="basicpill-cardno-input12"
                                    name="bankname"
                                    value={formData.bankname || ""}
                                    onChange={handleInput}
                                    required
                                  />
                                  {errors.bankname && (
                                        <div className="text-danger mt-1">{errors.bankname}</div>
                                    )}
                                </div>
                              </Col>
                            </Row>
                          </Form>
                        </div>
                      </TabPane>
                    </TabContent>
                    <ul className="pager wizard twitter-bs-wizard-pager-link d-flex justify-content-between align-items-center">
                      <li
                        className={
                          activeTab === 1 ? "previous disabled" : "previous"
                        }
                      >
                        <Link
                          to="#"
                          onClick={() => {
                            toggleTab(activeTab - 1);
                          }}
                        >
                          Previous
                        </Link>
                      </li>

                      {activeTab === 3 ? (
                        <li className="submit ms-auto">
                          {" "}
                          {/* ms-auto pushes it to the right */}
                          <button
                            type="submit"
                            onClick={handleSubmit}
                            className="btn btn-primary"
                          >
                            Submit
                          </button>
                        </li>
                      ) : (
                        <li className="next ms-auto">
                          <Link to="#" onClick={handleNextClick}>
                            Next
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default EmployeeAdd;
