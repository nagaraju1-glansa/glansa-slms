import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { Link, useNavigate, useParams } from 'react-router-dom';
// custome fetch
import { CustomFetch } from '../ApiConfig/CustomFetch';
import Breadcrumbs from "../../components/Common/Breadcrumb";

// useParams



function LoanInstallmentsList() {
    const [breadcrumbItems] = useState([
        { title: "Dashboard", link: "/dashboard" },
        { title: "List", link: "#" },
      ]);
    const { id ,mno } = useParams();
    const [installmentsdata, setInstallmentsdata] = useState([]);
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
       CustomFetch(
            `/loan-installment-details?page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}&loanacntno=${id}&mno=${mno}`,
            {
                method: 'GET'
            }
            )
        .then(response => response.json())
        .then(data => {
          setInstallmentsdata(data.schedule);
          setTotalRows(data.total);
          console.log(data,"Data");
        })
        .catch(error => {
          console.error("Error fetching receipts:", error);
        });
        //    const response= await CustomFetch(`/loan-installment-details?page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}`);
        //    const data= await response.json();

        //    setReceipts(data.data);
        //   setTotalRows(data.total); 
        //    console.log(data,"Data");
          
         }
         catch(err){
           console.log(err,"Error found");
          
        }
    };

    fetchReceipts();
  }, [currentPage, rowsPerPage, searchText]);

  const columns = [
    { name: 'Month', selector: row => row.month, sortable: true },
    { name: 'Installment Date', selector: row => row.installmentdate, sortable: true },

    { name: 'Opening Balance', selector: row => row.Openingbal, sortable: true },
    { name: 'instamount', selector: row => row.instamount, sortable: true },
    { name: 'Interest', selector: row => row.interest, sortable: true },
    { name: 'Total Payment', selector: row => row.totalpayment, sortable: true },
    { name: 'Closing Balance', selector: row => row.closingbalance, sortable: true },
    // { name: 'Loan Type', selector: row => row.typename, sortable: true },
    // // { name: 'Surety 1 M.No', selector: row => row.surity1mno, sortable: true },
    // // { name: 'Surety 2 M.No', selector: row => row.surity2mno, sortable: true },
    // {
    //       name: 'Actions',
    //       cell: row => (
    //         <Link to ={`/loanedit/${row.loan_id_encpt }`}
    //           className="btn btn-sm btn-primary"
    //           title="Edit"
    //         >
    //           <i className='fas fa-edit' />
    //         </Link>
    //       ),
    //       ignoreRowClick: true,
    //     }
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
                  <Breadcrumbs title="Loan Installments" breadcrumbItems={breadcrumbItems} />
      <DataTable
            columns={columns}
            data={installmentsdata} // Directly use the data from API
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

export default LoanInstallmentsList;
