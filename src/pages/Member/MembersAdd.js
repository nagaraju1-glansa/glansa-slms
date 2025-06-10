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

const MembersAdd = () => {
  const [breadcrumbItems] = useState([
    { title: "Members List", link: "/members" },
    { title: "Add", link: "#" },
  ]);
  const [activeTab, setActiveTab] = useState(1);
  const [activeTabProgress, setActiveTabProgress] = useState(1);
  const [progressValue, setProgressValue] = useState(25);
  const { id } = useParams();  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
     femalecnt:0,
     malecnt:0
  });
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});

  const [sameAsCurrent, setSameAsCurrent] = useState(false);

  // Fetch data for the existing member if `id` exists in the URL
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const res = await CustomFetch(`/members/${id}`);
          const data = await res.json();
          if (data.success) {
            setFormData(data.member);
            console.log(data.member);
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

  const toggleTab = (tab) => {
    if (activeTab !== tab && tab >= 1 && tab <= 4) {
      setActiveTab(tab);
    }
  };

const handleInput = (e) => {
  const { name, type, value, checked } = e.target;
  let updated = {};

   if (type == 'checkbox') {
    updated = {
      ...formData,
      [name]: checked ? 1 : 0, // ✅ Use 1 for checked, 0 for unchecked
    };

      if (name == "sameAsCurrent") {
      if (value == 1) {
        updated = {
          ...updated,
          prmnthno: formData.tmphno,
          prmntlandmark: formData.tmplandmark,
          prmntcolony: formData.tmpcolony,
          prmntdist: formData.tmpdist,
          prmntmandal: formData.tmpmandal,
          prmntpin: formData.tmppin,
        };
      }
    }

    
  }
  else {
    updated = {
      ...formData,
      [name]: value,
    };
  }

  setFormData(updated);
  console.log(updated);
 
};

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
      mobile1,
      doj,
      surname,
      aadhaarno,
      tmphno,
      tmpcolony,
      tmpmandal,
      tmpdist,
    } = formData;
    const newErrors = {};

    if (activeTab === 1) {
      if (!(name || "").trim()) newErrors.name = "Name is required.";
      if (!(mobile1 || "").trim()) newErrors.mobile1 = "Mobile number is required.";
      if (!(doj || "").trim()) newErrors.doj = "Date of Join is required.";
      if (!(surname || "").trim()) newErrors.surname = "Surname is required.";
      if (!(aadhaarno || "").trim()) newErrors.aadhaarno = "Adhaar number is required.";


      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      toggleTab(2);
    } else if (activeTab === 2) {
      if (!(tmphno || "").trim()) newErrors.tmphno = "Temporary House No is required.";
      if (!(tmpmandal || "").trim()) newErrors.tmpmandal = "Temporary Mandal is required.";
      if (!(tmpcolony || "").trim()) newErrors.tmpcolony = "Temporary Mandal is required.";
      if (!(tmpdist || "").trim()) newErrors.tmpdist = "Temporary District is required.";




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
      const url = id ? `/updatemembers/${id}` : `/addmembers`;  // If `id` exists, it's an update, else it's add
      const form = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
        form.append(key, value);
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
        }).then((result) => {
          if (result.isConfirmed) {
            setPreview('');
            navigate('/members');
          }
        });
      }
      else{
        // alert(data.error);
        Swal.fire({
          title: 'Error',
          text: data.error || 'Something went wrong',
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
            title="Members Registration"
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
                          <span className="step-title">Member Details</span>
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
                                 <span className="text-danger"> *</span>
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
                                <Label
                                  className="form-label"
                                  htmlFor="aliasname"
                                >
                                  Alias name
                                </Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="aliasname"
                                  name="aliasname"
                                  value={formData.aliasname || ""}
                                  onChange={handleInput}
                                />
                              </div>
                              <div className="mb-3">
                                <Label>Select staying with</Label>
                                <select
                                  className="form-select"
                                  name="stayingwith"
                                  value={formData.stayingwith || ""}
                                  onChange={handleInput}
                                >
                                  <option value="">Select Staying with</option>
                                  <option value="Family">Family</option>
                                  <option value="Single">Single</option>
                                </select>
                              </div>
                               <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="stayingwithname"
                                >
                                  Staying with Name
                                </Label>
                                <input
                                  type="text"
                                  name="swname"
                                  className="form-control"
                                  id="swname"
                                  value={formData.swname || ""}
                                  onChange={handleInput}
                                />
                              </div>
                               <div className="mb-3">
                                <Label>Select SW. Occupation</Label>
                                <select
                                  className="form-select"
                                  name="swoccupan"
                                value={formData.swoccupan || ""}
                                  onChange={handleInput}
                                >
                                  <option value="">--Select SW.occupation--</option>
                                  <option value="House_Wife">House Wife</option>
                                  <option value="Tailoring">Tailoring</option>
                                  <option value="Self_Employee">Self Employee</option>
                                  <option value="Small_Scale_Industry">Small Scale Industry</option>
                                  <option value="Business">Business</option>
                                  <option value="Private_Job">Private Job</option>
                                  <option value="Govt_Job">Govt Job</option>
                                  <option value="Teacher">Teacher</option>
                                  <option value="Daily_Wages">Daily Wages</option>
                                  <option value="Others">Others</option>
                                  <option value="Student">Student</option>
                                  <option value="Driver">Driver</option>
                                </select>
                              </div>
                               <div className="mb-3">
                                <Label className="form-label" htmlFor="phone1">
                                  Mobile no.1{" "}
                                 <span className="text-danger"> *</span>
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="mobile1"
                                  name="mobile1"
                                  value={formData.mobile1 || ""}
                                  onChange={handleInput}
                                  required
                                />
                                {errors.mobile1 && (
                                  <div className="text-danger mt-1">
                                    {errors.mobile1}
                                  </div>
                                )}
                              </div>
                               <div className="mb-3">
                                <Label className="form-label" htmlFor="phone2">
                                  Mobile no.2{" "}
                                 
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="mobile2"
                                  name="mobile2"
                                  value={formData.mobile2 || ""}
                                  onChange={handleInput}
                                  required
                                />

                              </div>
                              <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="landline"
                                >
                                  Landline
                                </Label>
                                <Input
                                  type="text"
                                  name="landline"
                                  className="form-control"
                                  id="landline"
                                  value={formData.landline || ""}
                                  onChange={handleInput}
                                />
                              </div>
                               <div className="mb-3">
                                <Label>Select residency</Label>
                                <select
                                  className="form-select"
                                  name="residency"
                                  value={formData.residency || ""}
                                  onChange={handleInput}
                                >
                                 <option value="">--Select Residence--</option>
                                  <option value="Rented">Rented</option>
                                  <option value="Own">Own</option>
                                </select>
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
                                    <img src={formData.image} alt="Preview" style={{ maxWidth: '300px', height: '300px' }} />
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
                                  value={formData.doj || ""}
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
                                  {/* <span className="text-danger"> *</span> */}
                                </Label>
                                <input
                                  type="date"
                                  className="form-control"
                                  id="dob"
                                  name="dob"
                                  value={formData.dob || ""}
                                  onChange={handleInput}
                                  required
                                />
                                {/* {errors.dob && (
                                  <div className="text-danger mt-1">
                                    {errors.dob}
                                  </div>
                                )} */}
                              </div>
                              <div className="mb-3">
                                <Label>Select occupation</Label>
                                <select
                                  className="form-select"
                                  name="occupan"
                                  value={formData.occupan || ""}
                                  onChange={handleInput}
                                >
                                  <option value="">--Select Occupation--</option>
                                  <option value="House_Wife">House Wife</option>
                                  <option value="Tailoring">Tailoring</option>
                                  <option value="Self_Employee">Self Employee</option>
                                  <option value="Small_Scale_Industry">Small Scale Industry</option>
                                  <option value="Business">Business</option>
                                  <option value="Private_Job">Private Job</option>
                                  <option value="Govt_Job">Govt Job</option>
                                  <option value="Teacher">Teacher</option>
                                  <option value="Daily_Wages">Daily Wages</option>
                                  <option value="Others">Others</option>
                                  <option value="Student">Student</option>
                                  <option value="Driver">Driver</option>
                                </select>
                              </div>
                            <div className="mb-3">
                                <Label>Select M.Designation</Label>
                                <select
                                  className="form-select"
                                  name="designation"
                                  value={formData.designation || ""}
                                  onChange={handleInput}
                                >
                                  <option value="">--Select M.Designation--</option>
                                  <option value="Member">Member</option>
                                  <option value="Director">Director</option>
                                  <option value="Employee">Employee</option>
                                  <option value="Treasurer">Treasurer</option>
                                  <option value="Secretary">Secretary</option>
                                  <option value="Vice President">Vice President</option>
                                  <option value="President">President</option>
                                </select>
                              </div>
                               <div className="col-12 mb-3">
                                <Row>
                                  <Col md={6} className="mb-3 mb-md-0">
                                    <Label
                                    className="form-label"
                                    htmlFor="totalmembers"
                                  >
                                    Total members
                                  </Label>
                                  <input
                                    type="number"
                                    name="tfamilymembers"
                                    className="form-control"
                                    id="tfamilymembers"
                                    value={formData.tfamilymembers || ""}
                                    onChange={handleInput}
                                  />
                                  </Col>
                                  <Col md={6} className="mb-3 mb-md-0">
                                  <input
                                    type="number"
                                    name="femalecnt"
                                    className="form-control"
                                    id="femalecnt"
                                    value={formData.femalecnt || ""}
                                    onChange={handleInput}
                                    placeholder="Female count"
                                  />
                                  <input
                                    type="number"
                                    name="malecnt"
                                    className="form-control"
                                    id="malecnt"
                                    value={formData.malecnt || ""}
                                    onChange={handleInput}
                                    placeholder="Male count"
                                  />
                                  </Col>

                                </Row>

                              </div>
                               <div className="mb-3">
                                <Label
                                  className="form-label"
                                  htmlFor="aadhaarno"
                                >
                                  Aadhaar no.{" "}
                                  <span className="text-danger"> *</span>
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
                              </div>
                               <div className="mb-3">
                                <Label className="form-label" htmlFor="nominee">
                                  Enter Nominee details{" "}
                                  {/* <span style={{ color: "red" }}> *</span> */}
                                </Label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="nomineename"
                                  name="nomineename"
                                  value={formData.nomineename || ""}
                                  onChange={handleInput}
                                  required
                                />
                                {/* {errors.nomineename && (
                                  <div className="text-danger mt-1">
                                    {errors.nomineename}
                                  </div>
                                )} */}
                              </div>
                               <div className="mb-3">
                                <Label>Relation with nominee</Label>
                                <select
                                  className="form-select"
                                  name="rwnominee"
                                  value={formData.rwnominee || ""}
                                  onChange={handleInput}
                                >
                                  <option value="">--Relation With Nominee--</option>
                                  <option value="Husband">Husband</option>
                                  <option value="Daughter">Daughter</option>
                                  <option value="Son">Son</option>
                                  <option value="Father">Father</option>
                                  <option value="Mother">Mother</option>
                                  <option value="Uncle">Uncle</option>
                                  <option value="Aunty">Aunty</option>
                                  <option value="Son_In_Law">Son In Law</option>
                                  <option value="Daughter_in_law">Daughter in law</option>
                                  <option value="Others">Others</option>
                                </select>
                              </div>
                              <div className="mb-3">
                                <Label>Select M.no</Label>
                                <select
                                  className="form-select"
                                  name="mno"
                                  value={formData.mno || ""}
                                  onChange={handleInput}
                                >
                                  <option value="">Default</option>
                                  <option value="M.no">M.no</option>
                                  <option value="None">None</option>
                                </select>
                              </div>
                               
                              <div className="mb-3">
                                <Label className="form-label" htmlFor="referal">
                                  Enter Ref Mobile no
                                </Label>
                                <Input
                                  type="text"
                                  className="form-control"
                                  id="refmno"
                                  name="refmno"
                                  value={formData.refmno || ""}
                                  onChange={handleInput}
                                />
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
                                    name="tmphno"
                                    value={formData.tmphno || ""}
                                    id="basicpill-pancard-input5"
                                    onChange={handleInput}
                                  />
                                  {errors.tmphno && ( <div className="text-danger mt-1">{errors.tmphno}</div> )}
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
                                    name="tmplandmark"
                                    value={formData.tmplandmark || ""}
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
                                    name="tmpcolony"
                                    value={formData.tmpcolony || ""}
                                    className="form-control"
                                    id="basicpill-cstno-input7"
                                    onChange={handleInput}
                                  />
                                   {errors.tmpcolony && ( <div className="text-danger mt-1">{errors.tmpcolony}</div> )}
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
                                    name="tmpdist"
                                    value={formData.tmpdist || ""}
                                    className="form-control"
                                    id="basicpill-servicetax-input8"
                                    onChange={handleInput}
                                  />
                                    {errors.tmpdist && ( <div className="text-danger mt-1">{errors.tmpdist}</div> )}
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
                                    name="tmpmandal"
                                    value={formData.tmpmandal || ""}
                                    className="form-control"
                                    id="basicpill-companyuin-input9"
                                    onChange={handleInput}
                                  />
                                    {errors.tmpmandal && ( <div className="text-danger mt-1">{errors.tmpmandal}</div> )}
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
                                    name="tmppin"
                                    value={formData.tmppin || ""}
                                    className="form-control"
                                    id="basicpill-Declaration-input10"
                                    onChange={handleInput}
                                  />
                                </div>

                                
                              </Col>
                              <Col lg="12">
                              
                                <Input
                                    type="checkbox"
                                    id="sameAsCurrent"
                                    name="sameAsCurrent"
                                    value="1"
                                    checked={formData.sameAsCurrent === 1}
                                    onChange={handleInput}
                                  />
                                  <Label htmlFor="sameAsCurrent" style={{ marginLeft: "8px" }}>
                                    Same as Current Address
                                  </Label>
                              </Col>
                              <h3 className="card-title mb-4 mt-4">
                                Permanent Address 
                                {/* chechbox
                                 */}
                                 
                              </h3>
                              <Col lg="12">
                             
                              <Input
                                  type="checkbox"
                                  name="isownresidence"
                                  value="1"
                                  checked={formData.isownresidence === 1}
                                  id="isownresidence"
                                  onChange={handleInput}
                                />
                                 <Label
                                    className="form-label"
                                    htmlFor="basicpill-pancard-input5" style={{ marginLeft: "8px" }}
                                  >
                                    Own residence
                                  </Label>
                              </Col>
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
                                    name="prmnthno"
                                    id="basicpill-pancard-input5"
                                    value={formData.prmnthno || ""}
                                    onChange={handleInput}
                                    required
                                  />
                                  {errors.prmnthno && (
                                    <div className="text-danger mt-1">
                                      {errors.prmnthno}
                                    </div>
                                  )}
                                </div>
                              </Col>

                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-pancard-input5"
                                  >
                                    Enter landmark
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
                                    name="prmntlandmark"
                                    id="basicpill-pancard-input5"
                                    value={formData.prmntlandmark || ""}
                                    onChange={handleInput}
                                    required
                                  />
                                  {errors.prmntlandmark && (
                                    <div className="text-danger mt-1">
                                      {errors.prmntlandmark}
                                    </div>
                                  )}
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
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    name="prmntcolony"
                                    id="basicpill-pancard-input5"
                                    value={formData.prmntcolony || ""}
                                    onChange={handleInput}
                                    required
                                  />
                                  {errors.prmntcolony && (
                                    <div className="text-danger mt-1">
                                      {errors.prmntcolony}
                                    </div>
                                  )}
                                </div>
                              </Col>

                              <Col lg="6">
                                <div className="mb-3">
                                  <Label
                                    className="form-label"
                                    htmlFor="basicpill-servicetax-input8"
                                  >
                                    Enter District
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    name="prmntdist"
                                    id="basicpill-pancard-input5"
                                    value={formData.prmntdist || ""}
                                    onChange={handleInput}
                                    required
                                  />
                                  {errors.prmntdist && (
                                    <div className="text-danger mt-1">
                                      {errors.prmntdist}
                                    </div>
                                  )}
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
                                  </Label>
                                  <Input
                                    type="text"
                                    className="form-control"
                                    name="prmntmandal"
                                    id="basicpill-pancard-input5"
                                    value={formData.prmntmandal  || ""}
                                    onChange={handleInput}
                                    required
                                  />
                                  {errors.prmntmandal && (
                                    <div className="text-danger mt-1">
                                      {errors.prmntmandal}
                                    </div>
                                  )}
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
                                    className="form-control"
                                    name="prmntpin"
                                    id="basicpill-pancard-input5"
                                    value={formData.prmntpin || ""}
                                    onChange={handleInput}
                                    required
                                  />
                                  {errors.prmntpin && (
                                    <div className="text-danger mt-1">
                                      {errors.prmntpin}
                                    </div>
                                  )}
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
export default MembersAdd;
