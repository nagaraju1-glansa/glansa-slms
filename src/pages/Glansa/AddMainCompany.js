import React, { useState, useEffect } from "react";
import {
  Row, Col, Card, CardBody, Label, Input, Form, Container, Button, FormGroup
} from "reactstrap";
import Select from 'react-select';
import { Link, useParams , useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import { CustomFetch } from "../ApiConfig/CustomFetch";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { RoleId } from '../ApiConfig/ApiConfig';

const AddMainCompany = () => {
  const navigate = useNavigate();
   const [breadcrumbItems] = useState([
      { title: "Main Comany List", link: "/glansa-main-companies" },
      { title: "Add", link: "#" },
    ]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  const { id } = useParams();  
  const roleId = RoleId();
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    surname: "",
    phonenumber: "",
    email: "",
    username: "",
    password: "",
    usertype: "",
    role_id: "",
    doj: null,
    dob: null,
    aadhaarno: "",
    panno: "",
    hno: "",
    colony: "",
    landmark: "",
    dist: "",
    mandal: "",
    pincode: "",
    image: null,
    status: true,
    entryby: "Admin",
    entrydate: new Date(),
    admission_fee: "",
    form_fee: "",
    loan_eligibility: "",
    eligibility_amount: "",
    min_saving: "",
  });
  const [roles, setRoles] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreview(imageUrl);
    }
  };


const handleInput = (e, actionMeta = null) => {
  // Handle react-select
  if (actionMeta) {
    const { name } = actionMeta;
    setFormData(prev => ({
      ...prev,
      [name]: e.label, // or use e.value depending on what you need
    }));
    return;
  }

  // Handle normal HTML input
  const { name, type, value, checked } = e.target;
  let updated = {};

  if (type === 'checkbox') {
    updated = {
      ...formData,
      [name]: checked ? 1 : 0,
    };

    if (name === "sameAsCurrent") {
      if (checked) {
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
  } else {
    updated = {
      ...formData,
      [name]: value,
    };
  }

  setFormData(updated);
  console.log(updated);
};
  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  // Required field validations
  if (!formData.company_name) newErrors.company_name = "Company Name is required";
  if (!formData.name) newErrors.name = "Name is required";
  if (!formData.username) newErrors.username = "Username is required";
  if (!formData.password) newErrors.password = "Password is required";
  if (!formData.phonenumber) newErrors.phonenumber = "Phone number is required";

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return; // Don't submit if errors exist
  }

    try {
      const url = id ? `/forglansa-maincompanyupdate/${id}` : `/forglansa-maincompanyadd`;  // If `id` exists, it's an update, else it's add
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
            // roleId == 'Member' ? window.location.replace(`/memberview/${id}`) : navigate('/members');
            navigate('/glansa-main-companies');
          }
        });
      }
      else{
        // alert(data.error);
        Swal.fire({
          title: 'Error',
          text: data.message || 'Something went wrong',
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
            <Container fluid>
                 <Breadcrumbs
                            title="Company Registration"
                            breadcrumbItems={breadcrumbItems}
                          />
                
            <Card>
                <CardBody>
                {/* <h4 className="mb-4">Add New Member</h4> */}
                <Form onSubmit={handleSubmit}>
                    <Row>
                    <Col md={6}>
                      <FormGroup><Label>Company Name</Label><Input name="company_name" value={formData.company_name} onChange={handleInput}  />
                        {errors.company_name && <small className="text-danger">{errors.company_name}</small>}
                      </FormGroup>
                    </Col>
                    <Col md={6}><FormGroup><Label>Name</Label><Input name="name" value={formData.name} onChange={handleInput}  />
                        {errors.name && <small className="text-danger">{errors.name}</small>}
                    </FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date of Joining</Label><input type="date" name="doj" className="form-control" selected={formData.doj} onChange={handleInput} />
                       
                    </FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Date of Birth</Label><input type="date" name="dob" className="form-control" selected={formData.dob} onChange={handleInput} /></FormGroup></Col>

                    <Col md={6}><FormGroup><Label>Phone</Label><Input name="phonenumber" type="number" value={formData.phonenumber} onChange={handleInput}  />
                        {errors.phonenumber && <small className="text-danger">{errors.phonenumber}</small>}
                    </FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Email</Label><Input name="email" type="email" value={formData.email} onChange={handleInput} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Username</Label><Input type="text" name="username" value={formData.username} onChange={handleInput}   autoComplete="off"/>
                        {errors.username && <small className="text-danger">{errors.username}</small>}
                      </FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Password</Label><Input name="password" type="password" value={formData.password} onChange={handleInput}  autoComplete="new-password"  />
                        {errors.password && <small className="text-danger">{errors.password}</small>}
                    </FormGroup></Col>
                
                   
                    <Col md={6}><FormGroup><Label>Aadhar No</Label><Input name="aadhaarno" type="number" value={formData.aadhaarno} onChange={handleInput} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>PAN No</Label><Input name="panno" value={formData.panno} onChange={handleInput} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>House No</Label><Input name="hno" value={formData.hno} onChange={handleInput} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Colony</Label><Input name="colony" value={formData.colony} onChange={handleInput} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Landmark</Label><Input name="landmark" value={formData.landmark} onChange={handleInput} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>District</Label><Input name="dist" value={formData.dist} onChange={handleInput} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Mandal</Label><Input name="mandal" value={formData.mandal} onChange={handleInput} /></FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Pincode</Label><Input name="pincode" type="number" value={formData.pincode} onChange={handleInput} /></FormGroup></Col>
                    
                    <Col md={6}><FormGroup><Label>Photo</Label> <input
                                  type="file"
                                  className="form-control"
                                  id="image"
                                  name="image"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                />

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
                                            ? `${process.env.REACT_APP_APIURL_IMAGE}members/${formData.image}`
                                            : `${process.env.REACT_APP_APIURL_IMAGE}/user.jpg`
                                        }
                                        alt="Preview"
                                        style={{ maxWidth: '300px', height: '300px' }}
                                      />

                                  </div>
                                )}
                                </FormGroup></Col>
                    <Col md={6}><FormGroup><Label>Status</Label>
                                <select type="select" className="form-control" name="status" value={formData.status} onChange={handleInput} required>
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                                </FormGroup>
                    </Col>
                    </Row>
                    <Button type="submit" color="primary">Submit</Button>
                </Form>
                </CardBody>
            </Card>
            </Container>
        </div>
    </React.Fragment>
  );
};

export default AddMainCompany;
