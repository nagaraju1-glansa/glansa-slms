import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { CustomFetch } from '../ApiConfig/CustomFetch';
import Swal from 'sweetalert2';

const LoanReceiptslist = () => {
  const [receipts, setReceipts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0); 
  const [searchText, setSearchText] = useState(''); 
  const navigate = useNavigate();
  const storedPermissions = JSON.parse(localStorage.getItem('permissions') || '[]');

  useEffect(() => {
    const loadData = async () => {
      try {
        const url = localStorage.getItem('RoleId') == 'Member' ? `/member-receipts?towardscode=47&page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}` : `/receipts?towardscode=47&page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}`;
                
        const res = await CustomFetch(url);
        const data = await res.json();
        setReceipts(data.data); 
        setTotalRows(data.total); 
        console.log("Fetched Receipts Data:", data);
      } catch (err) {
        console.log(err, "Error found");
      }
    }

    loadData();
  }, [currentPage, rowsPerPage, searchText]); 

  const columns = [
    { name: 'ReceiptId', selector: row => row.receipts_id, sortable: true },
    { name: 'Receipt Date', selector: row => row.receipt_date, sortable: true },
    { name: 'MNO', selector: row => row.member?.member_id ?? '', sortable: true },
    { name: 'Name', selector: row => row.membername, sortable: true },
    { name: 'Towards', selector: row => row.towards, sortable: true },
    // { name: 'lastpaiddate', selector: row => row.lastpaiddate, sortable: true },
    { name: 'Amount', selector: row => row.amount, sortable: true },
    { name: 'Interest', selector: row => row.interest, sortable: true },
    { name: 'Latefee', selector: row => row.latefee, sortable: true },
    { name: 'TotalPaid', selector: row => row.totalamount, sortable: true },
    { 
      name: 'EntryBy', 
      selector: row => row.order_id === null ? (row.user && row.user.name ? row.user.name : '') : row.membername, 
      sortable: true 
    },
     {
          name: 'Actions',
          cell: row => (
            <div>
               {(storedPermissions.includes("receipt-delete") ) && (
                  <button
                    className="btn btn-sm btn-danger"
                    title="Delete"
                    onClick={() => handleDelete(row)}
                  >
                    <i className='fas fa-trash' />
                  </button>
                )}
            </div>
            
          ),
          ignoreRowClick: true,
        },
  ];


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(page); 
  };

  
    const handleDelete = (row) => {
    Swal.fire({
      title: 'Are you sure?',
      html: `
        <p><strong>Receipt ID:</strong> ${row.receipts_id}</p>
        <p><strong>Member No:</strong> ${row.m_no}</p>
        <p><strong>Member Name:</strong> ${row.membername}</p>
        <p><strong>Amount:</strong> ₹${row.amount}</p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await CustomFetch(`/receiptdelete/${row.receipts_id}`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (data.success) {
            Swal.fire('Deleted!', 'Receipt has been deleted.', 'success');
            setReceipts((prev) => prev.filter(r => r.receipts_id !== row.receipts_id));
          } else {
            Swal.fire('Error', data.message || 'Could not delete receipt.', 'error');
          }
        } catch (error) {
          Swal.fire('Error', 'Server error occurred.', 'error');
        }
      }
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div>
          <div className='page-title-box d-sm-flex align-items-center justify-content-between '>
            <h4 className="mb-0">Loan Receipts</h4>
            {localStorage.getItem('RoleId') === 'Member' ? null : (
            <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => navigate('/receiptsadd')}>
              <i className="fas fa-plus align-middle me-2"></i> Add
            </button>
            )}
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

export default LoanReceiptslist;
