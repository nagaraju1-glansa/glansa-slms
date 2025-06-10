import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, Row, Label, Input, Container } from "reactstrap";
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import { CustomFetch } from '../ApiConfig/CustomFetch';

import Breadcrumbs from "../../components/Common/Breadcrumb";
import dayjs from 'dayjs';


function InterestRun() {
   const [breadcrumbItems] = useState([
      { title: "GLANSA SLMS", link: "/dashboard" },
      { title: "Reports", link: "#" },
    ]);
  const navigate = useNavigate();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [reportsType,selectedReportsType] = useState(null);
    const [reportSummary, setReportSummary] = useState(null);
    const [data, setData] = useState({
      total_receipt_amounts: [],
      total_payment_amounts: []
    });
    const [formData, setFormData] = useState({
        roi:8,
        from_date: '',
        to_date: '',
        month: '',
        year: ''
    });

  const [receipts, setReceipts] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0); 
  const [searchText, setSearchText] = useState('');
  
   const loadData = async () => {
      try {
        // Add search term to the API request 
        const res = await CustomFetch(`/intprocessonsavings?page=${currentPage}&per_page=${rowsPerPage}&search=${searchText}`);
        const data = await res.json();
        setReceipts(data.data); 
        setTotalRows(data.total); 
        console.log("Fetched Receipts Data:", data);
      } catch (err) {
        console.log(err, "Error found");
      }
    }


  useEffect(() => {
   

    loadData();
  }, [currentPage, rowsPerPage, searchText]); 

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setRowsPerPage(newPerPage);
    setCurrentPage(page); 
  };

// const fetchData = async (page = 1) => {
//     setLoading(true);
//     try {
//       const res = await CustomFetch(`/intprocessonsavings`);
//       setList(res);
//       setPageCount(res.data.last_page);
//     } catch (error) {
//       console.error(error);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData(pageIndex + 1);
//   }, [pageIndex]);
  
 const columns = [
    { name: 'intprocess_id', selector: row => row.intprocess_id, sortable: true },
    { name: 'intonsavings_code', selector: row => row.intonsavings_code, sortable: true },
    { name: 'intonsavings_currfinyr', selector: row => row.intonsavings_currfinyr, sortable: true },
    { name: 'intonsavings_processingmonth', selector: row => row.intonsavings_processingmonth, sortable: true },
    { name: 'intonsavings_monthlyroi', selector: row => row.intonsavings_monthlyroi, sortable: true },
    { name: 'intonsavings_isprocessed', selector: row => row.intonsavings_isprocessed, sortable: true },
  ];

const handlerChange = (e) => {
  const { name, value } = e.target;
//   setFormData((prevData) => ({
//     ...prevData,
//     [name]: value,
//   }));

 if (name === 'month') {
    const startOfMonth = dayjs(value).startOf('month').format('YYYY-MM-DD');
    const endOfMonth = dayjs(value).endOf('month').format('YYYY-MM-DD');

    setFormData((prevData) => ({
      ...prevData,
      from_date: startOfMonth,
      to_date: endOfMonth,
      month: value
    }));
  } else {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

};





const handleSubmit = async (e) => {
  e.preventDefault();

if (formData.from_date && !formData.to_date) {
  Swal.fire({
    title: 'Error!',
    text: 'Please select the end date.',
    icon: 'error',
    confirmButtonText: 'OK'
  });
  return;
}

if (!formData.from_date && formData.to_date) {
  Swal.fire({
    title: 'Error!',
    text: 'Please select the start date.',
    icon: 'error',
    confirmButtonText: 'OK'
  });
  return;
}
//   const response = await CustomFetch(`/interestrun`,{
//     method: 'POST',
//     body: JSON.stringify(formData)
//   }
//   )
// //   console.log(formData);
  
//   const res = await response.json();
//   console.log(res);
//   if(formData.report_type==1){
//     setData(res);
//   }
//   else{
//   setReportSummary(res.data);
//   }



  try {
  CustomFetch(`/interestrun`, {
      method: 'POST',
      body: JSON.stringify(formData)
    })
    .then((response) => response.json())
    .then((data) => {
      if(data.success){
        Swal.fire({
          title: 'Success!',
          text: data.message,
          icon: 'success',
          confirmButtonText: 'OK'
        });

        loadData();
    }
        else{
         Swal.fire({
          title: 'Error!',
          text: data.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });

    // const res = await response.json();

    // console.log(res);

    
   

    // if (response.ok) {
    //   // Swal.fire({
    //   //   title: 'Success!',
    //   //   text: 'Data fetched successfully.',
    //   //   icon: 'success',
    //   //   confirmButtonText: 'OK'
    //   // });
    // } else {
    //   Swal.fire({
    //     title: 'Error!',
    //     text: data.error || 'Something went wrong.',
    //     icon: 'error',
    //     confirmButtonText: 'OK'
    //   });
    // }
  } catch (error) {
    Swal.fire({
      title: 'Error!',
      text: error.message,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};



// In your form element:


  return (
    
//     <div className='page-content'>
//       <div
//   style={{
//     display: 'flex',
//     justifyContent: 'flex-end',
//     marginBottom: '10px',
//     width: '100%',
//   }}
// >
//   <button
//     onClick={() => navigate('/SavingsList')}
//     style={{
//       backgroundColor: 'blue',
//       color: 'white',
//       padding: '6px 12px',
//       cursor: 'pointer',
//       border: 'none',
//       borderRadius: '4px',
//     }}
//   >
//     Back
//   </button>
// </div>
<React.Fragment>
      <div className="page-content">
      <Container fluid>
         <Breadcrumbs
                    title="Interest Run"
                    breadcrumbItems={breadcrumbItems}
                  />
        <Row>
          <Col xs={12}>

            <Card>
              <CardBody>

                <form onSubmit={handleSubmit}>
                  <Row>
                     <Col md={4}>

                      <div className="mb-3">
                        <Label htmlFor="receipt-date-input">ROI (%)</Label>
                          <Input
                          id="receipt-date-input"
                          type="number"
                          name='roi'
                          value={formData.roi}
                          onChange={handlerChange}
                        />
                      </div>
                      
                    </Col>
                    <Col md={4}>
                        <div className="mb-3">
                        <Label htmlFor="receipt-date-input">Month Process</Label>
                        <Input
                          id="receipt-date-input"
                          type="month"
                          name='month'
                          value={formData.month}
                          onChange={handlerChange}
                        />
                      </div>
                      
                    </Col>
                    {/* <Col md={4}>
                        <div className="mb-3">
                        <Label htmlFor="lastpaid-date-input">End Date</Label>
                        <Input
                          id="lastpaid-date-input"
                          type="date"
                           value={formData.to_date}
                          name='to_date'
                          onChange={handlerChange}
                        />
                      </div>
                    </Col> */}
                    
                  </Row>
                  <Row className="justify-content-center mt-4">
                    <Col md={4} className="text-center">
                      <button type="submit" className="btn btn-primary">Run</button>
                    </Col>
                  </Row>
                </form>


                <Row className='mt-2'>
                    
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
                </Row>
               
    
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  </React.Fragment>
  );
}

export default InterestRun;

