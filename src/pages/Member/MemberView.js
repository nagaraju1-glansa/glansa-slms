import React , { useState, useEffect } from 'react';
import { Link, useParams , useNavigate } from 'react-router-dom';
import { CustomFetch } from '../ApiConfig/CustomFetch';
import { TabContent, TabPane, Collapse, NavLink, NavItem, Nav, Card, Row, Col, CardBody, CardHeader, Container } from "reactstrap";


const member = {
  m_no: 'M1023',
  name: 'John',
  aliasname: 'Johnny',
  surname: 'Doe',
  image: 'https://i.pravatar.cc/150?img=5',
  designation: 'Software Engineer',
  doj: '2020-01-15',
  dob: '1995-05-10',
  occupan: 'IT Professional',
  aadhaarno: '1234-5678-9012',
  panno: 'ABCDE1234F',
  mobile1: '9876543210',
  mobile2: '9123456789',
  landline: '040-12345678',
  stayingwith: 'Family',
  swname: 'Jane Doe',
  swoccupan: 'Homemaker',
  nomineename: 'Alex Doe',
  rwnominee: 'Brother',
  tfamilymembers: 4,
  femalecnt: 2,
  malecnt: 2,
  isownresidence: true,
  tmpcolony: 'Green Colony',
  tmpdist: 'Hyderabad',
  tmppin: '500001',
  prmntcolony: 'Sky Residency',
  prmntdist: 'Secunderabad',
  prmntpin: '500003',
  depositamount: 5000,
  sharecapital: 2000,
  acntno: '123456789012',
  acntname: 'John Doe',
  ifsccode: 'HDFC0001234',
  bankname: 'HDFC Bank',
//   savings:[],
//   loanissues:[],
};

