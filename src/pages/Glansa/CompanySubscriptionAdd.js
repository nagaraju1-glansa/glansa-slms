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

const CompanyPayments = () => {
const [branches, setBranches] = useState([]);
  const [companyList, setCompanyList] = useState([
    {
      main_branch_id : '',
      name: "",
      subscription_end: '',
      subscription_start: "",
      updated: '',
    },
  ]);

//    const fetchCompanyList = () => {
//           CustomFetch('/forglansa-allbranches')
//         .then(response => response.json())
//         .then(data => {
//           setCompanyList(data);
//         })
//         .catch(error => {
//           console.error("Error fetching receipts:", error);
//         });
//     }

       const loadData = async () => {
          try {
            const res = await CustomFetch(`/forglansa-allbranches`);
            const data = await res.json();
            setBranches(data);
            setCompanyList(data);
          } catch (err) {
            console.log(err, "Error found");
          }
        };


  useEffect(() =>{
    loadData();
  },[]);
  
const [formData, setFormData] = useState({
  main_branch_id: "",
  subscription_start: "",
  subscription_end: "",
  updated: "",
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  if (!formData.main_branch_id) {
    Swal.fire({
      title: 'Error!',
      text: 'Please select a branch.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
    return;
  }

  CustomFetch(`/update-main-branch-subscription/${formData.main_branch_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription_start: formData.subscription_start,
      subscription_end: formData.subscription_end,
      updated: formData.updated,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });
        loadData();
        setFormData({
          main_branch_id: "",
          subscription_start: "",
          subscription_end: "",
          updated: "",
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    })
    .catch(error => {
      console.error("Error updating subscription:", error);
    });
};


const handleEdit = (branch) => {
  setFormData({
    main_branch_id: branch.main_branch_id,
    subscription_start: branch.subscription_start ?? "",
    subscription_end: branch.subscription_end ?? "",
    updated: new Date().toISOString().split('T')[0], // today's date
  });
};

  return (
     <React.Fragment>
        <div className="page-content">
          <Container className="py-4">
            <Row>
              {/* Company Form */}
              <Col md={5}>
                <Card>
                  <CardBody>
                    <h5 className="mt-2">{formData.main_branch_id ? "Edit Subscription Period" : "Add Subscription Period"}</h5>
                    <Form onSubmit={handleSubmit}>
                      <Label>Main Branch</Label>
                        <Input
                            type="select"
                            name="main_branch_id"
                            value={formData.main_branch_id}
                            onChange={handleChange}
                            required
                            style={{ height: "40px" }}
                        >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                            <option key={branch.main_branch_id} value={branch.main_branch_id}>
                                {branch.name} 
                            </option>
                            ))}
                        </Input>

                      <Label className="mt-2">Subscription Start Date </Label>
                      <Input name="subscription_start" type="date"  value={formData.subscription_start} onChange={handleChange} required />

                      <Label className="mt-2">Subscription End Date</Label>
                      <Input name="subscription_end" type="date" value={formData.subscription_end} onChange={handleChange} required />

                      <Label className="mt-2">Date</Label>
                      <Input name="updated" type="date" value={formData.updated} onChange={handleChange} required />

                      <Button type="submit" color="primary" className="mt-3">
                        Update
                    </Button>
                    </Form>
                  </CardBody>
                </Card>
              </Col>

              {/* Company List */}
              <Col md={7}>
                <Card>
                  <CardBody>
                    <h5 className="mt-2">Company Subscription Periods</h5>
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Company Name</th>
                          <th>Subscription Period</th>
                          <th>Update</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyList.map((company) => (
                          <tr key={company.id}>
                            <td>{company.name}</td>
                            <td>{company.subscription_start ?? "-"} to {company.subscription_end ?? "-"}</td>
                            <td>{company.updated}</td>
                            <td>
                              <Button color="warning" size="sm" onClick={() => handleEdit(company)}>
                                <i className="fas fa-edit"></i>
                              </Button>
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

export default CompanyPayments;
