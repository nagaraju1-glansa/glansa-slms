import React from 'react';
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'S.No', selector: (row, index) => index + 1, width: '70px' },
  { name: 'M No.', selector: row => row.m_no, sortable: true },
  { name: 'M Name', selector: row => row.mname, sortable: true },
//   { name: 'Towards', selector: row => row.towards || 'Loan Repayment', sortable: true },
//   { name: 'Account No', selector: row => row.loanacntno || row.accountno, sortable: true },
  { name: 'Last Paid Date', selector: row => row.lastpaiddate, sortable: true },
  { name: 'No of Months', selector: row => row.no_of_months, sortable: true, right: true },
];

const DelayedSavingReport = ({ data }) => {
  return (
    <DataTable
      title="Delayed Saving Report"
      columns={columns}
      data={data || []}
      pagination
      highlightOnHover
      dense
    />
  );
};

export default DelayedSavingReport;
