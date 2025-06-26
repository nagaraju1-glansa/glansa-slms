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

const LoanView = () => {
    const [formData, setFormData] = useState({});
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
    const fetchLoanDetails = async () => {
      const res = await CustomFetch(`/loan-issues/${id}`);
      const data = await res.json();
    
      // Split surity1details and surity2details
      const [s1phone, s1mship, s1savings, s1loan] = (data.surity1details || ',,,').split(',');
      const [s2phone, s2mship, s2savings, s2loan] = (data.surity2details || ',,,').split(',');
    
      setFormData(prev => ({
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
    };
      fetchLoanDetails();
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
                              formData?.member?.image
                                  ? `${process.env.REACT_APP_APIURL_IMAGE}members/${formData.member.image}`
                                  :  ''
                          }
                        alt="profile"
                        className="rounded-circle img-fluid mb-3"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        onError={e => {
                            e.target.onerror = null;
                           e.target.src = `${process.env.REACT_APP_APIURL_IMAGE}user.jpg`;
                        }}
                />
              <h4>{formData.mname}</h4>
            <span className="badge bg-primary">Member ID: {formData.member?.member_id ?? '--'} </span>

  
               

            </div>

            {/* Right: Details */}
            <div className="col-md-8">
              <h4 className="mb-3">Loan Details</h4>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Loan Number:</div>
                <div className="col-sm-8">{formData.accountno || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Loan Amount:</div>
                <div className="col-sm-8">{formData.issueamount || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Loan Date:</div>
                <div className="col-sm-8">{formData.issuedate || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Pending Amount:</div>
                <div className="col-sm-8">{formData.loanpending || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Loan Type:</div>
                <div className="col-sm-8">{formData.typename || "--"}</div>
                </div>
                 <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Loan Reason:</div>
                <div className="col-sm-8">{formData.purpose || "--"}</div>
                </div>
                
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Status:</div>
                <div className="col-sm-8">{formData.statusname || "--"}</div>
                </div>

                <hr />
                <h5 className="mt-4 mb-3">Surity 1 Details</h5>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Mno:</div>
                <div className="col-sm-8">{formData.surity1mno || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">M Name:</div>
                <div className="col-sm-8">{formData.surity1mname || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Phone:</div>
                <div className="col-sm-8">{formData.surity1phone || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Membership Months:</div>
                <div className="col-sm-8">{formData.surity1mshipmonths || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Total Savings:</div>
                <div className="col-sm-8">{formData.surity1totalsavings || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Loan Pending:</div>
                <div className="col-sm-8">{formData.surity1loanpending || "--"}</div>
                </div>

                <hr />
                <h5 className="mt-4 mb-3">Surity 2 Details</h5>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Mno:</div>
                <div className="col-sm-8">{formData.surity2mno || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">M Name:</div>
                <div className="col-sm-8">{formData.surity2mname || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Phone:</div>
                <div className="col-sm-8">{formData.surity2phone || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Membership Months:</div>
                <div className="col-sm-8">{formData.surity2mshipmonths || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Total Savings:</div>
                <div className="col-sm-8">{formData.surity2totalsavings || "--"}</div>
                </div>
                <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Loan Pending:</div>
                <div className="col-sm-8">{formData.surity2loanpending || "--"}</div>
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

export default LoanView;
