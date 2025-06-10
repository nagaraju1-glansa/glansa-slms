import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { CustomFetch } from '../ApiConfig/CustomFetch';

const SavingReceiptsList = () => {
  const [receipts, setReceipts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0); 
  const [searchText, setSearchText] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Add search term to the API request
        const url = localStorage.getItem('RoleId') == 'Member' ? `/member-receipts?towardscode=46&page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}` : `/receipts?towardscode=46&page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}`;
        const res = await CustomFetch(url);
        const data = await res.json();
        setReceipts(data.data); 
        setTotalRows(data.total); 
      } catch (err) {
        console.log(err, "Error found");
      }
    }

    loadData();
  }, [currentPage, rowsPerPage, searchText]); 

  const columns = [
    { name: 'Member Name', selector: row => row.membername, sortable: true },
    { name: 'Member No.', selector: row => row.m_no, sortable: true },
    { name: 'Name', selector: row => row.membername, sortable: true },
    { name: 'Amount', selector: row => row.amount, sortable: true },
    { name: 'Towards', selector: row => row.towards, sortable: true },
    { name: 'Receipt Date', selector: row => row.receipt_date, sortable: true },
    { name: 'Entry By', selector: row => row.user.username, sortable: true },
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
          <div className='page-title-box d-sm-flex align-items-center justify-content-between'>
            <h4 className="mb-0">Saving Receipts</h4>
            <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => navigate('/receiptsadd')}>
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

export default SavingReceiptsList;
