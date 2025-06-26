import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  CardBody,
  Col,
  Row,
  Label,
  Input,
  Container,
} from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { CustomFetch } from "../ApiConfig/CustomFetch";
import Select from "react-select";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import ReceiptPrint from "./ReceiptPrint";

const ReceiptsAdd = () => {
  const [breadcrumbItems] = useState([
    { title: "Dashboard", link: "/dashboard" },
    { title: "Add", link: "#" },
  ]);

  const today = new Date().toISOString().split("T")[0];
    const navigate = useNavigate();

  const [mno, setMno] = useState([]);
  const [selectedMno, setSelectedMno] = useState(null);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [transactionOptions, setTransactionOptions] = useState([]);
  const [loanTypeOptions, setLoanTypeOptions] = useState([]);

  const [receiptData, setReceiptData] = useState(null);
const [showReceiptModal, setShowReceiptModal] = useState(false);

const initialState = {
    receipt_date: today,
    amount: '0',
    latefee: '0',
    interest: '0',
    totalamount: '0',
    clearancedate: '',
    loanacntno: '0',
    loantypecode: '0',
    loanpending: '0',
    roi: '0',
    issueamount: '0',
    modeofrepayment: '0',
    towardscode: '',
    trantypecode: '',
    mno: '',
    membername: '',
    lastpaiddate: '',
    m_no: '',
  };
  const [formData, setFormData] = useState(initialState);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    CustomFetch("/members")
      .then((res) => res.json())
      .then(setMno)
      .catch(console.error);

    CustomFetch("/dropdown-options/parent/45")
      .then((res) => res.json())
      .then(setPaymentOptions)
      .catch(console.error);

    CustomFetch("/dropdown-options/parent/3")
      .then((res) => res.json())
      .then(setTransactionOptions)
      .catch(console.error);

    CustomFetch("/dropdown-options/parent/4")
      .then((res) => res.json())
      .then(setLoanTypeOptions)
      .catch(console.error);
  }, []);




  const optionsSelect = mno.map((item) => ({
    value: item.m_no_encpt,
    label: item.member_id,
    m_no: item.m_no,
    membername: item.name,
    image: item.image
  }));

  const handleMNoChange = (selectedOption) => {
    handleClear(); // clear previous form data
    setFormData((prev) => ({
      ...prev,
      mno: selectedOption,
      membername: selectedOption.membername || '',
      image: selectedOption.image
    }));
    setSelectedMno(selectedOption);
    
   
  };


  useEffect(() => {
  const amount = parseFloat(formData.amount) || 0;
  const latefee = parseFloat(formData.latefee) || 0;
  const interest = parseFloat(formData.interest) || 0;


  let  total =0;

  // if (formData.towardscode === "47") {
  //   interest = calculateInterest({
  //     roi: formData.roi,
  //     pending: formData.loanpending,
  //     installments: formData.installments,
  //   });

    
  // }
  console.log(formData.interest, formData.latefee, formData.amount);
total = amount + latefee + interest;
  setFormData(prev => ({
    ...prev,
    interest: interest.toFixed(2),
    totalamount: total.toFixed(2)
  }));
  
}, [
  formData.amount,
  formData.latefee,
  formData.roi,
  formData.pending,
  formData.installments,
  formData.towardscode
]);


  const loanget = (mno) => {
// console.log(mno);
    // if(formData.towardscode === "47"){
       CustomFetch(`/loan-issues/mno/${mno}/status/40`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          console.log(data);
          const loan = data[0];

        

          setFormData((prev) => ({
            ...prev,
            loanacntno: loan.accountno || '0',
            issueamount: loan.issueamount || '0',
            loantypecode: loan.typecode || '0',
            loantypename: loan.typename || '',
            loanpending: loan.loanpending || '0',
            roi: loan.roi || '0',
            modeofrepayment: loan.modeofrepayment || '',
            clearancedate: loan.clearancedate || '',
            instamount: loan.instamount || '',
            amount: loan.instamount || '',
            installments: loan.installments || '',
            latefee: loan.late_fee || '0',
            lastpaiddate: loan.lastpaiddate || '',
            interest: loan.interest || '',
            totalamount: loan.emi || ''
          }));
        }
        else{
          Swal.fire({
            title: 'Error',
            text: 'Loan not found',
            icon: 'error',
          })
           handleClear();
        }
      })
      .catch(console.error);
    // }
   
  };

  const getCompanyAmount = (id) => {
      CustomFetch(`/getcompany?towardscode=${id}&m_no=${formData.mno?.value || null}`)
      .then((res) => res.json())
      .then((data) => {

        if (data) {
          console.log(formData.towardscode);
          console.log(data.min_saving);

          if(id == '46'){
            setFormData((prev) => ({
              ...prev,
              amount: data.min_saving || '100',
              latefee: data.late_fee || '0',
              lastpaiddate: data.lastpaiddate || '',
            }));
          }
          if(id == '48'){
            setFormData((prev) => ({
              ...prev,
              amount: data.admission_fee || '150',
            }));
          }
          if(id == '49'){
            setFormData((prev) => ({
              ...prev,
              amount: data.form_fee || '5',
            }));
          }
        }
      })
      .catch(console.error);

    // if (formData.towardscode === "47") {
    //   return formData.loanpending || '0';
    // } else {
    //   return formData.amount || '0';
    // }
  };

 const handleChange = (e) => {

  const { name, type, value, checked } = e.target;
  let updated = {};

   if (type == 'checkbox') {
    updated = {
      ...formData,
      [name]: checked ? 1 : 0,
      amount: formData.loanpending || '0',
    };
  }
  else{

 
    if (name === 'towardscode') {
      const selectedOption = paymentOptions.find(opt => opt.id.toString() === value);
      updated = {
        ...formData,
        towardscode: value,
        towards: selectedOption ? selectedOption.name : '',
        amount: '0',
        latefee: '0',
        interest: '0',
        totalamount: '0'
      };

    
        if(selectedMno){
            if(value === '47'){
              loanget(selectedMno.m_no);
            }

            if(value === '46'){
              updated = {
                ...formData,
                towardscode: value,
                towards: selectedOption ? selectedOption.name : '',
              };
            }
            if(value === '48'){
              updated = {
                ...formData,
                towardscode: value,
                towards: selectedOption ? selectedOption.name : '',
              };
            }
            if(value === '49'){
              updated = {
                ...formData,
                towardscode: value,
                towards: selectedOption ? selectedOption.name : '',
              };
            }
        }
        else{
          Swal.fire({
            title: 'Error',
            text: 'Please select a member',
            icon: 'error',
          })
        handleClear();
          return false;
        }
        

      
    } 
    else if (name === 'trantypecode') {
      const selectedOption = transactionOptions.find(opt => opt.id.toString() === value);
      updated = {
        ...formData,
        trantypecode: value,
        trantypename: selectedOption ? selectedOption.name : ''
      };
    }

  else {
    updated = {
      ...formData,
      [name]: value
    };
  }
}


    setFormData(updated);

    if(name == 'towardscode'){
      if(value === '49' || value === '48' || value === '46' ){
        getCompanyAmount(value);
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    const requiredFields = [
      { field: 'receipt_date', message: 'Receipt Date is required' },
      { field: 'mno', message: 'Member Number is required' },
      { field: 'membername', message: 'Member Name is required' },
      { field: 'amount', message: 'Amount is required' },
      { field: 'towardscode', message: 'Towards Code is required' },
      { field: 'trantypecode', message: 'Transaction Type is required' },
    ];

    requiredFields.forEach(({ field, message }) => {
      if (!formData[field] || formData[field] === '') {
        newErrors[field] = message;
        valid = false;
      }
    });

    if (formData.towardscode === '47') {
      if (!formData.loanacntno || !formData.issueamount || !formData.loantypecode) {
        alert('Loan details must be filled for loan receipts');
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit =  async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...formData,
      m_no: formData.mno?.value || null,
    };

     if(parseFloat(formData.amount) > parseFloat(formData.loanpending) && formData.towardscode === '47'){
                  Swal.fire({
                  title: 'Error',
                  text: 'Amount should be less than or equal to pending amount',
                  icon: 'error',
                });
                return false;
              }


              // Confirm formData before submission
  const confirmation = await Swal.fire({
    title: 'Confirm Submission',
    html: `
    <div style="text-align: left; font-size: 16px;">
      <p><strong>Member No:</strong> ${formData.mno?.label || 'N/A'}</p>
      <p><strong>Member Name:</strong> ${formData.mno?.membername || 'N/A'}</p>
      <p><strong>Towards:</strong> ${formData.towards || 'N/A'}</p>
      <p><strong>Total Amount:</strong> ₹${formData.totalamount || '0.00'}</p>
    </div>
  `,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    cancelButtonText: 'Cancel',
    width: '600px',
  });

  if (!confirmation.isConfirmed) return;

    CustomFetch("/addreceipts", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
       if (data.success) {
            // Swal.fire({
            //   title: 'Success!',
            //   text: data?.data?.message || 'Receipt added successfully.',
            //   icon: 'success',
            //   confirmButtonText: 'OK',
            // }).then((result) => {

               if (data.success) {
                  setReceiptData(data.receipt); // Replace with actual receipt format from response
                  setShowReceiptModal(true);
                }
              // if (result.isConfirmed) {
              //   if (formData.towardscode === '47') {
              //     navigate('/loanreceipts');
              //   } else {
              //     navigate('/savingreceipts');
              //   }
              // }
            // });
          }

        else{
          Swal.fire({
            title: 'Error',
            text: data.error || 'Something went wrong',
            icon: 'error',
          })
        }
      })
      .catch((err) => {
        console.error("Error submitting form:", err);
        alert("Submission failed");
      });
  };

  const handleClear = () => {
    setFormData(initialState);
    setSelectedMno(null);
    setErrors({});
    
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Receipt Add" breadcrumbItems={breadcrumbItems} />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className='page-title-box d-sm-flex align-items-center justify-content-between'>
                      <h4 className="mb-0">Receipts Details</h4>
                     <img
                        src={formData.image ? `${process.env.REACT_APP_APIURL_IMAGE}members/${formData.image}` : ""}
                        alt="profile"
                        className="rounded-circle img-fluid mb-3"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = `${process.env.REACT_APP_APIURL_IMAGE}user.jpg`;
                        }}
                      />
                  </div>

                  

                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Label className="mt-3">Receipt Date</Label>
                        <Input
                          type="date"
                          name="receipt_date"
                          value={formData.receipt_date || ''}
                          onChange={handleChange}
                          invalid={!!errors.receipt_date}
                        />
                        {errors.receipt_date && <div className="text-danger">{errors.receipt_date}</div>}

                        <Label className="mt-3">Select M.no</Label>
                        <Select
                          value={formData.mno}
                          name="mno"
                          onChange={handleMNoChange}
                          options={optionsSelect}
                          classNamePrefix="select2-selection"
                          isClearable
                        />
                        {errors.mno && <div className="text-danger">{errors.mno}</div>}

                        <Label className="mt-3">Member Name</Label>
                        <Input
                          type="text"
                          name="membername"
                          value={formData.membername || ''}
                          onChange={handleChange}
                          placeholder="Enter Member Name"
                          invalid={!!errors.membername}
                          readOnly
                        />
                        {errors.membername && <div className="text-danger">{errors.membername}</div>}
                      </Col>

                      <Col md={6}>
                        <Label className="mt-3">Receipt Towards</Label>
                        <Input
                          type="select"
                          name="towardscode"
                          value={formData.towardscode || ''}
                          onChange={handleChange}
                          invalid={!!errors.towardscode}
                        >
                          <option value="">---Select Receipt Towards---</option>
                          {paymentOptions &&
                            paymentOptions.length > 0 &&
                            paymentOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                        </Input>
                        {errors.towardscode && <div className="text-danger">{errors.towardscode}</div>}

                        <Label className="mt-3">Transaction Type</Label>
                        <Input
                          type="select"
                          name="trantypecode"
                          value={formData.trantypecode || ''}
                          onChange={handleChange}
                          invalid={!!errors.trantypecode}
                        >
                          <option value="">---Select Transaction Type---</option>
                          {transactionOptions &&
                            transactionOptions.length > 0 &&
                            transactionOptions.map((option) => (
                              <option key={option.id} value={option.id}>
                                {option.name}
                              </option>
                            ))}
                        </Input>
                        {errors.trantypecode && <div className="text-danger">{errors.trantypecode}</div>}

                       <Label className="mt-3">Late Payment Date</Label>
                        <Input
                          type="date"
                          name="lastpaiddate"
                          value={formData.lastpaiddate || ''}
                          onChange={handleChange}
                        />
                      </Col>

                      {/* add formData.m_no */}

                     {formData.towardscode === '47' &&  selectedMno && (
                        <Card className="mt-2" >
                        <Row md={12} className="mt-4 pb-2" >
                            <h4 className="card-title mb-2 text-center pt-2">Loan Details</h4>
                            <Col md={4}>
                            <Label className="mt-3">Loan Type</Label>
                             <Input type="text" name="loantypename" placeholder="" value={formData.loantypename || ''} onChange={handleChange} readOnly />
                             <Input type="hidden" name="loantypecode" placeholder="" value={formData.loantypecode || ''} onChange={handleChange} readOnly />

                           {/* <Select
                                options={loanTypeOptions}
                                value={formData.loantypecode ? loanTypeOptions.find(option => option.value === formData.loantypecode) : null}  
                                onChange={handleChange}
                                isClearable
                                name="typecode"
                                readOnly
                            /> */}
                            </Col>
                             <Col md={4}>
                            <Label className="mt-3">Loan Account</Label>
                            <Input type="number" min="0" name="loanacntno" placeholder="Loan Account" value={formData.loanacntno || ''} onChange={handleChange} readOnly />
                            </Col>

                            <Col className="d-none">
                            <Label className="mt-3 ">Mode of Repay</Label>
                            <Input type="text" name="modeofrepayment" placeholder="Loan Type" value={formData.modeofrepayment || ''} onChange={handleChange} readOnly />
                            </Col>
                           

                            <Col md={4}>
                            <Label className="mt-3">Issued Amount</Label>
                            <Input type="text" min="0" name="issueamount" placeholder="Issued Amount" value={formData.issueamount || ''} onChange={handleChange} readOnly />
                            </Col>

                             <Col md={4}>
                            <Label className="mt-3">Installments Amount</Label>
                            <Input type="number" min="0" name="instamount" placeholder=" instamount" value={formData.instamount || ''} onChange={handleChange} readOnly />
                            </Col>

                            <Col md={4}>
                            <Label className="mt-3">Pending Amount</Label>
                            <Input type="number" min="0" name="loanpending" placeholder="Pending Amount" value={formData.loanpending || ''} onChange={handleChange} readOnly />
                            </Col>
                            <Col md={4}>
                            <Label className="mt-3">ROI</Label>
                            <Input type="number" min="0" name="roi" placeholder="ROI" value={formData.roi || ''} onChange={handleChange} readOnly />
                            </Col>
                            <Col md={4}>
                            <Label className="mt-3">Clearance Date</Label>
                            <Input type="date" name="clearancedate" placeholder="Clearance Date" value={formData.clearancedate || ''} onChange={handleChange} readOnly />
                            </Col>
                            <Col className="col-md-4  pt-2 mt-3">
                             <Input
                                    type="checkbox"
                                    id="sameAsCurrent"
                                    name="loanclear"
                                    value="1"
                                    checked={formData.loanclear === 1}
                                    onChange={handleChange}
                                    />
                                    <Label htmlFor="loanclear" style={{ marginLeft: "8px" }}>
                                     Loan Clear
                                    </Label>
                            </Col>

                             
                        </Row>
                       </Card>
                    )}

                      {/* Loan Details Section */}
                      {/* {formData.towardscode === "6" && ( */}
                        <Row md={12} className="mt-4">
                          <h3 className="card-title mb-4 text-center ">Amount Details</h3>
                          <Row>
                            <Col md={6}  className="text-right"> <Label className="mt-3">Amount</Label></Col>
                            <Col md={6}><Input
                                        type="number"
                                        name="amount"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="Amount"
                                        min="0"
                                        invalid={!!errors.amount}
                                        />
                                        {errors.amount && <div className="text-danger">{errors.amount}</div>}
                                </Col>
                          </Row>
                          <Row>
                            <Col md={6} className="text-right"><Label className="mt-3">Late Fee</Label></Col>
                            <Col md={6}><Input
                                        type="number"
                                        name="latefee"
                                        min="0"
                                        placeholder="Late Fee"
                                        value={formData.latefee}
                                        onChange={handleChange}
                                        />
   
                            </Col>
                          </Row>
                           {formData.towardscode === '47' && selectedMno && (
                            <Row>
                                <Col md={6} className="text-right"><Label className="mt-3">Interest</Label></Col>
                                <Col md={6}><Input
                                                type="number"
                                                name="interest"
                                                placeholder="Interest"
                                                value={formData.interest}
                                                onChange={handleChange}
                                                />
              
                                </Col>
                          </Row>
                          )}
                         
                          <Row>
                            <Col md={6} className="text-right"><Label className="mt-3">Total Amount</Label></Col>
                            <Col md={6}><Input
                                        type="number"
                                        name="totalamount"
                                        placeholder="Total Amount"
                                        value={formData.totalamount}
                                        onChange={handleChange} readOnly
                                        />
                            </Col>
                          </Row>

                        </Row>
                      {/* )} */}
                      
                    </Row>



                    {/* <Row className="mb-3 mt-4 ">
                      
                    <div className="mb-2">
                      <h4 className="card-title mt-4 text-bold">Cheque/DD Details</h4>
                    </div>
                      <Col md={6}>
                        <Label className="mt-3">Enter Cheque No</Label>
                        <Input
                          type="text"
                          name="chqno"
                          value={formData.chqno}
                          onChange={handleChange}
                          placeholder="Enter Cheque No"
                        />
                         <Label className="mt-3">Amount</Label>
                        <Input
                          type="text"
                          name="chqamount"
                          value={formData.chqamount}
                          onChange={handleChange}
                          placeholder="Amount"
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="mt-3">Enter Account No</Label>
                        <Input
                          type="text"
                          name="acntno"
                          value={formData.acntno}
                          onChange={handleChange}
                          placeholder="Enter Account No"
                        />
                        <Label className="mt-3">Enter Bank Name</Label>
                        <Input
                          type="text"
                          name="bankname"
                          value={formData.bankname}
                          onChange={handleChange}
                          placeholder="Enter Bank Name"
                        />
                         <Label className="mt-3">Enter IFSC Code</Label>
                        <Input
                          type="text"
                          name="ifsc"
                          value={formData.ifsc}
                          onChange={handleChange}
                          placeholder="Enter IFSC Code"
                        />
                      </Col>
                    </Row> */}


                    <div className="text-center">
                      <button type="submit" className="btn btn-primary mr-2">Submit</button>
                      {/* <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button> */}
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <ReceiptPrint
            receiptData={receiptData}
            show={showReceiptModal}
            onClose={() => setShowReceiptModal(false)}
          />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ReceiptsAdd;
