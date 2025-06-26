import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, Row, Label, Input, Container } from "reactstrap";
import Select from 'react-select';
import Swal from 'sweetalert2';
import { CustomFetch } from '../ApiConfig/CustomFetch';
import { exportToExcel, exportToPDF } from './exportUtils';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import  ReceiptsDataTable from './ReceiptsReport';
import PaymentDataTable from './PaymentReports';
import DelayedLoanReport from './DelayedLoanReport';
import DelayedSavingReport from './DelayedSavingReport';


function Reports() {
   const [breadcrumbItems] = useState([
      { title: "Dashboard", link: "/dashboard" },
      { title: "Reports", link: "#" },
    ]);
  const navigate = useNavigate();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reportsType,selectedReportsType] = useState(null);
    const [reportSummary, setReportSummary] = useState(null);
    const [data, setData] = useState({
      total_receipt_amounts: [],
      total_payment_amounts: []
    });
    const [formData, setFormData] = useState({});
    const options = [
    { value: 1, label: "Receipts and Payments" },
    { value: 2, label: "Receipts Scroll" },
    { value: 3, label: "Payment Scroll" },
    {value: 4, label: "Delayed Savings"},
    {value: 5,label: "Delayed Loan"}
];

const handlerChange = (e) => {
  const { name, value } = e.target;
  setReportSummary(null);
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));
};

const handleReports = (option) => selectedReportsType(option);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.report_type == null) {
  Swal.fire({
    title: 'Error!',
    text: 'Please select a report type.',
    icon: 'error',
    confirmButtonText: 'OK'
  });
  return;
}

if (formData.from_date == null || formData.to_date == null) {
  Swal.fire({
    title: 'Error!',
    text: 'Please select from and to dates.',
    icon: 'error',
    confirmButtonText: 'OK'
  });
  return;
}

