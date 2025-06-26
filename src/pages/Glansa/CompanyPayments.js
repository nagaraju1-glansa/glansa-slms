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
      created: '',
      amount: "",
      date: "",
    },
  ]);

   const fetchCompanyList = () => {
          CustomFetch('/forglansa-allcompanypayments')
        .then(response => response.json())
        .then(data => {
          setCompanyList(data);
        })
        .catch(error => {
          console.error("Error fetching receipts:", error);
        });
    }

       const loadData = async () => {
          try {
            const res = await CustomFetch(`/forglansa-allbranches`);
            const data = await res.json();
            setBranches(data);
          } catch (err) {
            console.log(err, "Error found");
          }
        };


  useEffect(() =>{
    fetchCompanyList();
    loadData();
  },[]);

const [formData, setFormData] = useState({
  id: "", // used only for update
  main_branch_id: "",
  name: "",
  subscription_end: "",
  subscription_start: "",
  created: "",
  amount: "",
  date: "",
  subscription_name: "",
  status: "1"
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const endpoint = formData.id
    ? `/editcompanypayment/${formData.id}`
    : '/addcompanypayment';

  CustomFetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        Swal.fire('Success!', data.message, 'success');
        fetchCompanyList(); // reload list
        setFormData({
          id: "",
          main_branch_id: "",
          name: "",
          subscription_end: "",
          subscription_start: "",
          created: "",
          amount: "",
          date: "",
          subscription_name: "",
          status: "1"
        });
      } else {
        Swal.fire('Error!', data.message, 'error');
      }
    })
    .catch(err => {
      console.error("Submit error:", err);
      Swal.fire('Error!', 'Something went wrong.', 'error');
    });
};

const handleEdit = (company) => {
  setFormData({
    id: company.id,
    main_branch_id: company.main_branch_id || "",
    name: company.name || "",
    subscription_start: company.subscription_start || "",
    subscription_end: company.subscription_end || "",
    amount: company.amount || "",
    subscription_name: company.subscription_name || "",
    status: company.status?.toString() || "1",
    date: company.date || company.created || ""
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
                    <h5>{formData.id ? "Update Payment" : "Add Payments"}</h5>
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
                      <Input name="subscription_start" type="date" min={1} value={formData.subscription_start} onChange={handleChange} required />

                      <Label className="mt-2">Subscription End Date</Label>
                      <Input name="subscription_end" type="date" min={1} value={formData.subscription_end} onChange={handleChange} required />

                      <Label className="mt-2">Amount</Label>
                      <Input name="amount" type="number" min={1} value={formData.amount} onChange={handleChange} required />

                      <Label className="mt-2">Subscription Name</Label>
                      <Input name="subscription_name" type="text"  value={formData.subscription_name} onChange={handleChange} required />

                      <Label className="mt-2">Status</Label>
                      <Input type="select" name="status" value={formData.status} onChange={handleChange} required style={{ height: "40px" }}>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </Input>

                      <Label className="mt-2">Date</Label>
                      <Input name="date" type="date" value={formData.date} onChange={handleChange} required />

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
                    <h5 className="mb-3">Payments List</h5>
                    <Table bordered hover responsive>
                      <thead>
                        <tr>
                          <th>Company Name</th>
                          <th>Subscription Period</th>
                          <th>Date</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyList.map((company) => (
                          <tr key={company.id}>
                            <td>{company.main_branch?.name}</td>
                            <td>{company.subscription_start} to {company.subscription_end}</td>
                            <td>{company.created}</td>
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
