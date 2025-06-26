import React from "react";
// import "./ReceiptPrint.css"; // Optional: put styles if needed

const ReceiptPrint = ({ receiptData, show, onClose }) => {
  if (!receiptData) return null;

  const handlePrint = () => {
    const printContents = document.getElementById("printThis").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // re-render app after printing
  };

  return (
    <div className={`modal ${show ? "d-block" : "d-none"}`} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-body" id="printThis">
            <div className="container mt-3 text-start">
              <center style={{ paddingLeft: "60px" }}>
                <h5 style={{ fontSize: "16px", letterSpacing: "1px" }}>
                  Glansa - SAVING & LOAN MANAGEMENT SYSTEM
                </h5>
                <p style={{ fontSize: "17px", marginBottom: 0 }}>
                  Regd. No AMC/DCO/RR/711/2007
                </p>
                <p style={{ fontSize: "16px" }}>
                  Jahangir Nagar, Chintalkunta, Checkpost <br />
                  LBNagar R.R. Dist, Ph: 7075232349
                </p>

                <div
                  className="row"
                  style={{ fontSize: "16px", letterSpacing: "1px" }}
                >
                  <div className="col-5 text-start pe-0">
                    <p>
                      R.NO: <span>{receiptData.cvmacs_rcpt_number}</span>
                    </p>
                    <p>
                      M.No: <span>{receiptData.member_id}</span>
                    </p>
                  </div>
                  <div className="col-7 text-start ps-4">
                    <p>
                      Date: <span>{receiptData.receipt_date}</span>
                    </p>
                    <p>
                      M.Name: <span>{receiptData.membername}</span>
                    </p>
                  </div>
                </div>
              </center>

              <div
                className="row justify-content-center"
                style={{ paddingLeft: "60px" }}
              >
                <table
                  className="table table-borderless"
                  style={{ fontSize: "16px", letterSpacing: "1px" }}
                >
                  <thead>
                    <tr className="border-bottom">
                      <th>Particulars</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{receiptData.towards}</td>
                      <td>₹{receiptData.amount}</td>
                    </tr>
                    <tr>
                      <td>Late Fee</td>
                      <td>₹{receiptData.latefee}</td>
                    </tr>
                    {receiptData.interest && parseFloat(receiptData.interest) > 0 && (
                      <tr>
                        <td>Interest</td>
                        <td>₹{receiptData.interest}</td>
                      </tr>
                    )}
                    <tr className="border-top">
                      <td>Total Amount</td>
                      <td>₹{receiptData.totalamount}</td>
                    </tr>
                    <tr className="text-end">
                      <td className="text-start">
                        <h6>Thank You</h6>
                      </td>
                      <td>
                        <p>Signature</p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <h6 className="text-end">
                చేయి చేయి కలుపుదాం - ప్రగతి పథాన పయనిద్దాం
              </h6>
            </div>
          </div>

          <div className="modal-footer">
           <button
                className="btn btn-secondary"
                onClick={() => {
                onClose();                // Close the modal (your existing function)
                window.location.reload(); // Reload the page
                }}
            >
                Close
            </button>
            <button className="btn btn-primary" onClick={handlePrint}>
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPrint;
