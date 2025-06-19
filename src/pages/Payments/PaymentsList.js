import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
// import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { CustomFetch } from '../ApiConfig/CustomFetch';

function PaymentsList() {
  const [payments, setPayments] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [rowsPerPage, setRowsPerPage] = useState(10);
   const [totalRows, setTotalRows] = useState(0); 
   const [searchText, setSearchText] = useState(''); 
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchPayments = async () => {
      try {

        const response = await CustomFetch(`/payments?towards=Loan Repayments&page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}`);
        const data = await response.json();
        setPayments(data.data); 
        setTotalRows(data.total); 
        console.log("Fetched Payments Data:", data);

      } catch (err) {
        console.error("Error fetching payments:", err);
      }
    };

    fetchPayments();
  }, [currentPage, rowsPerPage, searchText]);

  
const goToPaymentsform = () => {
    navigate('/payments-form');
  };
  const columns = [
    { name: 'S.No.', selector: row => row.payments_id, sortable: true },
    { name: 'Payment_Date', selector: row => row.date, sortable: true },
    { name: 'Payment_Towards', selector: row => row.towards, sortable: true },
    { name: 'Payment_Mode', selector: row => row.modeofpmtname, sortable: true },
    { name: 'M_No', selector: row => row.mno, sortable: true },
    { name: 'Account no', selector: row => row.acntno, sortable: true },
    { name: 'Amount', selector: row => row.amount, sortable: true },
    { name: 'EntryBy', selector: row => row.user && row.user.name ? row.user.name : '', sortable: true }

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
            <h4 className="mb-0">Payments </h4>
            <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => navigate('/paymentsadd')}>
              <i className="fas fa-plus align-middle me-2"></i> Add
            </button>
          </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <input
          type="text"
          placeholder="Search by name, account no, or Aadhaar..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            padding: '6px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />

      </div>

       <DataTable
            columns={columns}
            data={payments} // Directly use the data from API
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

export default PaymentsList;