const Memberview = () => {
    const [member, setMember] = useState({});
    const { id } = useParams();
    const [openIndexes, setOpenIndexes] = useState([]);
    const navigate = useNavigate();

    const toggle = (index) => {
    setOpenIndexes((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

    useEffect(() => {
      const fetchMemberDetails = async () => {
        try {
          const response = await CustomFetch(`/member-details/${id}`);
          const data = await response.json();
          setMember(data);
         setMember(prev => ({
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
        } catch (error) {
          console.error('Error fetching member details:', error);
        }
      };
  
      fetchMemberDetails();
    }, []);
  return (
    <React.Fragment>
            <div className="page-content">
              <div className='page-title-box d-sm-flex align-items-center justify-content-between'>
              <h4 className="mb-0">Member Profile</h4>
              <button type="button" className="btn btn-success waves-effect waves-light"  onClick={()=> navigate(`/membersedit/${localStorage.getItem('mencpt')}`) }>
                  <i className="fas fa-edit align-middle me-2"></i> Edit 
              </button>
          </div>
    <div className="container ">
      <div className="card shadow-lg">
        <div className="card-body">
          <div className="row">
            {/* Left: Image and Basic Info */}
            <div className="col-md-4 text-center border-end">
               <img
                        src={
                            member.image
                            ? `${member.image}`
                            : ""
                        }
                        alt="profile"
                        className="rounded-circle img-fluid mb-3"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        onError={e => {
                            e.target.onerror = null;
                            e.target.src = "http://127.0.0.1:8000/storage/uploads/user.jpg";
                        }}
                        />
              <h4>{member.name} {member.surname}</h4>
              <p className="text-muted">{member.designation}</p>
              <span className="badge bg-primary">Member ID: {member.m_no}</span>
              {member.savings && member.savings.length > 0 &&(
                <div>

                  <h5 className="mt-4 mb-3">Savings Information</h5>
                  <div className="row mb-2">
                    <div className="col-sm-4 fw-bold">Total Savings :</div>
                    <div className="col-sm-8">{(
                                                (Number(member.savings[0].added) || 0) +
                                                (Number(member.savings[0].intonadded) || 0) +
                                                (Number(member.savings[0].openingbal) || 0) +
                                                (Number(member.savings[0].intonopening) || 0)
                                              ).toFixed(2)}</div>
                  </div>
                </div>
              )}
           {member.loanissues && member.loanissues.length > 0 && (
        <div id="accordion" className="mt-4">
          <h5 className="mb-3">Total Loan Information</h5>
          {member.loanissues.map((loan, index) => (
            <Card className="mb-1 shadow-none" key={index}>
              <Link
                to="#"
                onClick={() => toggle(index)}
                style={{ cursor: "pointer" }}
                className="text-dark"
              >
                <CardHeader>
                  <h6 className="m-0 font-14">
                    Loan ID #{member.loanissues[index].accountno || index + 1}
                    <i
                      className={
                        openIndexes.includes(index)
                          ? "mdi mdi-minus float-end accor-plus-icon"
                          : "mdi mdi-plus float-end accor-plus-icon"
                      }
                    ></i>
                  </h6>
                </CardHeader>
              </Link>
              <Collapse isOpen={openIndexes.includes(index)}>
                <CardBody className='text-left'>
                  <div className="row mb-2">
                    <div className="col-sm-4 fw-bold"> Loan No :</div>
                    <div className="col-sm-8"> <Link to ={`/loan-installments/${member.loanissues[index].accountno}/${member.loanissues[index].mno}`}
                                >
                                {member.loanissues[index].accountno || "0"}
                                </Link>
                                
                            </div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-4 fw-bold">Issue Loan :</div>
                    <div className="col-sm-8">{member.loanissues[index].issueamount || "0"}</div>
                  </div>
                  <div className="row mb-2">
                    <div className="col-sm-4 fw-bold">Pending Loan :</div>
                    <div className="col-sm-8">{member.loanissues[index].pendingamount || "0"}</div>
                  </div>
                  {/* <div className="row mb-2">
                    <div className="col-sm-4 fw-bold">Last Paid Date :</div>
                    <div className="col-sm-8">{member.loanissues[index].lastpaiddate || "0"}</div>
                  </div> */}
                   <div className="row mb-2">
                    <div className="col-sm-4 fw-bold">Status :</div>
                    <div className="col-sm-8">
                        {member.loanissues[index].status_option?.name || "--"}
                        </div>
                    
                  </div>
                </CardBody>
              </Collapse>
            </Card>
          ))}
        </div>
      )}
               

            </div>

            {/* Right: Details */}
            <div className="col-md-8">
              <h5 className="mb-3">Personal Information</h5>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Alias Name:</div>
                <div className="col-sm-8">{member.aliasname}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">DOB / DOJ:</div>
                <div className="col-sm-8">{member.dob} / {member.doj}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Occupation:</div>
                <div className="col-sm-8">{member.occupan}</div>
              </div>

              <h5 className="mt-4 mb-3">Contact Details</h5>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Mobile:</div>
                <div className="col-sm-8">{member.mobile1}, {member.mobile2}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Landline:</div>
                <div className="col-sm-8">{member.landline}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Aadhaar / PAN:</div>
                <div className="col-sm-8">{member.aadhaarno} / {member.panno}</div>
              </div>

              <h5 className="mt-4 mb-3">Address</h5>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Temporary:</div>
                <div className="col-sm-8">{member.tmpcolony}, {member.tmpdist} - {member.tmppin}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Permanent:</div>
                <div className="col-sm-8">{member.prmntcolony}, {member.prmntdist} - {member.prmntpin}</div>
              </div>

              <h5 className="mt-4 mb-3">Bank Details</h5>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Bank:</div>
                <div className="col-sm-8">{member.bankname}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">IFSC / A/C:</div>
                <div className="col-sm-8">{member.ifsccode} / {member.acntno}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Holder Name:</div>
                <div className="col-sm-8">{member.acntname}</div>
              </div>

              <h5 className="mt-4 mb-3">Other</h5>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Nominee:</div>
                <div className="col-sm-8">{member.nomineename} ({member.rwnominee})</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Family Members:</div>
                <div className="col-sm-8">{member.tfamilymembers} (F: {member.femalecnt}, M: {member.malecnt})</div>
              </div>
              <div className="row">
                <div className="col-sm-4 fw-bold">Residence Type:</div>
                <div className="col-sm-8">{member.isownresidence ? 'Own' : 'Rented'}</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </React.Fragment>
  );
};

export default Memberview;
