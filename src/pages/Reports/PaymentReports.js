import React from 'react';
import DataTable from 'react-data-table-component';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const columns = [
  { name: 'S.No', selector: (row, index) => index + 1, sortable: true, width: '70px' },
  { name: 'Date', selector: row => row.date, sortable: true },
  { name: 'Payment ID', selector: row => row.payments_id, sortable: true },
  { name: 'Towards', selector: row => row.towards, sortable: true },
  { name: 'Amount', selector: row => row.amount, sortable: true, right: true },
  { name: 'Mode of Payment', selector: row => row.mode_of_payment, sortable: true },
  { name: 'Member No', selector: row => row.mno, sortable: true },
  { name: 'Member Name', selector: row => row.membername, sortable: true },
  { name: 'Cheque No', selector: row => row.cheque_no, sortable: true },
  { name: 'Bank Name', selector: row => row.bank_name, sortable: true },
  { name: 'Account No', selector: row => row.account_no, sortable: true },
];

const PaymentDataTable = ({ data }) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'Payments.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map(col => col.name);
    const tableRows = data.map((row, index) => [
      index + 1,
      row.date,
      row.payments_id,
      row.towards,
      row.amount,
      row.mode_of_payment,
      row.mno,
      row.membername,
      row.cheque_no,
      row.bank_name,
      row.account_no,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 7 },
      margin: { top: 10 },
    });

    doc.save('Payments.pdf');
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button className='btn btn-success' onClick={exportToExcel}>Export to Excel</button>{' '}
        <button className='btn btn-danger mr-2' onClick={exportToPDF}>Export to PDF</button>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        pagination
        highlightOnHover
        dense
        defaultSortFieldId={2}
        responsive
      />
    </div>
  );
};

export default PaymentDataTable;
