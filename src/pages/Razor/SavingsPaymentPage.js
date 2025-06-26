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

const SavingsPaymentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    m_no: '',
    member_id: '', 
    name: '',
    amount: '100.00',
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
            towardscode: '46'
          })
        })
        .catch(() => {
        });
    }, []);

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
        amount: data.amount * 100, // amount should be in paise (multiplying by 100)
        currency: 'INR',
        name: 'Monthly Savings Payment',
        description: 'Online Savings Payment',
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


  // const handlePayment = async () => {
  //   try {
  //     const response = await CustomFetch('/payment/initiate',{
  //       method: 'POST',
  //       body: JSON.stringify(formData),
  //     });

  //     const data = await response.json(); 

  //     if (data.success) {
  //       console.log(process.env.REACT_APP_RAZORPAY_KEY);
  //       const options = {
  //         key: process.env.REACT_APP_RAZORPAY_KEY, // store key in .env
  //         amount: data.amount * 100,
  //         currency: 'INR',
  //         name: 'Monthly Savings Payment',
  //         description: 'Online Savings Payment',
  //         order_id: data.order_id,
  //         handler: function (res) {
  //           const paymentData = {
  //             ...formData,
  //             razorpay_order_id: res.razorpay_order_id,
  //             razorpay_payment_id: res.razorpay_payment_id,
  //             razorpay_signature: res.razorpay_signature,
  //             order_id: data.order_id
  //           };
  //           CustomFetch('/payment/success', {
  //             method: 'POST',
  //             body: JSON.stringify(paymentData),
  //           })
  //             .then(r => alert('Payment successful!'))
  //             .catch(e => alert('Payment verification failed'));
  //         },
  //         prefill: {
  //           name: formData.name,
  //         },
  //         theme: {
  //           color: '#3399cc',
  //         },
  //       };
  //       const rzp = new window.Razorpay(options);
  //       rzp.open();
  //     } else {
  //        Swal.fire({
  //                 title: 'Error',
  //                 text: data.message || data.error,
  //                 icon: 'error',
  //               });
  //     }
  //   } catch (error) {
  //     console.error('Payment initiation error:', error);
  //   }
  // };

  return (
       <React.Fragment>
          <div className="page-content">
            <div className='page-title-box d-sm-flex align-items-center justify-content-between'>
            <h4 className="mb-0">Saving Payment</h4>
            {/* <button type="button" className="btn btn-success waves-effect waves-light" onClick={() => navigate('/receiptsadd')}>
              <i className="fas fa-plus align-middle me-2"></i> Add
            </button> */}
          </div>
            <Container className="d-flex justify-content-center">
              <Col md={4}>
                <Card className="checkout-order-summary">
                  <CardBody>
                    <div className="p-3 bg-light mb-4">
                      <h5 className="font-size-14 mb-0">
                       Member Number<span className="float-end ms-2">{formData.member_id}</span>
                      </h5>
                    </div>
                    <div className="p-3 bg-light mb-4">
                      <h5 className="font-size-14 mb-0">
                       Member Name<span className="float-end ms-2">{formData.name}</span>
                      </h5>
                    </div>
                    <div className="p-3 bg-light mb-4">
                      <h5 className="font-size-14 mb-0">
                        Towards<span className="float-end ms-2">Savings</span>
                      </h5>
                    </div>
                    <div className="p-3 bg-light mb-4">
                      <h5 className="font-size-14 mb-0">
                        Date<span className="float-end ms-2"><input type="date" value={formData.receipt_date} name="receipt_date" onChange={handleChange} className="form-control " readOnly style={{ "margin-top": "-10px" }}/></span>
                      </h5>
                    </div>
                    <div className="p-3 bg-light mb-4">
                      <h5 className="font-size-14 mb-0">
                        Amount<span className="float-end ms-2"><input type="number" min={formData.amount} value={formData.amount} name="amount" onChange={handleChange} placeholder="Amount" className="form-control" style={{ "margin-top": "-10px" }} /></span>
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

export default SavingsPaymentPage;
