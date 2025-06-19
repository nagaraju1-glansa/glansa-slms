import React, { useState, useEffect } from 'react';
import { useNavigate , useParams } from 'react-router-dom';
import { Card, CardBody, Col, Row, Label, Input, Container } from "reactstrap";
import Select from 'react-select';
import Swal from 'sweetalert2';
import { CustomFetch } from '../ApiConfig/CustomFetch';
import Breadcrumbs from "../../components/Common/Breadcrumb";

function LoanAdd() {
    const [breadcrumbItems] = useState([
          { title: "Dashboard", link: "/dashboard" },
          { title: "Add", link: "#" },
    ]);
   const { id } = useParams();
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];
  const loanAccountOptions = [{ value: "new", label: "New Loan Account" }];
  const [options, setOptions] = useState([]);
  const [loanTypeOptions, setLoanTypeOptions] = useState([]);
  const [loanStatusOptions, setLoanStatusOptions] = useState([]);
  const [purposeOptions, setPurposeOptions] = useState([]);
  const [modeOfRepaymentOptions, setModeOfRepaymentOptions] = useState([]);
  const initialState = {
  appdate : today,
  roi : 1.5,
  clearancedate: '',
  issuedate:'',
  surity1mno:''
};

const [formData, setFormData] = useState(initialState);
const [errors, setErrors] = useState({});

  useEffect(() => {

    CustomFetch("/mno")
      .then((res) => res.json())
      .then((data) => {
        // setReceipts(data);
        console.log(data);
        const selectOptions = data.map((item) => {
            const mNoStr = item.m_no != null ? item.m_no.toString() : '';
            const mNoStrVal = item.m_no_encpt != null ? item.m_no_encpt.toString() : '';

            return {
                label: mNoStr,
                value: mNoStrVal,
                image: item.image ? item.image : '',
            };
        });
        setOptions(selectOptions);
      })
      .catch((err) => console.error(err));

    fetchDropdownOptions(4, setLoanTypeOptions);
    fetchDropdownOptions(38, setLoanStatusOptions);
    fetchDropdownOptions(54, setPurposeOptions);
    fetchDropdownOptions(68, setModeOfRepaymentOptions);

    if (id) {
      fetchLoanDetails(id);
    }

  }, []);


