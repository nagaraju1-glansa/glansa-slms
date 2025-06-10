import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import  'jspdf-autotable';

// Attach autotable plugin to jsPDF
// autoTable(jsPDF);

export const getCurrentDateString = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

export const exportToExcel = (data) => {
  const wb = XLSX.utils.book_new();

  const receiptSheet = XLSX.utils.json_to_sheet(data.total_receipt_amounts);
  XLSX.utils.book_append_sheet(wb, receiptSheet, 'Receipts');

  const paymentSheet = XLSX.utils.json_to_sheet(data.total_payment_amounts);
  XLSX.utils.book_append_sheet(wb, paymentSheet, 'Payments');

  const wbout = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
  const filename = `Reports_${getCurrentDateString()}.xlsx`;
  saveAs(new Blob([wbout], { type: 'application/octet-stream' }), filename);
};

export const exportToPDF = (data) => {
  const doc = new jsPDF();

  doc.text('Receipts', 14, 10);
  doc.autoTable({
    startY: 15,
    head: [['Receipt Towards', 'Total Amount']],
    body: data.total_receipt_amounts.map((item) => [
      item.towards || 'N/A',
      parseFloat(item.total_amount).toLocaleString('en-IN'),
    ]),
  });

  doc.addPage();
  doc.text('Payments', 14, 10);
  doc.autoTable({
    startY: 15,
    head: [['Payment Towards', 'Total Amount']],
    body: data.total_payment_amounts.map((item) => [
      item.towards || 'N/A',
      parseFloat(item.total_amount).toLocaleString('en-IN'),
    ]),
  });

  const filename = `Reports_${getCurrentDateString()}.pdf`;
  doc.save(filename);
};
