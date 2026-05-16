import { jsPDF } from 'jspdf';
import { Movie } from '../types';

interface BookingData {
  movie: Movie;
  seats: string[];
  date: string;
  time: string;
  totalPrice: number;
  bookingId: string;
  userName: string;
}

export const generateTicketPDF = (data: BookingData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Background Colors
  doc.setFillColor(244, 63, 94); // Rose 500
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Header Text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('CinéPass Ticket', pageWidth / 2, 25, { align: 'center' });
  
  // Booking Info Section
  doc.setTextColor(51, 65, 85); // Slate 700
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Booking ID: ${data.bookingId}`, pageWidth - 15, 50, { align: 'right' });
  
  // Movie Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.text(data.movie.title, 15, 65);
  
  // Divider
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.line(15, 75, pageWidth - 15, 75);
  
  // Details Grid
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Slate 500
  doc.text('DATE', 15, 85);
  doc.text('TIME', 60, 85);
  doc.text('LANGUAGE', 105, 85);
  
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFont('helvetica', 'bold');
  doc.text(data.date, 15, 92);
  doc.text(data.time, 60, 92);
  doc.text(data.movie.language, 105, 92);
  
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('SEATS', 15, 105);
  doc.text('TOTAL AMOUNT', 105, 105);
  
  doc.setTextColor(244, 63, 94); // Rose 500
  doc.setFont('helvetica', 'bold');
  doc.text(data.seats.join(', '), 15, 112);
  doc.text(`$${data.totalPrice.toFixed(2)}`, 105, 112);
  
  // Passenger Info
  doc.setDrawColor(241, 245, 249);
  doc.setFillColor(248, 250, 252);
  doc.rect(15, 125, pageWidth - 30, 20, 'F');
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text('BOOKED BY', 20, 132);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(data.userName, 20, 139);
  
  // QR Code Placeholder
  doc.setDrawColor(226, 232, 240);
  doc.rect(pageWidth / 2 - 15, 155, 30, 30);
  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text('SCAN AT COUNTER', pageWidth / 2, 190, { align: 'center' });
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Terms & Conditions Apply. Please arrive 15 minutes early.', pageWidth / 2, 205, { align: 'center' });
  
  // Save PDF
  doc.save(`CinePass_Ticket_${data.bookingId}.pdf`);
};
