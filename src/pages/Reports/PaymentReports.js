import React from 'react';
import DataTable from 'react-data-table-component';

const columns = [
  { name: 'S.No',selector: (row, index) => index + 1,sortable: true, width: '70px'},
  { name: 'Date', selector: row => row.receipt_date, sortable: true },
  { name: 'Payment ID',selector: row => row.payments_id,sortable: true,},
  { name: 'Member No',selector: row => row.m_no,sortable: true,
  },
  {
    name: 'Member Name',
    selector: row => row.membername,
    sortable: true,
  },
  {
    name: 'Towards',
    selector: row => row.towards,
    sortable: true,
  },
  {
    name: 'Amount',
    selector: row => row.amount,
    sortable: true,
    right: true,
  },
  {
    name: 'Mode of Payment',
    selector: row => row.mode_of_payment,
    sortable: true,
  },
  {
    name: 'Loan Acnt No',
    selector: row => row.loan_account_no,
    sortable: true,
  },
  {
    name: 'Loan Type Name',
    selector: row => row.loan_type_name,
    sortable: true,
  },
  {
    name: 'Cheque No',
    selector: row => row.cheque_no,
    sortable: true,
  },
  {
    name: 'Bank Name',
    selector: row => row.bank_name,
    sortable: true,
  },
  {
    name: 'Account No',
    selector: row => row.account_no,
    sortable: true,
  },
  {
    name: 'Entry Date',
    selector: row => row.entry_date,
    sortable: true,
  },
  {
    name: 'Modify Date',
    selector: row => row.modify_date,
    sortable: true,
  },
  {
    name: 'Modify By',
    selector: row => row.modify_by,
    sortable: true,
  },
];

const PaymentDataTable = ({ data }) => {
  return (
    <DataTable
      columns={columns}
      data={data || []}
      pagination
      highlightOnHover
      dense
      defaultSortFieldId={2} // sorts by Payment ID by default
      responsive
    />
  );
};

export default PaymentDataTable;
