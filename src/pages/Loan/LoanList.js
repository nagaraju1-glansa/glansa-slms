import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
// custome fetch
import { CustomFetch } from '../ApiConfig/CustomFetch';
import { RoleId } from '../ApiConfig/ApiConfig';
import Swal from 'sweetalert2';
import { Card, CardBody, Col, Row, Label, Input, Container } from "reactstrap";
import Select from 'react-select';

function LoanList() {
  const [receipts, setReceipts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0); 
    const [searchText, setSearchText] = useState(''); 
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [loanData, setLoanData] = useState(null); // State for loan data

    const [loanTypeOptions, setLoanTypeOptions] = useState([]);
    const [purposeOptions, setPurposeOptions] = useState([]);
    const today = new Date().toISOString().split("T")[0];
    const navigate = useNavigate(); 
    const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    

    const handleEdit = (row) => {
       // Show the modal or form
};
  useEffect(() => {

    const fetchReceipts = async () => {
      try{
         const url = RoleId() == 'Member' ? `/member-loan-issues?towardscode=47&page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}` : `/loan-issues?page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}`;
           const response= await CustomFetch(url);
           const data= await response.json();

           setReceipts(data.data);
          setTotalRows(data.total); 
           console.log(data,"Data");
          
         }
         catch(err){
           console.log(err,"Error found");
          
        }
    };

    fetchReceipts();
  }, [currentPage, rowsPerPage, searchText]);

  const handleChange = (e) => {

    const { name, value } = e.target;
    if(name == 'typecode'){
      const selectedOption = loanTypeOptions.find(option => option.value == value);
      setLoanData((prev) => ({
        ...prev,
        [name]: value,
        typename: selectedOption ? selectedOption.label : '',
      }));
    }
    else if(name == 'purposecode'){
      const selectedOption = purposeOptions.find(option => option.value == value);
      setLoanData((prev) => ({
        ...prev,
        [name]: value,
        purpose: selectedOption ? selectedOption.label : '',
      }));
    }
    else{
      setLoanData({
      ...loanData,
      [e.target.name]: e.target.value,
    });
    }

    
  };

  const columns = [
    { name: 'Loan ID', selector: row => row.loan_id, sortable: true },
    { name: 'Member No.', selector: row => row.mno, sortable: true },
    { name: 'Member Name', selector: row => row.mname, sortable: true },
    {
          name: 'Account No.',
          cell: row => (
            <Link to ={`/loan-installments/${row.accountno}/${row.mno}`}
            >
             {row.accountno}
            </Link>
          ),
          ignoreRowClick: true,
    },

    // { name: 'Account No.', selector: row => row.accountno, sortable: true },
    { name: 'Issue Date', selector: row => row.issuedate, sortable: true },
    { name: 'Issue Amount', selector: row => row.issueamount, sortable: true },
    { name: 'Loan Pending', selector: row => row.loanpending, sortable: true },

    { name: 'Loan Type', selector: row => row.typename, sortable: true },
    { name: 'Status', selector: row => row.status_name, sortable: true },
    // { name: 'Surety 2 M.No', selector: row => row.surity2mno, sortable: true },
    RoleId() == 'Member' ?  {
          name: '',
          cell: row => (
            <span>
            </span>
          ),
    } :
    {
      
          name: 'Actions',
          cell: row => (
            <>
            {(storedPermissions.includes("loan-edit") ) && (
            <Link to ={`/loanedit/${row.loan_id_encpt}`}
              className="btn btn-sm btn-primary"
              title="Edit"
            >
              <i className='fas fa-edit' />
            </Link>
            )}
            {(storedPermissions.includes("loan-view") ) && (
            <a
                href={`/loanview/${row.loan_id_encpt}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-primary"
                title="View"
                style={{ marginLeft: "5px" }}
              >
                <i className='fas fa-eye' />
              </a>
            )}
            </>
          ),
          ignoreRowClick: true,
    }
  ];

  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(page); 
  };

  
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

  const getLoanEligibility = async () => {
      const res = await CustomFetch(`/me`,{
        method: 'POST',
       });

      const data = await res.json();
      const mno = data.m_no_encpt;
      CustomFetch(`/check-loan-eligibility/${mno}`)
        .then((response) => response.json())
        .then((data) => {
          // eligible
          console.log(data);
          data = data[0];
          if (data.eligible) {
            //swal
             Swal.fire({
              title: 'Success!',
              text: data.message,
              icon: 'success',
              confirmButtonText: 'OK',
            });

            setLoanData(data); // Store loan eligibility data
            setShowModal(true); // Show the modal
            fetchDropdownOptions(4, setLoanTypeOptions);
            fetchDropdownOptions(54, setPurposeOptions);
          }
          // not eligible
          else {
            Swal.fire({
              title: 'Error!',
              text: data.message,
              icon: 'warning',
              confirmButtonText: 'OK',
            });
  
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
  }

  const handleLoanRequest = async () => {
    if (!loanData) return;
    console.log(loanData);
    // Send loan request data to the API
    const response = await CustomFetch('/memberloanrequest', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });

    const result = await response.json();
    if (result.success) {
      Swal.fire({
        title: 'Success!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'OK',
      });
      setShowModal(false); // Close the modal
    } else {
      Swal.fire({
        title: 'Error!',
        text: result.message,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }



  return (
    <React.Fragment>
          <div className="page-content">
            <div>
          <div className='page-title-box d-sm-flex align-items-center justify-content-between '>
            <h4>Loan Details</h4>
             { RoleId() == 'Member' ? 
              <button type="button" className="btn btn-success waves-effect waves-light" onClick={getLoanEligibility}>
                <i className="fas fa-plus align-middle me-2"></i> Request Loan
              </button> 
             : 
              <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => navigate('/loanadd')}>
                <i className="fas fa-plus align-middle me-2"></i> Add
              </button>
             }
           
          </div>
       <div className='col-xl-2 mb-3'>
            <input
              type="text"
              placeholder="Search by MName, MNO or date..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)} // Update search term
              className='form-control'
            />
          </div>
      <DataTable
            columns={columns}
            data={receipts} // Directly use the data from API
            pagination
            paginationServer
            paginationTotalRows={totalRows} // Use totalRows from API
            onChangePage={handlePageChange}
            highlightOnHover
            striped
            onChangeRowsPerPage={handlePerRowsChange}
          />
    </div>
    </div>


    
      {/* Modal for Loan Request */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }} aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Loan Eligibility Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className='row'>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Field</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Member Name:</strong></td>
                          <td>{loanData.name}</td>
                        </tr>
                        <tr>
                          <td><strong>Saving:</strong></td>
                          <td>{loanData.openingbal}</td>
                        </tr>
                        <tr>
                          <td><strong>Eligible Amount:</strong></td>
                          <td>{(loanData.eligibleamt).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td><strong>Eligible Installments:</strong></td>
                          <td>{(loanData.eligibleinstallments).toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td><strong>Account Name:</strong></td>
                          <td>{loanData.acntname}</td>
                        </tr>
                        <tr>
                          <td><strong>Account No.:</strong></td>
                          <td>{loanData.acntno}</td>
                        </tr>
                        <tr>
                          <td><strong>Bank Name:</strong></td>
                          <td>{loanData.bankname}</td>
                        </tr>
                        <tr>
                          <td><strong>IFSC Code:</strong></td>
                          <td>{loanData.ifsccode}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mb-3">
                      <Label>Loan Type</Label>
                      <Input
                        type="select"
                        name="typecode"
                        value={loanData.typecode}
                        onChange={handleChange}
                      >
                        <option value="">Select Loan Type</option>
                        {loanTypeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>

                      <Label>Loan Purpose</Label>
                      <Input
                        type="select"
                        name="purposecode"
                        value={loanData.purposecode}
                        onChange={handleChange}
                      >
                        <option value="">Select Loan Purpose</option>
                        {purposeOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Input>
                    </div>
                  </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleLoanRequest}>
                  Request Loan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default LoanList;
