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

const Company = () => {
  const [companyList, setCompanyList] = useState([
    {
      company_id: '',
      name: "",
      min_saving: '',
      admission_fee: "",
      form_fee: '',
      loan_eligibility: "",
      eligibility_amount: "",
      status: "",
      date: "",
    },
  ]);

   const fetchCompanyList = () => {
          CustomFetch('/listcompany')
        .then(response => response.json())
        .then(data => {
          setCompanyList(data);
        })
        .catch(error => {
          console.error("Error fetching receipts:", error);
        });
    }

  useEffect(() =>{
   
    fetchCompanyList();
  },[]);

  const [formData, setFormData] = useState({
    company_id: "",
    name: "",
    min_saving: "100",
    admission_fee: "150",
    form_fee: "5",
    loan_eligibility: "12",
    eligibility_amount: "3",
   status: '1',
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.company_id) {
      // Edit
      CustomFetch(`/editcompany/${formData.company_id}`, {
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
        fetchCompanyList();
      })
      .catch(error => {
        console.error("Error fetching receipts:", error);
      });

    } else {

      CustomFetch('/addcompany', {
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
        fetchCompanyList();
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
      company_id: "",
      name: "",
      min_saving: "",
      admission_fee: "",
      form_fee: "",
      loan_eligibility: "",
      eligibility_amount: "",
      status: "",
      date: "",
    });
  };

  const handleEdit = (company) => {
    setFormData(company);
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
                    <h5>{formData.company_id ? "Edit Company" : "Add Company"}</h5>
                    <Form onSubmit={handleSubmit}>
                      <Label>Name</Label>
                      <Input name="name" value={formData.name} onChange={handleChange} required />

                      <Label className="mt-2">Minimum Saving</Label>
                      <Input name="min_saving" type="number" min={1} value={formData.min_saving} onChange={handleChange} required />

                      <Label className="mt-2">Admission Fee</Label>
                      <Input name="admission_fee" type="number" min={1} value={formData.admission_fee} onChange={handleChange} required />

                      <Label className="mt-2">Form Fee</Label>
                      <Input name="form_fee" type="number" min={1} value={formData.form_fee} onChange={handleChange} required />

                      <Label className="mt-2">Loan Eligibility (In Months)</Label>
                      <Input name="loan_eligibility" type="number" min={1} value={formData.loan_eligibility} onChange={handleChange} required />

                      <Label className="mt-2">Loan Eligibility Amount (No of times) </Label>
                      <Input name="eligibility_amount" type="number" min={1} value={formData.eligibility_amount} onChange={handleChange} required />
                      <span className="text-muted">Note: Total Savings * No (EX : 1000 * 3)</span><br></br>

                      <Label className="mt-2">Status</Label>
                      <Input type="select" name="status" value={formData.status} onChange={handleChange} required style={{ height: "40px" }}>
                        <option value="1">Active</option>
                        <option value="0">Inactive</option>
                      </Input>

                      <Label className="mt-2">Date</Label>
                      <Input name="date" type="date" value={formData.date} onChange={handleChange} required />

                      <Button type="submit" color="primary" className="mt-3">
                        {formData.company_id ? "Update" : "Add"}
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
                          <th>Min Saving</th>
                          <th>Eligibility</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyList.map((company) => (
                          <tr key={company.company_id}>
                            <td>{company.name}</td>
                            <td>{company.min_saving}</td>
                            <td>{company.loan_eligibility}</td>
                            <td>{company.status}</td>
                            <td>{company.date}</td>
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

export default Company;
