import React from 'react';
import DataTable from 'react-data-table-component';

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
  { name: 'Total Savings', selector: row => row.totalsavings, sortable: true, right: true },
  { name: 'Loan Pending', selector: row => row.loanpending, sortable: true, right: true },
  { name: 'Loan Account No', selector: row => row.loanacntno, sortable: true },
  { name: 'Loan Type Name', selector: row => row.loantypename, sortable: true },
  { name: 'Last Paid Date', selector: row => row.lastpaiddate, sortable: true },
  { name: 'ROI', selector: row => row.roi, sortable: true, right: true },
  { name: 'Entry Date', selector: row => row.entrydate, sortable: true },
  { name: 'Modify Date', selector: row => row.modifydate, sortable: true },
];

const ReceiptsDataTable = ({ data }) => {
  return (
    <DataTable
      columns={columns}
      data={data || []}
      pagination
      highlightOnHover
      defaultSortFieldId={2} // you can pick which column to sort default by
      dense
    />
  );
};

export default ReceiptsDataTable;