const fetchDropdownOptions = (parentId, setoptions) => {
  CustomFetch(`/dropdown-options/parent/${parentId}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      setoptions(
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



  const calculateClearanceDate = (startDate, monthsToAdd) => {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    return date.toISOString().split('T')[0]; // return as yyyy-mm-dd
  };


const getLoanEligibility = async (mno) => {
     CustomFetch(`/checkLoanStatus/${mno}`)
      .then((response) => response.json())
      .then((data) => {
        // eligible
        data = data[0];
        if (data.eligible) {
          //swal
           Swal.fire({
            title: 'Success!',
            text: data.message,
            icon: 'success',
            confirmButtonText: 'OK',
          });
          //set membername
          setFormData((prev) => ({
            ...prev,
            mname: data.name,
            mshipmonths: data.months_since_join,
            dateOfJoining: data.doj,
            totalsavingamt: data.openingbal,
            eligibleamt: data.eligibleamt,
            eligibleinstallments: data.eligibleinstallments,
            acntname: data.acntname,
            acntno: data.acntno,
            bankname: data.bankname,
            ifsccode: data.ifsccode

          }));
        }
        // not eligible
        else {
          Swal.fire({
            title: 'Error!',
            text: data.message,
            icon: 'warning',
            confirmButtonText: 'OK',
          });

          setFormData(initialState);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
}
const handleChange = (valueOrEvent, actionMeta) => {
  let name, value;

  if (valueOrEvent && valueOrEvent.hasOwnProperty('value')) {
    // This means the event is from `react-select`
    name = actionMeta.name;
    value = valueOrEvent ? valueOrEvent.value : null;
  } else {
    // This means it's a regular input event
    const { name: inputName, value: inputValue } = valueOrEvent.target;
    name = inputName;
    value = inputValue;
  }

  const updatedFormData = {
    ...formData,
    [name]: value
  };

  if(name === 'typecode') {
     const selected = loanTypeOptions.find(opt => opt.value === value);
     updatedFormData.typename = selected ? selected.label : '';
  }
  if(name === 'purposecode') {
     const selected = purposeOptions.find(opt => opt.value === value);
    updatedFormData.purpose = selected ? selected.label : '';
  }
 if(name === 'modeofrepaymentcode') {
    const selected = modeOfRepaymentOptions.find(opt => opt.value === value);
    updatedFormData.modeofrepayment = selected ? selected.label : '';
  }
   if(name === 'status') {
    const selected = loanStatusOptions.find(opt => opt.value === value);
    updatedFormData.statusname = selected ? selected.label : '';
  }

  if (name === 'installments' || name === 'issuedate') {
    const installments = parseInt(updatedFormData.installments);
    const issueDate = updatedFormData.issuedate;

    if (!isNaN(installments) && installments > 0 && issueDate) {
      try {
        const clearance = calculateClearanceDate(issueDate, installments);
        updatedFormData.clearancedate = clearance;
      } catch (error) {
        updatedFormData.clearancedate = '';
        console.error("Invalid date format:", error);
      }
    } else {
      updatedFormData.clearancedate = '';
    }

  }

  if (name === 'installments' || name === 'issueamount') {
    const installments = parseInt(updatedFormData.installments);
    const issueAmount = parseFloat(updatedFormData.issueamount);

    if (!isNaN(installments) && installments > 0 && !isNaN(issueAmount) && issueAmount > 0) {
      updatedFormData.instamount = Math.round((issueAmount / installments) * 100) / 100;
    } else {
      updatedFormData.instamount = '';
    }
  }

  if (name === 'mno') {
      const selectedOption = options.find(option => option.value === String(value));

        updatedFormData.image = selectedOption ? selectedOption.image : null;

  }

  setFormData(updatedFormData);


  // console.log(formData.mno);
  if (name === 'mno' && !id) {
    getLoanEligibility(value);
  }

  };

  const handleSurityChange = (valueOrEvent, actionMeta) => {
  let name, value;

  if (valueOrEvent && valueOrEvent.hasOwnProperty('value')) {
    // This means the event is from `react-select`
    name = actionMeta.name;
    value = valueOrEvent ? valueOrEvent.value : null;
  } else {
    // This means it's a regular input event
    const { name: inputName, value: inputValue } = valueOrEvent.target;
    name = inputName;
    value = inputValue;
  }

if (value !== formData.mno) {
    CustomFetch(`/members/${value}`)
      .then((response) => response.json())
      .then((res) => {
          console.log(res);
          const data = res.member;
        if(name == 'surity1mno') {
          setFormData((prev) => ({
          ...prev,
          surity1mno: data.m_no,
          surity1mname: data.name,
          surity1shipmonths: data.months_since_join,
          surity1phone: data.mobile1,
          surity1totalsavings: parseFloat(data.totalsavings).toFixed(2)
        }))
        }
        else if(name == 'surity2mno') {
          setFormData((prev) => ({
          ...prev,
          surity2mno: data.m_no,
          surity2mname: data.name,
          surity2shipmonths: data.months_since_join,
          surity2phone: data.mobile1,
          surity2totalsavings: parseFloat(data.totalsavings).toFixed(2)
        }))
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    }
    else {
     Swal.fire({
        title: 'Error!',
        text: 'Please select a different member.',
        icon: 'error',
        confirmButtonText: 'OK'
      });

      if(name == 'surity1mno') {
          setFormData((prev) => ({
          ...prev,
          surity1mno: '',
          surity1mname: '',
          surity1shipmonths: '',
          surity1phone: '',
          surity1totalsavings: ''
        }))
        }
        else if(name == 'surity2mno') {
          setFormData((prev) => ({
          ...prev,
          surity2mno: '',
          surity2mname: '',
          surity2shipmonths:'',
          surity2phone: '',
          surity2totalsavings:''
        }))
    }

    }

  }
const fetchLoanDetails = async (id) => {
  const res = await CustomFetch(`/loan-issues/${id}`);
  const data = await res.json();

  // Split surity1details and surity2details
  const [s1phone, s1mship, s1savings, s1loan] = (data.surity1details || ',,,').split(',');
  const [s2phone, s2mship, s2savings, s2loan] = (data.surity2details || ',,,').split(',');

  setFormData(prev => ({
    ...initialState,
    ...data,
    surity1phone: s1phone || '',
    surity1mshipmonths: s1mship || '',
    surity1totalsavings: s1savings ? parseFloat(parseFloat(s1savings).toFixed(2)) : '',
    surity1loanpending: s1loan || '',

    surity2phone: s2phone || '',
    surity2mshipmonths: s2mship || '',
    surity2totalsavings: s2savings ? parseFloat(parseFloat(s2savings).toFixed(2)) : '',
    surity2loanpending: s2loan || '',
  }));
  console.log(data,"formData");
};



  const validateForm = () => {
  const newErrors = {};
  if (!formData.mno) newErrors.mno = "Member No is required";
  if (!formData.mname) newErrors.mname = "Member name is required";
  if (!formData.typecode) newErrors.typecode = "Loan type is required";
  if (!formData.loanAccount && !formData.accountno) newErrors.loanAccount = "Loan account is required";
  if (!formData.purposecode) newErrors.purposecode = "Loan purpose is required";
  if (!formData.modeofrepaymentcode) newErrors.modeofrepaymentcode = "mode of repaymentcode is required";
  if (!formData.issueamount) newErrors.issueamount = "issueamount is required";
  if (!formData.installments) newErrors.installments = "installments is required";
  if (!formData.instamount) newErrors.instamount = "instamount is required";
  if (!formData.status) newErrors.status = "Loan Status is required";
  if (!formData.roi) newErrors.roi = " ROI is required";


  // if (!formData.surity1mname) newErrors.surity1mname = "surity1mname is required";
  // if (!formData.surity1shipmonths) newErrors.surity1shipmonths = "surity1shipmonths is required";
  // if (!formData.surity1phone) newErrors.surity1phone = "surity1phone is required";
  // if (!formData.surity1totalsavings) newErrors.surity1totalsavings = "surity1totalsavings is required";
  // if (!formData.surity2mname) newErrors.surity2mname = "surity2mname is required";
  // if (!formData.surity2shipmonths) newErrors.surity2shipmonths = "surity2shipmonths is required";
  // if (!formData.surity2phone) newErrors.surity2phone = "surity2phone is required";
  // if (!formData.surity2totalsavings) newErrors.surity2totalsavings = "surity2totalsavings is required";

  setErrors(newErrors);
  console.log(newErrors);

  return Object.keys(newErrors).length === 0; // Returns true if no errors
};

  const handleSubmit = async (e) => {
   
  e.preventDefault();
   if (validateForm()) {
  

  try {
    console.log(formData);

  const formattedFormData = {
    ...formData,
    surity1details: `${formData.surity1phone || ''},${formData.surity1mshipmonths || ''},${formData.surity1totalsavings || ''},${formData.surity1loanpending || ''}`,
    surity2details: `${formData.surity2phone || ''},${formData.surity2mshipmonths || ''},${formData.surity2totalsavings || ''},${formData.surity2loanpending || ''}`,
  };
    

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/loan-issues/${id}` : '/loan-issues';

    const response = await CustomFetch(url, {
      method,
      body: JSON.stringify(formattedFormData),
    });
    const result = await response.json();

    if (result.success) {
      Swal.fire({
        title: 'Success!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });
      handleClear();
    } else {
      Swal.fire({
        title: 'Error',
        text: result.error || 'Something went wrong',
        icon: 'error',
      });
    }
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: error.message || 'Network error',
      icon: 'error',
    });
  }
}
};

