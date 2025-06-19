import React from 'react';
import DataTable from 'react-data-table-component';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const columns = [
  { name: 'S.No', selector: (row, index) => index + 1, width: '70px' },
  { name: 'M No.', selector: row => row.m_no, sortable: true },
  { name: 'M Name', selector: row => row.member_name, sortable: true },
  { name: 'Total Savings', selector: row => row.added, sortable: true },
  { name: 'Last Paid Date', selector: row => row.lastpaiddate, sortable: true },
  { name: 'No of Months', selector: row => row.no_of_months, sortable: true, right: true },
];


const DelayedSavingReport = ({ data }) => {

    const exportToExcel = () => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Delayed Saving Report');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(file, 'DelayedSavingReport.xlsx');
    };

     const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map(col => col.name);
    const tableRows = data.map((row, index) => [
      index + 1,
      row.m_no,
      row.member_name,
      row.added,
      row.lastpaiddate,
      row.no_of_months,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      margin: { top: 10 },
    });

    doc.save('DelayedSavingReport.pdf');
  };


  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button className='btn btn-success'  onClick={exportToExcel}>Export to Excel</button>{' '}
        <button className='btn btn-danger mr-2' onClick={exportToPDF}>Export to PDF</button>
      </div>
      <DataTable
        columns={columns}
        data={data || []}
        pagination
        highlightOnHover
        dense
      />
    </div>
  );
};

export default DelayedSavingReport;
