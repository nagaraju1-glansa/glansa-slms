import React , { useState, useEffect } from 'react';
import { API_BASE_URL, getToken} from '../ApiConfig/ApiConfig';
import {useNavigate , useParams} from 'react-router-dom';
import { CustomFetch } from '../ApiConfig/CustomFetch';


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
  bankname: 'HDFC Bank'
};

const EmployeeView = () => {
    const [member, setMember] = useState({});
    const navigate = useNavigate();
    const { id } = useParams();
    
    useEffect(() => {
      const fetchMemberDetails = async () => {
        try {
          const response = await CustomFetch(`/get-user/${id}` );
          const data = await response.json();
          setMember(data.user);
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
              <h4 className="mb-0">Profile</h4>
              <button type="button" className="btn btn-success waves-effect waves-light"  onClick={()=> navigate(`/employeedit/${id}`) }>
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
                            ? `${process.env.REACT_APP_APIURL_IMAGE}employees/${member.image}`
                            : `${process.env.REACT_APP_APIURL_IMAGE}user.jpg`
                        }
                        alt="profile"
                        className="rounded-circle img-fluid mb-3"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        onError={e => {
                            e.target.onerror = null;
                           e.target.src = `${process.env.REACT_APP_APIURL_IMAGE}user.jpg`;
                        }}
                        />
              <h4>{member.name} {member.surname}</h4>
              <p className="text-muted">{member.designation}</p>
              <span className="badge bg-primary">Employee ID: {member.employeeid}</span>
            </div>

            {/* Right: Details */}
            <div className="col-md-8">
              <h5 className="mb-3">Personal Information</h5>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Full Name:</div>
                <div className="col-sm-8">{member.surname} {member.name}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">DOB:</div>
                <div className="col-sm-8">{member.dob}  </div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">DOJ:</div>
                <div className="col-sm-8">{member.doj}</div>
              </div>

              <h5 className="mt-4 mb-3">Contact Details</h5>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Mobile:</div>
                <div className="col-sm-8">{member.phonenumber}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Email:</div>
                <div className="col-sm-8">{member.email}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Aadhaar / PAN:</div>
                <div className="col-sm-8">{member.aadhaarno} / {member.panno}</div>
              </div>

              <h5 className="mt-4 mb-3">Address</h5>
              <div className="row mb-2">
                <div className="col-sm-4 fw-bold">Permanent:</div>
                <div className="col-sm-8">{member.colony}, {member.dist} - {member.pincode}</div>
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

              {/* <h5 className="mt-4 mb-3">Other</h5>
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
              </div> */}

            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </React.Fragment>
  );
};

export default EmployeeView;