const handleClear = () => {
  setFormData(initialState);
  navigate('/loans');
};

  return (
     <React.Fragment>
    <div className="page-content">
      <div className='page-title-box d-sm-flex align-items-center justify-content-between '>
            <h4>Loan Add</h4>
           
          </div>
      <Container fluid>
        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                <form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Row>
            <Col md={6}>
              <div className="mb-3">
              <Label >Member No</Label>
              {id ? (
                <Input
                  type="text"
                  value={formData.mno || ''}
                  onChange={handleChange}
                  name="mno"
                  readOnly
                />
              ) : (
                <Select
                options={options}
                value={formData.mno ? options.find(option => option.value === String(formData.mno)) : null}  
                // value={formData.mno ? { value: formData.mno, label: formData.mno } : null} 
                onChange={handleChange}
                isClearable
                name="mno"
                className={errors.mno ? 'react-select-error' : ''}
                classNamePrefix="react-select"
              />
              )}
              {errors.mno && (
                  <div className="text-danger mt-1">{errors.mno}</div>
                )}
            </div>
            <div className="mb-3">
              <Label>Member Name</Label>
              <Input
                type="text"
                value={formData.mname || ''}
                onChange={handleChange}
                name="mname"
                readOnly
              invalid={!!errors.mname}  
              />
              {errors.mname && (
                <div className="text-danger mt-1">{errors.mname}</div>
              )}
            </div>
            </Col>
            <Col md={6} className='justify-content-center d-flex m-auto'>

                    <img
                        src={formData.image ? `${formData.image}` : ""}
                        alt="profile"
                        className="rounded-circle img-fluid mb-3"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = "http://127.0.0.1:8000/storage/uploads/user.jpg";
                        }}
                      />

            </Col>
          </Row>
          <div className="mb-3">
            <Label>Loan Type</Label>
            <Select
              options={loanTypeOptions}
              value={formData.typecode ? loanTypeOptions.find(option => option.value === formData.typecode) : null}  
              onChange={handleChange}
              isClearable
              name="typecode"
              className={errors.typecode ? 'react-select-error' : ''}
              classNamePrefix="react-select"
            />
            {errors.typecode && (
                <div className="text-danger mt-1">{errors.typecode}</div>
              )}
          </div>
          <div  className='mb-3'>
            <Label>Loan Account</Label>
             {id ? (
              <Input
                type="text"
                value={formData.accountno || ''}
                onChange={handleChange}
                name="loanAccount"
                readOnly
              />
            ) : (
              <Select
              options={loanAccountOptions}
              value={formData.loanAccount ? { value: formData.loanAccount, label: formData.loanAccount } : null}
              onChange={handleChange}
              name="loanAccount"
              className={errors.loanAccount ? 'react-select-error' : ''}
              classNamePrefix="react-select"
            />
            )}
          {errors.loanAccount && (
        <div className="text-danger mt-1">{errors.loanAccount}</div>
      )}
           
          </div>
          <div  className='mb-3'>
            <Label>Loan Purpose</Label>
            <Select
              options={purposeOptions}
              value={formData.purposecode ? purposeOptions.find(option => option.value === formData.purposecode) : null}  
              onChange={handleChange}
              name="purposecode"
              className={errors.purposecode ? 'react-select-error' : ''}
              classNamePrefix="react-select"
            />
            {errors.purposecode && (
                <div className="text-danger mt-1">{errors.purposecode}</div>
              )}
          </div>
           <div  className='mb-3'>
            <Label>Mode of Repayment</Label>
            <Select
              options={modeOfRepaymentOptions}
              value={formData.modeofrepaymentcode ? modeOfRepaymentOptions.find(option => option.value === formData.modeofrepaymentcode) : null}  
              onChange={handleChange}
              name="modeofrepaymentcode"
              className={errors.modeofrepaymentcode ? 'react-select-error' : ''}
              classNamePrefix="react-select"
            />
             {errors.modeofrepaymentcode && (
                <div className="text-danger mt-1">{errors.modeofrepaymentcode}</div>
              )}
          </div>
          <div  className='mb-3'>
            <Label>Issue Amount </Label>
            <Input
              type="number"
              value={formData.issueamount || ''}
              onChange={handleChange}
              name="issueamount"
               min={0}
               invalid={!!errors.issueamount}  
            />
             {errors.issueamount && (
                <div className="text-danger mt-1">{errors.issueamount}</div>
              )}
          </div>
          <div  className='mb-3'>
            <Label>No of Installments</Label>
            <Input
              type="number"
              value={formData.installments || ''}
              onChange={handleChange}
              name="installments"
              min={1}
               invalid={!!errors.installments}  
            />
            {errors.installments && (
                <div className="text-danger mt-1">{errors.installments}</div>
              )}
          </div>
          <div className='mb-3'>
            <Label>Installment Amount</Label>
            <Input
              type="number"
              value={formData.instamount || ''}
              onChange={handleChange}
              name="instamount"
              readOnly
              min={0}
              invalid={!!errors.instamount}  
            />
             {errors.installments && (
                <div className="text-danger mt-1">{errors.installments}</div>
              )}
          </div>
          <div  className='mb-3'>
            <Label>Monthly ROI</Label>
            <Input
              type="number"
              value={formData.roi || ''}
              onChange={handleChange}
              name="roi"
              invalid={!!errors.instamount}  
            />
            {errors.roi && (
                <div className="text-danger mt-1">{errors.roi}</div>
              )}
          </div>
        </Col>

        <Col md={6}>
          <div  className='mb-3'>
            <Label>Loan App Status</Label>
            <Select
              options={loanStatusOptions}
              value={formData.status ? loanStatusOptions.find(option => option.value === formData.status) : null} 
              onChange={handleChange}
              name="status"
              className={errors.status ? 'react-select-error' : ''}
              classNamePrefix="react-select"  
            />
             {errors.status && (
                <div className="text-danger mt-1">{errors.status}</div>
              )}
          </div>
          <div  className='mb-3'>
            <Label>Application Date</Label>
            <Input
              type="date"
              value={formData.appdate || ''}
              onChange={handleChange}
              name="appdate"
              readOnly={!!id}
            />
          </div>
          <div  className='mb-3'>
            <Label>Issue Date</Label>
            <Input
              type="date"
              value={formData.issuedate || ''}
              onChange={handleChange}
              name="issuedate"
            />
          </div>
         
          <div  className='mb-3'>
            <Label>Date of Joining</Label>
            <Input
              type="date"
              value={formData.dateOfJoining || ''}
              onChange={handleChange}
              name="dateOfJoining"
              readOnly
            />
          </div>
          <div  className='mb-3'>
            <Label>Membership Months</Label>
            <Input
              type="number"
              value={formData.mshipmonths || ''}
              onChange={handleChange}
              name="mshipmonths"
              min={0}
              readOnly
            />
          </div>
          <div  className='mb-3'>
            <Label>Total Savings</Label>
            <Input
              type="number"
              value={formData.totalsavingamt || ''}
              onChange={handleChange}
              name="totalsavingamt"
              min={0}
              readOnly
            />
          </div>
          <div  className='mb-3'>
            <Label>Eligible Loan Amount</Label>
            <Input
              type="number"
              value={formData.eligibleamt || ''}
              onChange={handleChange}
              name="eligibleamt"
              min={0}
              readOnly
            />
          </div>
          <div  className='mb-3'>
            <Label>Eligible Installments</Label>
            <Input
              type="number"
              min={1}
              value={formData.eligibleinstallments || ''}
              onChange={handleChange}
              name="eligibleinstallments"
              readOnly
            />
          </div>

            <div  className='mb-3'>
            <Label>Clearance Date</Label>
            <Input
              type="date"
              value={formData.clearancedate || ''}
              onChange={handleChange}
              name="clearancedate"
              readOnly
            />
          </div>
          <div  className='mb-3'>
            {id && (
            <>
              <label>Loan Pending </label>
              <Input
              type="number"
              value={formData.loanpending || ''}
              onChange={handleChange}
              name="loanpending"
              readOnly
            />
            </>
            )}
          </div>

        </Col>
      </Row>

      <Card>
        <section>
          <div className="mt-4 p-2">
            <h5 className='mb-2'>surity  Details</h5>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>M.No</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Mship Months</th>
                  <th>Total Savings</th>
                  <th>Loan Pending</th>
                </tr>
              </thead>
              <tbody>
                <tr key={1}>
                  <td>
                    <Select
                      options={options}
                       value={formData.surity1mno ? options.find(option => option.label == formData.surity1mno) : null}  
                      onChange={handleSurityChange}
                      name="surity1mno"
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      value={formData.surity1mname || ''}
                      onChange={handleChange}
                      name="surity1mname"
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="surity1phone"
                      value={formData.surity1phone || ''}
                      onChange={handleChange}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="surity1mshipmonths"
                      value={formData.surity1mshipmonths || ''}
                      onChange={handleChange}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="surity1totalsavings"
                      value={formData.surity1totalsavings || ''}
                      onChange={handleChange}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="surity1loanpending"
                      value={formData.surity1loanpending || ''}
                      onChange={handleChange}
                      readOnly
                    />
                  </td>
                </tr>
                <tr key={4}>
                  <td>
                    <Select
                      options={options}
                      value={formData.surity2mno ? options.find(option => option.label == formData.surity2mno) : null}  
                      // value={formData.surity2mno ? { value: formData.surity2mno, label: formData.surity2mno } : null}
                      onChange={handleSurityChange}
                      name="surity2mno"
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      value={formData.surity2mname || ''}
                      onChange={handleChange}
                      name="surity2mname"
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="surity2phone"
                      value={formData.surity2phone || ''}
                      onChange={handleChange}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="surity2mshipmonths"
                      value={formData.surity2mshipmonths || ''}
                      onChange={handleChange}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="surity2totalsavings"
                      value={formData.surity2totalsavings || ''}
                      onChange={handleChange}
                      readOnly
                    />
                  </td>
                  <td>
                    <Input
                      type="text"
                      name="surity2loanpending"
                      value={formData.surity2loanpending || ''}
                      onChange={handleChange}
                      readOnly
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </Card>

      <Card>
        <section>
          <div className="justify-content-center mt-4 p-2 d-none">
            <h4 className="justify-content-center mb-2">Bank Account Details</h4>
            <Row>
              <Col md={6}>
                <div>
                  <Label>A/C Number</Label>
                  <Input
                    type="number"
                    value={formData.acntno || ''}
                    onChange={handleChange}
                    name="acntno"
                    readOnly
                  />
                </div>
                <div>
                  <Label>Account Name</Label>
                  <Input
                    type="text"
                    value={formData.acntname || ''}
                    onChange={handleChange}
                    name="acntname"
                    readOnly
                  />
                </div>
              </Col>

              <Col>
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    type="text"
                    value={formData.bankname || ''}
                    onChange={handleChange}
                    name="bankname"
                    readOnly
                  />
                </div>
                <div>
                  <Label>IFSC Code</Label>
                  <Input
                    type="text"
                    value={formData.ifsccode || ''}
                    onChange={handleChange}
                    name="ifsccode"
                    readOnly
                  />
                </div>
              </Col>
            </Row>
          </div>
        </section>
      </Card>

      <Row className="justify-content-center mt-4">
        <Col md={4} className="text-center">
          {/* {!(id && formData.status === 40) && !(formData.status === 40) && ( */}
              <button type="submit" className="btn btn-success">
                {id ? 'Update' : 'Submit'}
              </button>
            
        </Col>
      </Row>
    </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
    </React.Fragment>
  );
}

export default LoanAdd;
