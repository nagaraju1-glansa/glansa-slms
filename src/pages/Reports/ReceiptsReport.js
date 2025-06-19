import React from 'react';
import DataTable from 'react-data-table-component';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const columns = [
  { name: '#', selector: (row, i) => i + 1, width: '50px' },
  { name: 'Receipt Date', selector: row => row.receipt_date, sortable: true },
  { name: 'Receipt ID', selector: row => row.receipts_id, sortable: true },
  { name: 'Member No', selector: row => row.m_no, sortable: true },
  { name: 'Member Name', selector: row => row.membername, sortable: true },
  { name: 'Towards', selector: row => row.towards, sortable: true },
  { name: 'Amount', selector: row => row.amount, sortable: true, right: true },
  { name: 'Interest', selector: row => row.interest, sortable: true, right: true },
  { name: 'Late Fee', selector: row => row.latefee, sortable: true, right: true },
  { name: 'Total Amount', selector: row => row.totalamount, sortable: true, right: true },
];

const ReceiptsDataTable = ({ data }) => {
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Receipts');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(file, 'Receipts.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map(col => col.name);
    const tableRows = data.map((row, i) => [
      i + 1,
      row.receipt_date,
      row.receipts_id,
      row.m_no,
      row.membername,
      row.towards,
      row.amount,
      row.interest,
      row.latefee,
      row.totalamount,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      margin: { top: 10 },
    });

    doc.save('Receipts.pdf');
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
        defaultSortFieldId={2}
        dense
      />
    </div>
  );
};

export default ReceiptsDataTable;
