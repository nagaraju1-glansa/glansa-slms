import React, { useState,useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Input,
  Form,
  Button,
  Container,
  Table
} from "reactstrap";
import { CustomFetch } from "../ApiConfig/CustomFetch";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Role = () => {
    const navigate = useNavigate();
  const [roleList, setRoleList] = useState([
    {
      id: '',
      name: "",
    },
  ]);

   const fetchRoleList = () => {
          CustomFetch('/roles')
        .then(response => response.json())
        .then(data => {
          setRoleList(data);
        })
        .catch(error => {
          console.error("Error fetching receipts:", error);
        });
    }

  useEffect(() =>{
   
    fetchRoleList();
  },[]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      // Edit
      CustomFetch(`/roles/${formData.id}`, {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        // console.log(data);
         if(data.success){
          // alert(data.error);
          Swal.fire({
            title: 'Success!',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK'
          })
        }
        else{
          // alert(data.error);
          Swal.fire({
            title: 'Error!',
            text: data.message,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
        fetchRoleList();
      })
      .catch(error => {
        console.error("Error fetching receipts:", error);
      });

    } else {

      CustomFetch('/addroles', {
        method: 'POST',
        body: JSON.stringify(formData),
      })
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        if(data.success){
          // alert(data.error);
          Swal.fire({
            title: 'Success!',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK'
          })
        }
        else{
          // alert(data.error);
          Swal.fire({
            title: 'Error!',
            text: data.message,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
        fetchRoleList();
      })
      .catch(error => {
        console.error("Error fetching receipts:", error);
      });

      // // Add
      // const newId = companyList.length
      //   ? Math.max(...companyList.map((c) => c.company_id)) + 1
      //   : 1;
      // setCompanyList([...companyList, { ...formData, company_id: newId }]);
    }

    setFormData({
      id: "",
      name: "",
    });
  };

  const handleEdit = (role) => {
    setFormData(role);
  };

  return (
     <React.Fragment>
        <div className="page-content">
             <div className='page-title-box d-sm-flex align-items-center justify-content-between'>
              <h4 className="mb-0">Roles</h4>
              <button type="button" className="btn btn-success waves-effect waves-light"  onClick={()=> navigate('/rolemanager') }>
                  <i className="fas fa-plus align-middle me-2"></i> Add Permissions 
              </button>
          </div>

          <Container className="">
            <Row>
              {/* Company Form */}
              <Col md={5}>
                <Card>
                  <CardBody>
                    <h5>{formData.id ? "Edit Role" : "Add Role"}</h5>
                    <Form onSubmit={handleSubmit}>
                      <Label>Name</Label>
                      <Input name="name" value={formData.name} onChange={handleChange} required />



                      <Button type="submit" color="primary" className="mt-3">
                        {formData.id ? "Update" : "Add"}
                      </Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>

              {/* Company List */}
              <Col md={7}>
                <Card>
                  <CardBody>
                    <h5>Company List</h5>
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {roleList.map((role) => (
                          <tr key={role.id}>
                            <td>{role.name}</td>

                            <td>
                              <Button color="warning" size="sm" onClick={() => handleEdit(role)}>
                                <i className="fas fa-edit"></i>
                              </Button>
                              {/* <Button color="warning" size="sm" onClick={() => Navigate(`/role/${role.id}`)}>
                                <i className="fas fa-bezier-curve"></i>
                              </Button> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
    </div>
    </React.Fragment>
  );
};

export default Role;
