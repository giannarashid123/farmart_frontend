import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateInvoice = (order) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FARMART RECEIPT', 105, 20, { align: 'center' });

  // Meta Data
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Order ID: #${order.id}`, 14, 35);
  doc.text(`Date: ${order.date}`, 14, 42);

  // Payment Status
  doc.setFontSize(12);
  doc.text(`Payment Status: ${order.status}`, 14, 49);

  // Customer Info
  if (order.customer) {
    doc.text(`Customer: ${order.customer.name}`, 14, 56);
    doc.text(`Phone: ${order.customer.phone}`, 14, 63);
    doc.text(`Delivery: ${order.customer.county}, ${order.customer.town}`, 14, 70);
  }

  // Table
  const tableBody = order.items.map(item => [
    item.name,
    item.quantity,
    `KSh ${item.price.toLocaleString()}`,
    `KSh ${(item.price * item.quantity).toLocaleString()}`
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Item', 'Quantity', 'Unit Price', 'Total']],
    body: tableBody,
    theme: 'striped',
    headStyles: { fillColor: [34, 197, 94] }, // Green color
    styles: { fontSize: 10 },
  });

  // Grand Total
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Grand Total: KSh ${order.total.toLocaleString()}`, 14, finalY);

  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('Thank you for shopping with Farmart!', 105, 280, { align: 'center' });

  // Save PDF
  doc.save(`Farmart_Receipt_${order.id}.pdf`);
};
