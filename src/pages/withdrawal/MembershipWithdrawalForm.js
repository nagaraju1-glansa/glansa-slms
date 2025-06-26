import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  CardBody,
  Col,
  Row,
  Label,
  Input,
  Container,
  FormGroup 
} from 'reactstrap';
import { Link, useParams} from "react-router-dom";
import Breadcrumbs from '../../components/Common/Breadcrumb';
import { CustomFetch } from '../ApiConfig/CustomFetch';
import Select from 'react-select';
import Swal from 'sweetalert2';

const MembershipWithdrawalForm = () => {
    const { id } = useParams(); 
  const [formData, setFormData] = useState({
  cvmacs_member_wstatusdate: new Date().toISOString().split('T')[0],
});
const [members, setMembers] = useState([]);
const [selectedMno, setSelectedMno] = useState(null);
const [errors, setErrors] = useState({});

useEffect(() => {
  CustomFetch("/members")
    .then(res => res.json())
    .then(setMembers)
    .catch(console.error);
}, []);

const optionsSelect = members.map(item => ({
  value: item.m_no_encpt,
  label: item.member_id,
  membername: item.name,
}));

const handleMNoChange = (selectedOption) => {
  setSelectedMno(selectedOption.value); // update selected member id
  setFormData(prev => ({
    ...prev,
    mno: selectedOption,
    membername: selectedOption.membername,
  }));
  fetchMemberDetails(selectedOption.value);
};

useEffect(() => {
  if (id) {
    fetchMemberDetails(id);
    setSelectedMno(id);
  }
}, [id]);

const fetchMemberDetails = async (id) => {
  const res = await CustomFetch(`/member-details/${id}`);
  const data = await res.json();
  console.log('Data fetched:', data);
  // paidcash(data);


   setFormData(prev => ({
    ...prev,
    wapplicantname: data.name,
    relnwith_wapplicant: data.relnwith_wapplicant,
    wreasoncode: data.wreasoncode,
    cvmacs_member_wreason: data.wreason,
    wstatusdate: data.wstatusdate,
    wstatus: data.wstatus,
    mno: data.m_no,
    member_id: data.member_id,
    membername: data.name,
    ...(data.savings && data.savings.length > 0
      ? {
          sopening: Number(data.savings[0].openingbal) || 0,
          sinterest: Number(data.savings[0].interest) || 0,
          intonopening: Number(data.savings[0].intonopening) || 0,
          added: Number(data.savings[0].added) || 0,
          intonadded: Number(data.savings[0].intonadded) || 0,

          pmember:
            (Number(data.savings[0].added) || 0) +
            (Number(data.savings[0].intonadded) || 0) +
            (Number(data.savings[0].openingbal) || 0) +
            (Number(data.savings[0].intonopening) || 0),
        }
      : {}),
    ...(data.loanissues && data.loanissues.length > 0
      ? {
          loanpending: Number(data.loanissues[0].loanpending) || 0,
          interest: Number(data.loanissues[0].calculated_interest) || 0,
          late_fee: Number(data.loanissues[0].late_fee) || 0,
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
  }));
  
};





  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await CustomFetch(`/withdrawal/${selectedMno}`, {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Error submitting form');
      };
      Swal.fire('Success!', 'Form submitted successfully!', 'success');
      console.log(response);
    } catch (error) {
      Swal.fire('Error!', 'Error submitting form', 'error');
      console.error('Error submitting form:', error);
    }
  };

  const withdrawReasons = [
    { value: '1', label: 'Leaving for Native Place' },
    { value: '2', label: 'House Shifting' },
    { value: '3', label: 'Transfer of Herself/Husband' },
    { value: '4', label: 'Inconvenience due to far away' },
    { value: '5', label: 'Not Interested in Savings' },
    { value: '6', label: 'Unable to Repay the Loanpending' },
    { value: '7', label: 'Unable Recover the Loanpending with' }
  ];

  const relationships = [
    { value: 'SELF', label: 'SELF' },
    { value: 'Husband', label: 'Husband' },
    { value: 'Daughter', label: 'Daughter' },
    { value: 'Son', label: 'Son' },
    { value: 'Father', label: 'Father' },
    { value: 'Mother', label: 'Mother' },
    { value: 'Uncle', label: 'Uncle' },
    { value: 'Aunty', label: 'Aunty' }
  ];

  const statusOptions = [
    { value: 'Under Process', label: 'Under Process' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Pending', label: 'Pending' }
  ];

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

  if(name === 'wreason') {
     const selected = withdrawReasons.find(opt => opt.value === value);
     updatedFormData.wreason = selected ? selected.label : '';
     updatedFormData.wreasoncode = selected ? selected.value : '';
  }
   else if (name === 'relnwith_wapplicant') {
     const selected = relationships.find(opt => opt.value === value);
     updatedFormData.relnwith_wapplicant = selected ? selected.label : '';
   }
  else if (name === 'wstatus') {
     const selected = statusOptions.find(opt => opt.value === value);
     updatedFormData.wstatus = selected ? selected.label : '';
  }
 setFormData(updatedFormData);
 
  };

  useEffect(() => {
  console.log('formData updated:', formData);
}, [formData]);

  const handleClear = () => {
    setFormData({
      cvmacs_member_wstatusdate: new Date().toISOString().split('T')[0],
      wstatus: 'Under Process',
      wreason: '',
      relationships: '',
      cvmacs_member_wremarks: '',
      netAmount: 0,
      balanceStatus: '',
      mno: '',
      membername: '',
      sopening: '',
      added: '',
      intonadded: '',
      openingbal: '',
      intonopening: '',
      pmember: '',
      gmember: '',
      interest: '',
      late_fee: '',
      loanpending: '',

    });
    setSelectedMno(null);
    setErrors({});
  };

  return (
  <React.Fragment>
        <div className="page-content">
        <Container fluid>
           <div className='page-title-box d-sm-flex align-items-center justify-content-between '>
            <h4 className="mb-0">Withdrawal </h4>
            {/* <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => navigate('/paymentsadd')}>
              <i className="fas fa-plus align-middle me-2"></i> Add
            </button> */}
          </div>
      {/* <Breadcrumbs title="Membership" breadcrumbItem="Withdrawal Application" /> */}
      <Card>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Label for="cvmacs_member_number">M.No</Label>
                {id ? (
                  <Input
                    type="text"
                    name="member_id"
                    value={formData.member_id || ''}
                    onChange={handleChange}
                    readOnly
                  />
                ) : (
                   <Select
                              value={formData.mno ? optionsSelect.find(option => option.value === String(formData.mno)) : null}  
                              name="mno"
                              onChange={handleMNoChange}
                              options={optionsSelect}
                              
                              classNamePrefix="select2-selection"
                            />
                )}
                            {errors.mno && <div className="text-danger">{errors.mno}</div>}
              </Col>
              <Col md={6}>
                <Label for="wreasoncode">Withdraw Reason</Label>
                <Select
                  name="wreason"
                  options={withdrawReasons}
                  onChange={handleChange}
                  // value={formData.wreason ? withdrawReasons.find(option => option.value === String(formData.wreasoncode)) : null} 
                  value={withdrawReasons.find(option => option.value === String(formData.wreasoncode)) || null} 
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Label for="relnwith_wapplicant">Relationship with Applicant</Label>
                <Select
                  name="relnwith_wapplicant"
                  options={relationships}
                   onChange={handleChange}  
                  value={relationships.find(option => option.value === String(formData.relnwith_wapplicant)) || null}
                />
              </Col>
              <Col md={6}>
                <Label for="membername">Applicant Name</Label>
                <Input
                  type="text"
                  name="membername"
                  value={formData.membername || ''}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Label for="cvmacs_member_wstatusdate">W Status Date</Label>
                <Input
                  type="date"
                  name="wstatusdate"
                  value={formData.wstatusdate || ''}
                  
                   onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <Label for="wstatus">W.App Status</Label>
                <Select
                  name="wstatus"
                  options={statusOptions || []}
                  onChange={handleChange}
                  value={statusOptions.find(option => option.value === String(formData.wstatus)) || null}
                />
              </Col>
            </Row>

             <h4 className="text-center mb-4">Saving Details</h4>
      <Row>
        <Col md={6}>
          <FormGroup className="mb-3">
            <Label for="sopening">Savings Opening</Label>
            <Input
              type="text"
              id="sopening"
              name="sopening"
              placeholder="Enter Savings Opening"
              value={formData.sopening || ''}
              readOnly
               onChange={handleChange}
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <Label for="intopening">Interest on Opening</Label>
            <Input
              type="text"
              id="intonopening"
              name="intonopening"
              placeholder="Enter Interest on Opening"
              value={formData.intonopening || ''}
              readOnly
               onChange={handleChange}
            />
          </FormGroup>

          {/* <FormGroup className="mb-3">
            <Label for="shamount">Share Capital Amount</Label>
            <Input
              type="text"
              id="shamount"
              name="shamount"
              placeholder="Enter Share Capital Amount"
              value={formData.shamount || ''}
              readOnly
            />
          </FormGroup> */}

          {/* <FormGroup className="mb-3">
            <Label for="damount">Deposit Amount</Label>
            <Input
              type="text"
              id="damount"
              name="damount"
              placeholder="Enter Deposit Amount"
              value={formData.damount || ''}
              readOnly
            />
          </FormGroup> */}
        </Col>

        <Col md={6}>
          <FormGroup className="mb-3">
            <Label for="added">Added Amount</Label>
            <Input
              type="text"
              id="added"
              name="added"
              placeholder="Enter Added"
              value={formData.added || ''}
              readOnly
               onChange={handleChange}
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <Label for="onadded">Interest On Added</Label>
            <Input
              type="text"
              id="intonadded"
              name="intonadded"
              placeholder="Enter On Added"
              value={formData.intonadded || ''}
              readOnly
               onChange={handleChange}
            />
          </FormGroup>

          {/* <FormGroup className="mb-3">
            <Label for="wsavings">Withdrawal Savings</Label>
            <Input
              type="text"
              id="wsavings"
              name="wsavings"
              placeholder="Enter Withdrawal Savings"
              value={formData.wsavings || ''}
              readOnly
            />
          </FormGroup> */}

          <FormGroup className="mb-3">
            <Label for="pmember">Pay to Member</Label>
            <Input
              type="text"
              id="pmember"
              name="pmember"
              placeholder="Enter Pay to Member"
              value={formData.pmember || ''}
              readOnly
               onChange={handleChange}
            />
          </FormGroup>
        </Col>
      </Row>
<h4 className="text-center mb-4">Loan Pending Details</h4>
        <Row>
        <Col md={6}>
          <FormGroup className="mb-3">
            <Label for="ploan">Pending LongTerm Loan</Label>
            <Input
              type="text"
              id="loanpending"
              name="loanpending"
              placeholder="Enter Pending LongTerm Loan"
              value={formData.loanpending || ''}
              readOnly
               onChange={handleChange}
            />
          </FormGroup>

          <FormGroup className="mb-3">
            <Label for="intloan">Interest on Loan</Label>
            <Input
              type="text"
              id="interest"
              name="interest"
              placeholder="Enter Interest on Loan"
              value={formData.interest || ''}
              readOnly
               onChange={handleChange}
            />
          </FormGroup>
        </Col>

        <Col md={6}>
          <FormGroup className="mb-3">
            <Label for="latefee">Late Fee</Label>
            <Input
              type="text"
              id="latefee"
              name="latefee"
              placeholder="Enter Late Fee"
              value={formData.latefee || ''}
              readOnly
               onChange={handleChange}
            />
          </FormGroup>

          {/* <FormGroup className="mb-3">
            <Label for="plamount">Pending Daily Loan Amount</Label>
            <Input
              type="text"
              id="plamount"
              name="plamount"
              placeholder="Enter Pending Daily Loan Amount"
              value={formData.plamount || ''}
              readOnly
            />
          </FormGroup> */}

      
        </Col>
        <Col md={6}>
        </Col>
        <Col md={6}>
            <FormGroup className="mb-3">
            <Label for="gmember">Get From Member</Label>
            <Input
              type="text"
              id="gmember"
              name="gmember"
              placeholder="Enter Get From Member"
              value={formData.gmember || ''}
              readOnly
               onChange={handleChange}
            />
          </FormGroup>
        </Col>
      </Row>

            <div className="text-center">
                      <button type="submit" className="btn btn-primary mr-2">Submit</button>
                      {/* <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button> */}
                    </div>
          </Form>
        </CardBody>
      </Card>

      <Card className="mt-4">
        <CardBody>
          <Row className="mb-3">
            <Col md={{ size: 6, offset: 3 }}>
              <Label><strong>{formData.balanceStatus}</strong></Label>
              <Input
                type="text"
                name="netAmount"
                value={formData.netAmount || ''}
                readOnly
                className="form-control"
                 onChange={handleChange}
              />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Container>
  </div>
  </React.Fragment>
  );
};

export default MembershipWithdrawalForm;
