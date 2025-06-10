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

const PaymentsAdd = () => {
  const [breadcrumbItems] = useState([
    { title: "Back", link: "/payments" },
    { title: "Add", link: "#" },
  ]);

  const today = new Date().toISOString().split("T")[0];
  const [mno, setMno] = useState([]);
  const [selectedMno, setSelectedMno] = useState([]);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [transactionOptions, setTransactionOptions] = useState([]);

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    date: today,
    membername: "",
    towardscode: "",
    modeofpmtcode: "",
    issuedamount: "",
    chqno: "",
    acntno: "",
    amount: "",
    bankname: "",
    ifsc: "",
    mno: null, 
    accountno: '',  
    issueamount: '',  
    typecode: ''
  });

  // State to handle error messages
  const [errors, setErrors] = useState({
    date: "",
    mno: "",
    membername: "",
    amount: "",
    towardscode: "",
    modeofpmtcode: "",
  });

  useEffect(() => {
    CustomFetch("/members")
      .then((response) => response.json())
      .then((data) => {
        setMno(data);
        console.log("Fetched Mno Data:", data);
      })
      .catch((err) => {
        console.error("Error fetching members:", err);
      });
      fetchDropdownOptions(2, setPaymentOptions);
      fetchDropdownOptions(3, setTransactionOptions);

  }, []);


  const fetchDropdownOptions = (parentId, setOptions) => {
    CustomFetch(`/dropdown-options/parent/${parentId}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOptions(
          data.map((item) => ({
            value: item.id,
            label: item.name,
          }))
        );
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };


  const optionsSelect = mno.map((item) => ({
    value: item.m_no_encpt,
    label: item.m_no,
    membername: item.name,
  }));

  const handleMNoChange = (selectedOption) => {

     if(formData.towardscode == ''){
       Swal.fire({
            title: 'Error!',
            text: 'Please select a payment Towards.',
            icon: 'error',
            confirmButtonText: 'OK'
          })
    }
    else
    if(formData.towardscode == '6'){
   
    CustomFetch(`/loan-issues/mno/${selectedOption.value}?type=payment`)
      .then((response) => response.json())
      .then((res) => {
        if (res.success) {
          const loanIssue = res.data[0];
          const member = res.member;
          console.log( loanIssue);
          setFormData((prevData) => ({
            ...prevData,
            mno: selectedOption,
            membername: selectedOption.membername || "",
            accountno: loanIssue.accountno,
            issueamount: loanIssue.issueamount,
            loantypename: loanIssue.typename,
            amount: loanIssue.issueamount,
            acntno: member.acntno,
            bankname: member.bankname,
            ifsccode: member.ifsccode,
            chqamount: loanIssue.issueamount

          }));
        }
        else{
          handleClear();
          Swal.fire({
            title: 'Error!',
            text: res.message,
            icon: 'error',
            confirmButtonText: 'OK'
          })
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
    else{
       setFormData((prevData) => ({
            ...prevData,
            mno: selectedOption,
            membername: selectedOption.membername || "",
            accountno: '',
            issueamount: '',
            loantypename: '',
            amount: '',
            acntno: '',
            bankname: '',
            ifsccode: '',
             chqamount: ''

          }));
    }
     if(formData.towardscode == '21'){
        fetchMemberDetails(selectedOption.value);
     }

    setSelectedMno(selectedOption.label);

  };

  useEffect(() => {
     setFormData((prev) => ({
        ...prev,
        chqamount: formData.amount
      }));
     
  }, [formData.amount]);

const handleChange = (e) => {
    const { name, value } = e.target;

  if (name === 'towardscode') {
     
    const selectedOption = paymentOptions.find(option => option.value == value);
    setFormData((prev) => ({
        ...prev,
        [name]: value,
        towards: selectedOption ? selectedOption.label : '',
      }));
     
    } 
    else
    if (name === 'modeofpmtcode') {
     
    const selectedOption = transactionOptions.find(option => option.value == value);
    setFormData((prev) => ({
        ...prev,
        [name]: value,
        modeofpmtname: selectedOption ? selectedOption.label : '',
      }));
     
    } 
    
    else {
      // Normal input

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

  

    // console.log(formData);

  };

const validateForm = () => {
  let valid = true;
  const newErrors = { ...errors };

  const requiredFields = [
    { field: 'date', message: 'This field is required' },
    { field: 'amount', message: 'This field is required' },
    { field: 'towardscode', message: 'This field is required' },
    { field: 'modeofpmtcode', message: 'This field is required' },
  ];

  requiredFields.forEach(({ field, message, condition }) => {
    if (condition) {
      // Validate field only if condition is true
      if (condition(formData) && (!formData[field] || formData[field] === "")) {
        newErrors[field] = message;
        valid = false;
      } else {
        newErrors[field] = "";
      }
    } else {
      // Always validate field if no condition provided
      if (!formData[field] || formData[field] === "") {
        newErrors[field] = message;
        valid = false;
      } else {
        newErrors[field] = "";
      }
    }
  });

  setErrors(newErrors);
  console.log(newErrors);
  return valid;
};


  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    const payload = {
      ...formData,
      mno: formData.mno?.value || null,
    };

    CustomFetch("/addpayments", {
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.success) {
          Swal.fire({
            title: "Success!",
            text: "Payment added successfully.",
            icon: "success",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/payments");
              handleClear();
            }
          });

      
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleClear = () => {
    setFormData({
      date: today,
      membername: "",
      towards: "",
      modeofpmtcode: "",
      issuedamount: "",
      chqno: "",
      acntno: "",
      amount: "",
      bankname: "",
      ifsc: "",
      mno: null,
      accountno: "",
      issueamount: "",
      typecode: "",
      towardscode:''
    });
    setSelectedMno(null);
    setErrors({
      date: "",
      mno: "",
      membername: "",
      amount: "",
      towardscode: "",
      modeofpmtcode: "",
    });
  };



  const fetchMemberDetails = async (id) => {
    const res = await CustomFetch(`/member-details/${id}`);
    const data = await res.json();
    console.log('Data fetched:', data);
    // paidcash(data);
  
  
     setFormData(prev => ({
      ...prev,
      ...(data.savings && data.savings.length > 0
        ? {
            pmember:
              (Number(data.savings[0].added) || 0) +
              (Number(data.savings[0].intonadded) || 0) +
              (Number(data.savings[0].openingbal) || 0) +
              (Number(data.savings[0].intonopening) || 0),
          }
        : {}),
      ...(data.loanissues && data.loanissues.length > 0
        ? {
            gmember:
              (Number(data.loanissues[0].loanpending) || 0) +
              (Number(data.loanissues[0].calculated_interest) || 0) +
              (Number(data.loanissues[0].late_fee) || 0),
          }
        : {}),
    }));
  console.log("formData:", formData.gmember);
  
  const gmemberVal =
    data.loanissues && data.loanissues.length > 0
      ? (Number(data.loanissues[0].loanpending) || 0) +
        (Number(data.loanissues[0].calculated_interest) || 0) +
        (Number(data.loanissues[0].late_fee) || 0)
      : 0;
  
  const pmemberVal =
    data.savings && data.savings.length > 0
      ? (Number(data.savings[0].added) || 0) +
        (Number(data.savings[0].intonadded) || 0) +
        (Number(data.savings[0].openingbal) || 0) +
        (Number(data.savings[0].intonopening) || 0)
      : 0;
  
    const netAmount = Math.abs(gmemberVal - pmemberVal);
    let balanceStatus = "";
  
    if (gmemberVal > pmemberVal) {
      balanceStatus = `Member owes you ₹`;
    } else if (pmemberVal > gmemberVal) {
      balanceStatus = `You owe member ₹`;
    } else {
      balanceStatus = "Settled (no amount owed)";
    }
  
    setFormData(prev => ({
      ...prev,
      netAmount,
      balanceStatus,
      amount: netAmount
    }));
    
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Payment Add" breadcrumbItems={breadcrumbItems} />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title mb-4">Payments Details</h4>
                  <Form onSubmit={handleSubmit}>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Label className="mt-3">Payment Date</Label>
                        <Input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          invalid={!!errors.date}
                        />
                        {errors.date && <div className="text-danger">{errors.date}</div>}


                            <Label className="mt-3">Select M.no</Label>
                            <Select
                              value={formData.mno}
                              name="mno"
                              onChange={handleMNoChange}
                              options={optionsSelect}
                              classNamePrefix="select2-selection"
                            />
                            {errors.mno && <div className="text-danger">{errors.mno}</div>}


                         <Label className="mt-3">Member Name</Label>
                            <Input
                              type="text"
                              name="membername"
                              value={formData.membername}
                              onChange={handleChange}
                              placeholder="Enter Member Name"
                              invalid={!!errors.membername}
                              readOnly
                            />
                            {errors.membername && <div className="text-danger">{errors.membername}</div>}

                       

                      </Col>

                      <Col md={6}>
                        <Label className="mt-3">Payment Towards</Label>
                        <Input
                          type="select"
                          name="towardscode"
                          value={formData.towardscode}
                          onChange={handleChange}
                          invalid={!!errors.towardscode}
                        >
                          <option value="">---Select Payment Towards---</option>
                          {paymentOptions &&
                            paymentOptions.length > 0 &&
                            paymentOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                        </Input>
                        {errors.towardscode && <div className="text-danger">{errors.towardscode}</div>}

                         <Label className="mt-3">Transaction Type</Label>
                        <Input
                          type="select"
                          name="modeofpmtcode"
                          value={formData.modeofpmtcode}
                          onChange={handleChange}
                          invalid={!!errors.modeofpmtcode}
                        >
                          <option value="">---Select Transaction Type---</option>
                          {transactionOptions &&
                            transactionOptions.length > 0 &&
                            transactionOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                        </Input>
                        {errors.modeofpmtcode && <div className="text-danger">{errors.modeofpmtcode}</div>}

                        <Label className="mt-3">Payment Amount</Label>
                        <Input
                          type="number"
                          name="amount"
                          value={formData.amount}
                          onChange={handleChange}
                          placeholder="Amount"
                          invalid={!!errors.amount}
                        />
                        {errors.amount && <div className="text-danger">{errors.amount}</div>}
                      </Col>
                      <Row className="mb-3">
                       <Col md={6}>
                        
                       </Col>
                       <Col md={6}>
                           
                       </Col>
                       </Row>

                       {formData.towardscode === '21' && (
                      <Row md={12} className="mt-4 " >
                          <h4 className="card-title mb-2">Member Savings & Loan Details</h4>
                         <Col md={4}>
                            <Label className="mt-3">Savings Amount</Label>
                            <Input
                              type="number"
                              name="savings"
                              value={formData.pmember || ''}
                              onChange={handleChange}
                              placeholder="Savings Amount"
                              readOnly
                            />
                            </Col>
                            <Col md={4}>
                            <Label className="mt-3">Loan Amount</Label>
                            <Input
                              type="number"
                              name="loanamount"
                              value={formData.gmember || ''}
                              onChange={handleChange}
                              placeholder="Loan Amount"
                              readOnly
                            />
                            </Col>
                            <Col md={4}>
                             <Label className="mt-3"><strong>{formData.balanceStatus}</strong></Label>
                            <Input
                              type="number"
                              name="loanamount"
                              value={formData.netAmount || ''}
                              onChange={handleChange}
                              placeholder=" Amount"
                              readOnly
                            />
                            </Col>
                            
                      </Row>
                      )}


                      {/* Loan Details Section */}
                      {formData.towardscode === "6" && (
                        <Row md={12} className="mt-4">
                          <h4 className="card-title mb-2">Member Loan Details</h4>
                           <Col md={4}>
                            <Label className="mt-3">Account No.</Label>
                            <Input
                              type="text"
                              name="accountno"
                              value={formData.accountno}
                              onChange={handleChange}
                              placeholder="Account No."
                              readOnly
                            />
                            </Col>
                            <Col md={4}>

                              <Label className="mt-3">Loan Type</Label>
                            <Input
                              type="text"
                              name="loantypename"
                              placeholder="Loan Type"
                              value={formData.loantypename}
                              onChange={handleChange}
                              readOnly
                            />
                            </Col>
                            <Col md={4}>
                             <Label className="mt-3">Issue Amount</Label>
                            <Input
                              type="number"
                              name="issueamount"
                              value={formData.issueamount}
                              onChange={handleChange}
                              placeholder="Issue Amount"
                              readOnly
                            />

                          </Col>

                          
                        </Row>
                      )}
                      
                    </Row>

                     {formData.towardscode === '6' && (
                      <Row md={12} className="mt-4 " >
                        {/* <h4 className="card-title mb-2">Loan Details</h4>
                        <Col md={4}>
                        <Label className="mt-3">Loan Type</Label>
                          <Input type="text" name="loantypename" placeholder="Loan Type" value={formData.loantypename} onChange={handleChange} disabled />
                        </Col>
                        <Col md={4}>
                        <Label className="mt-3">Loan Account</Label>
                          <Input type="text" name="loanacntno" placeholder="Loan Account" value={formData.loanacntno} onChange={handleChange} disabled />
                        </Col>
                        <Col md={4}>
                        <Label className="mt-3">Issued Amount</Label>
                          <Input type="text" name="issueamount" placeholder="Issued Amount" value={formData.issueamount} onChange={handleChange} disabled />
                        </Col> */}
                      </Row>
                    )}


                    <Row className="mb-3 mt-4 ">
                      
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
                          type="number"
                          name="chqamount"
                          value={formData.chqamount}
                          onChange={handleChange}
                          placeholder="Amount"
                          readOnly
                        />
                      </Col>
                      <Col md={6}>
                        <Label className="mt-3">Enter Account No</Label>
                        <Input
                          type="number"
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
                          name="ifsccode"
                          value={formData.ifsccode}
                          onChange={handleChange}
                          placeholder="Enter IFSC Code"
                        />
                      </Col>
                    </Row>


                    <div className="text-center">
                      <button type="submit" className="btn btn-primary mr-2">Submit</button>
                      {/* <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button> */}
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default PaymentsAdd;