// if (!formData.from_date && formData.to_date) {
//   Swal.fire({
//     title: 'Error!',
//     text: 'Please select the start date.',
//     icon: 'error',
//     confirmButtonText: 'OK'
//   });
//   return;
// }



  // const dataToSend = {
  //   start_date: startDate,
  //   end_date: endDate,
  // };

  // // Determine endpoint based on selected report type
  // let endpoint = "show_reports.php";
  // if (reportsType && reportsType.label === "Receipts Scroll") {
  //   endpoint = "receipt_scroll.php";
  // } else if (reportsType && reportsType.label === "Payment Scroll") {
  //   endpoint = "payment_scroll.php";
  // }
  // else if (reportsType && reportsType.label == "Delayed Savings"){
  //   endpoint = "delayed_savings.php";
  // }
  // else if(reportsType && reportsType.label=="Delayed Loan"){
  //   endpoint ="delayed_loan.php";
  // }

  try {
    const response = await CustomFetch(`/reports`, {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    const res = await response.json();
    if(formData.report_type==1){
      setData(res);
    }
    else{
    setReportSummary(res.data);
    }
    
   

    if (response.ok) {
      // Swal.fire({
      //   title: 'Success!',
      //   text: 'Data fetched successfully.',
      //   icon: 'success',
      //   confirmButtonText: 'OK'
      // });
    } else {
      Swal.fire({
        title: 'Error!',
        text: data.error || 'Something went wrong.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};



// In your form element:


  return (
    
//     <div className='page-content'>
//       <div
//   style={{
//     display: 'flex',
//     justifyContent: 'flex-end',
//     marginBottom: '10px',
//     width: '100%',
//   }}
// >
//   <button
//     onClick={() => navigate('/SavingsList')}
//     style={{
//       backgroundColor: 'blue',
//       color: 'white',
//       padding: '6px 12px',
//       cursor: 'pointer',
//       border: 'none',
//       borderRadius: '4px',
//     }}
//   >
//     Back
//   </button>
// </div>
<React.Fragment>
      <div className="page-content">
      <Container fluid>
         <Breadcrumbs
                    title="Reports"
                    breadcrumbItems={breadcrumbItems}
                  />
        <Row>
          <Col xs={12}>

            <Card>
              <CardBody>

                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={13}>

                      <div className='mb-3'>
                        {/* <Select name='report_type' options={options} value={formData.report_type} onChange={handlerChange}/> */}
                        <Input
                          type="select"
                          name="report_type"
                          value={formData.report_type}
                          onChange={handlerChange}
                        >
                          <option value="">Select Report Type</option>
                          {options.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Input>

                      </div>
                      
                    </Col>
                    <Col md={5}>
                        <div className="mb-3">
                        <Label htmlFor="receipt-date-input">Start Date</Label>
                        <Input
                          id="receipt-date-input"
                          type="date"
                          name='from_date'
                          value={formData.from_date}
                          onChange={handlerChange}
                        />
                      </div>
                      
                    </Col>
                    <Col>
                        <div className="mb-3">
                        <Label htmlFor="lastpaid-date-input">End Date</Label>
                        <Input
                          id="lastpaid-date-input"
                          type="date"
                           value={formData.to_date}
                          name='to_date'
                          onChange={handlerChange}
                        />
                      </div>
                    </Col>
                    
                  </Row>
                  <Row className="justify-content-center mt-4">
                    <Col md={4} className="text-center">
                      <button type="submit" className="btn btn-primary">Submit</button>
                    </Col>
                  </Row>
                </form>
               


                {formData.report_type == 1 && 
                            Array.isArray(data.total_receipt_amounts) && 
                            Array.isArray(data.total_payment_amounts) && (
                    <div className="mt-4">
                       <>
                        <button className='btn btn-success' onClick={() => exportToExcel(data)}>Export to Excel</button>
                        <button className='btn btn-danger mr-2' onClick={() => exportToPDF(data)}>Export to PDF</button>
                        </>
                        <Row>
                            <h5 className='text-center' >
                                    Summary for Selected Period:  {formData.from_date} to {formData.to_date}
                                </h5>
                            <Col md={6}>
                              

                                    <table className="table table-bordered" style={{ maxWidth: 400 }}>
                                    <thead>
                                        <tr>
                                        <th>Receipts</th>
                                        <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                         {data.total_receipt_amounts.map((item, index) => (
                                          <tr key={index}>
                                            <td>{item.towards || 'N/A'}</td>
                                            <td>{parseFloat(item.total_amount).toLocaleString('en-IN')}</td>
                                          </tr>
                                        ))}
                                    </tbody>
                                    </table>
                            </Col>
                            <Col md={6}>
                               
                                    <br/>
                                    <br/>
                                    <table className="table table-bordered" style={{ maxWidth: 400 }}>
                                    <thead>
                                        <tr>
                                        <th>Receipts</th>
                                        <th>Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.total_payment_amounts.map((item, index) => (
                                          <tr key={index}>
                                            <td>{item.towards || 'N/A'}</td>
                                            <td>{parseFloat(item.total_amount).toLocaleString('en-IN')}</td>
                                          </tr>
                                        ))}
                                    </tbody>
                                    </table>
                            </Col>
                            
                        </Row>
                    </div>
                )}

                 { formData.report_type == 2 && Array.isArray(reportSummary) && (
                    <div style={{ overflowX: 'auto', marginTop: 30 }}>
                        <h5 style={{ textAlign: 'center', marginBottom: '20px' }}>
                            Receipts Scroll Data
                        </h5>
                      <ReceiptsDataTable data={reportSummary} />
                    </div>
                )}

                { formData.report_type == 3 && Array.isArray(reportSummary) && (
                    <div style={{ overflowX: 'auto', marginTop: 30 }}>
                        <h5 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        Payment Scroll Data
                        </h5>
                        <PaymentDataTable data={reportSummary} />
                    </div>
                )}

                { formData.report_type == 4 && Array.isArray(reportSummary) && (
                    <div style={{ overflowX: 'auto', marginTop: 30 }}>
                        <h5 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        Delayed Saving Data
                        </h5>
                        <DelayedSavingReport data={reportSummary} />
                    </div>
                )}


                { formData.report_type == 5 && Array.isArray(reportSummary) && (
                    <div style={{ overflowX: 'auto', marginTop: 30 }}>
                        <h5 style={{ textAlign: 'center', marginBottom: '20px' }}>
                        Delayed Loan Data
                        </h5>
                        <DelayedLoanReport data={reportSummary} />
                    </div>
                )}

                
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  </React.Fragment>
  );
}

export default Reports;

