import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  CardBody,
  Col,
  Row,
  Label,
  Input,
  Container,
  Table
} from "reactstrap";
import { API_BASE_URL, getToken} from '../ApiConfig/ApiConfig';
import { CustomFetch } from '../ApiConfig/CustomFetch';
import Swal from 'sweetalert2';

const LoanPaymentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    m_no: '',
    member_id: '',
    name: '',
    amount: '',
    receipt_date: new Date().toISOString().split('T')[0],
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

    useEffect(() => {
      const token = getToken();
  
      // Verify token with backend
      fetch(`${API_BASE_URL}/me`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 401) {
            throw new Error('Unauthorized');
          }
          return res.json();
        })
        .then((data) => {
            setFormData({
            ...formData,
            m_no: data.m_no,
            member_id: data.member_id,
            name: data.name,
            towardscode: '47',
          })
          loanget(data.m_no);
        })
        .catch(() => {
        });
    }, []);

    // const loanDetails = (m_no) => {
    //   CustomFetch(`/members/${m_no}`, {
    //     method: 'GET',
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //         console.log(data);
    //       setFormData({
    //         ...formData,
    //         amount: data.amount,
    //       });
    //     });
    // };

      const loanget = (mno) => {
    // console.log(mno);
        // if(formData.towardscode === "47"){
           CustomFetch(`/loan-issues/mno/${mno}/status/40`)
          .then((res) => res.json())
          .then((data) => {
            if (data && data.length > 0) {
              console.log(data);
              const loan = data[0];
    
            
    
              setFormData((prev) => ({
                ...prev,
                loanacntno: loan.accountno || '0',
                issueamount: loan.issueamount || '0',
                loantypecode: loan.typecode || '0',
                loantypename: loan.typename || '',
                loanpending: loan.loanpending || '0',
                roi: loan.roi || '0',
                modeofrepayment: loan.modeofrepayment || '',
                clearancedate: loan.clearancedate || '',
                instamount: loan.instamount || '',
                amount: loan.instamount || '',
                installments: loan.installments || '',
                latefee: loan.late_fee || '0',
                lastpaiddate: loan.lastpaiddate || '',
                interest: loan.interest || '',
                totalamount: (loan.emi || 0) + (loan.late_fee || 0),
              }));
            }
            else{
              Swal.fire({
                title: 'Error',
                text: 'Loan not found',
                icon: 'error',
              })
            //    handleClear();
            }
          })
          .catch(console.error);
        // }
       
      };

    // const handlePayment = async () => {
    //   try {
    //     console.log(formData);
    //     const response = await CustomFetch('/payment/initiate', {
    //       method: 'POST',
    //       body: JSON.stringify(formData),
    //       'Accept': 'application/json',
    //       'Content-Type': 'application/json',
    //     });
    //     const data = await response.json(); 
    //     console.log(data);
    //     if (data.success) {
    //       console.log('Payment initiated:', data);
    //       // handle payment redirect or confirmation
    //     } else {
    //       console.error('Payment failed:', data.message || data.error);
    //     }
    //   } catch (error) {
    //     console.error('Payment initiation error:', error.message || error);
    //   }
    // };

 const handlePayment = async () => {
  try {
    const response = await CustomFetch('/payment/initiate', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (data.success) {
      console.log(process.env.REACT_APP_RAZORPAY_KEY);
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY, // store key in .env
        amount: data.totalamount * 100, // amount should be in paise (multiplying by 100)
        currency: 'INR',
        name: 'Monthly Loan Payment',
        description: 'Online Loan Payment',
        order_id: data.order_id,
        handler: function (res) {
          const paymentData = {
            ...formData,
            razorpay_order_id: res.razorpay_order_id,
            razorpay_payment_id: res.razorpay_payment_id,
            razorpay_signature: res.razorpay_signature,
            order_id: data.order_id,
          };

          // Sending payment data to server for success
          CustomFetch('/payment/success', {
            method: 'POST',
            body: JSON.stringify(paymentData),
          })
            .then((r) => Swal.fire('Payment successful!'))
            .catch((e) => {
              // Handle failure if payment verification fails
              Swal.fire('Payment verification failed', e.message, 'error');
            });
        },
        // Handler to manage payment cancellation
        modal: {
          ondismiss: function () {
            Swal.fire('Payment cancelled by user');
          },
        },
        prefill: {
          name: formData.name,
        },
        theme: {
          color: '#3399cc',
        },
        // Add an error handler for the Razorpay instance
        handlerError: function (error) {
          console.error('Payment failed:', error);
          Swal.fire('Payment failed', 'An error occurred during payment processing.', 'error');
        },
      };

      const rzp = new window.Razorpay(options);

      // Open Razorpay modal
      rzp.open();
    } else {
      // Handle failure to initiate payment
      Swal.fire({
        title: 'Error',
        text: data.message || data.error,
        icon: 'error',
      });
    }
  } catch (error) {
    // Handle unexpected errors
    console.error('Payment initiation error:', error);
    Swal.fire('Payment initiation error', error.message || 'Something went wrong', 'error');
  }
};


  return (
       <React.Fragment>
          <div className="page-content">
            <div className='page-title-box d-sm-flex align-items-center justify-content-between'>
            <h4 className="mb-0">Loan Payment</h4>
            {/* <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => navigate('/receiptsadd')}>
              <i className="fas fa-plus align-middle me-2"></i> Add
            </button> */}
          </div>
            <Container className="d-flex justify-content-center">
              <Col md={4}>
                <Card className="checkout-order-summary">
                  <CardBody>
                    <div className="p-3 bg-light mb-4">
                      <h5 className="font-size-14 mb-2">
                       Member Number<span className="float-end ms-2">{formData.m_no}</span>
                      </h5>
                      <h5 className="font-size-14 mb-2">
                       Member Name<span className="float-end ms-2">{formData.name}</span>
                      </h5>
                       <h5 className="font-size-14 mb-2">
                            Towards<span className="float-end ms-2">Savings</span>
                        </h5>
                        <h5 className="font-size-14 mb-2">
                            Current Loan ACC NO<span className="float-end ms-2">{formData.loanacntno}</span>
                        </h5>
                        <h5 className="font-size-14 mb-2">
                            Total Loan Amount<span className="float-end ms-2">{formData.issueamount}</span>
                        </h5>
                        <h5 className="font-size-14 mb-2">
                            Total Loan Pending<span className="float-end ms-2">{formData.loanpending}</span>
                        </h5>
                        <h5 className="font-size-14 mb-2">
                            Loan Last Paid Date<span className="float-end ms-2">{formData.lastpaiddate}</span>
                        </h5>
                        <h5 className="font-size-14 mb-2">
                            Date<span className="float-end ms-2">{formData.receipt_date}</span>
                        </h5>
                        <h5 className="font-size-14 mb-2">
                            Amount<span className="float-end ms-2">{formData.amount}</span>
                        </h5>
                        <h5 className="font-size-14 mb-2">
                            Late Fee<span className="float-end ms-2">{formData.latefee || 0}</span>
                        </h5>
                        <h5 className="font-size-14 mb-2">
                            Interest<span className="float-end ms-2">{formData.interest}</span>
                        </h5>
                         <h5 className="font-size-14 mb-2">
                                Total Amount<span className="float-end ms-2">
                                    {formData.totalamount || 0}
                                </span>
                            </h5>
                    </div>

                    
                    <div className="text-center">
                       <button className="btn btn-primary mt-3" onClick={handlePayment}>Pay Now</button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
          </Container>
        </div>
        
    </React.Fragment>
  );
};

export default LoanPaymentPage;
