import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate } from 'react-router-dom';
// custome fetch
import { CustomFetch } from '../ApiConfig/CustomFetch';


function LoanList() {
  const [receipts, setReceipts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0); 
    const [searchText, setSearchText] = useState(''); 
    const navigate = useNavigate(); // <-- hook for navigation

    const handleEdit = (row) => {
       // Show the modal or form
};
  useEffect(() => {
    const fetchReceipts = async () => {
      try{
           const response= await CustomFetch(`/loan-issues?page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}`);
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
    // { name: 'Surety 1 M.No', selector: row => row.surity1mno, sortable: true },
    // { name: 'Surety 2 M.No', selector: row => row.surity2mno, sortable: true },
    {
          name: 'Actions',
          cell: row => (
            <Link to ={`/loanedit/${row.loan_id_encpt}`}
              className="btn btn-sm btn-primary"
              title="Edit"
            >
              <i className='fas fa-edit' />
            </Link>
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

  return (
    <React.Fragment>
          <div className="page-content">
            <div>
          <div className='page-title-box d-sm-flex align-items-center justify-content-between '>
            <h4>Loan Details</h4>
            <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => navigate('/loanadd')}>
              <i className="fas fa-plus align-middle me-2"></i> Add
            </button>
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
    </React.Fragment>
  );
}

export default LoanList;
