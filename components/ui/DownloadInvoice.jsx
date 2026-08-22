"use client";

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function DownloadInvoice({ order }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const invoiceDiv = document.createElement('div');
      
      const customerName = `${order.profiles?.first_name || 'Customer'} ${order.profiles?.last_name || ''}`.trim();
      const orderDate = new Date(order.created_at).toLocaleDateString('en-IN');
      const displayOrderId = order.id.split('-')[0].toUpperCase();
      const totalAmount = Number(order.total_amount).toLocaleString('en-IN');
      
      // Address parsing
      let addressHtml = order.shipping_address || 'Address not provided';
      if (typeof order.shipping_address === 'string' && order.shipping_address.startsWith('{')) {
        try {
          const addr = JSON.parse(order.shipping_address);
          addressHtml = `${addr.street || ''}, ${addr.city || ''}, ${addr.state || ''} - ${addr.postalCode || ''}`;
        } catch (e) {}
      }

      // Calculate totals
      const subtotal = order.order_items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || order.total_amount;
      const totalItems = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      const discount = subtotal > order.total_amount ? (subtotal - order.total_amount) : 0;

      // Generate Items Rows
      const itemsHtml = order.order_items?.map(item => `
        <tr>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px;">
            ${item.product_variants?.products?.title || 'Premium Product'} 
            <br/><span style="font-size: 12px; color: #6b7280;">Size: ${item.product_variants?.size || 'Standard'}</span>
          </td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151; font-size: 14px; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb;">${item.quantity}</td>
          <td style="padding: 12px 15px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #374151; font-size: 14px;">₹ ${Number(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>
      `).join('') || '';

      invoiceDiv.innerHTML = `
        <div style="width: 800px; padding: 40px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
          
          <!-- Top Header -->
          <div style="text-align: center; margin-bottom: 25px;">
            <img src="https://www.srijandesignerstudio.com/email-img/logo.webp" alt="SRIJAN Fashion" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h1 style="color: #1f2937; font-size: 24px; font-weight: normal; margin: 0;">Order Invoice</h1>
          </div>

          <!-- Main Card -->
          <div style="background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);">
            
            <p style="font-weight: bold; font-size: 16px; margin-top: 0; margin-bottom: 20px; color: #111;">Hi, ${customerName},</p>
            <p style="color: #4b5563; font-size: 14px; margin-bottom: 25px;">Here is the detailed summary and invoice for your recent order with us.</p>
            
            <h3 style="font-size: 15px; color: #111; margin-bottom: 10px;">Order Details</h3>
            <p style="margin: 0 0 5px; color: #4b5563; font-size: 14px;">Order ID: <strong>#${displayOrderId}</strong></p>
            <p style="margin: 0 0 5px; color: #4b5563; font-size: 14px;">Order Date: <strong>${orderDate}</strong></p>
            <p style="margin: 0 0 5px; color: #4b5563; font-size: 14px;">Payment Status: <strong>${order.payment_status || 'Paid'}</strong></p>
            <p style="margin: 0 0 25px; color: #4b5563; font-size: 14px;">Order Total: <strong>₹${totalAmount}</strong></p>

            <!-- Table (Exact match to the image) -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 25px; border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden;">
              <thead>
                <tr style="background-color: #38bdf8; color: #ffffff;">
                  <th colspan="3" style="padding: 12px; text-align: center; font-size: 16px; font-weight: bold;">Order Details</th>
                </tr>
                <tr style="background-color: #ffffff; color: #111;">
                  <th style="padding: 10px 15px; text-align: left; font-size: 13px; font-style: italic; border-bottom: 1px solid #e5e7eb;">ITEMS</th>
                  <th style="padding: 10px 15px; text-align: center; font-size: 13px; border-bottom: 1px solid #e5e7eb; border-left: 1px solid #e5e7eb; border-right: 1px solid #e5e7eb; width: 100px;">QTY</th>
                  <th style="padding: 10px 15px; text-align: center; font-size: 13px; border-bottom: 1px solid #e5e7eb; width: 150px;">PRICE</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                
                <!-- Summary Rows -->
                <tr>
                  <td colspan="2" style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px; border-right: 1px solid #e5e7eb;">Subtotal (${totalItems} items):</td>
                  <td style="padding: 12px 15px; text-align: center; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px;">₹ ${subtotal.toLocaleString('en-IN')}</td>
                </tr>
                ${discount > 0 ? `
                <tr>
                  <td colspan="2" style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px; border-right: 1px solid #e5e7eb;">Discount:</td>
                  <td style="padding: 12px 15px; text-align: center; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px;">- ₹ ${discount.toLocaleString('en-IN')}</td>
                </tr>
                ` : ''}
                <tr>
                  <td colspan="2" style="padding: 12px 15px; text-align: right; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px; border-right: 1px solid #e5e7eb;">Shipping Rate:</td>
                  <td style="padding: 12px 15px; text-align: center; border-bottom: 1px solid #e5e7eb; color: #374151; font-size: 14px;">Free</td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 12px 15px; text-align: right; color: #111; font-size: 14px; border-right: 1px solid #e5e7eb;">Order Total:</td>
                  <td style="padding: 12px 15px; text-align: center; color: #111; font-size: 14px;">₹ ${totalAmount}</td>
                </tr>
              </tbody>
            </table>

            <!-- Delivery Address -->
            <h3 style="font-size: 14px; color: #111; margin-bottom: 5px;">Delivery Address</h3>
            <p style="margin: 0 0 25px; color: #4b5563; font-size: 14px; line-height: 1.5;">${addressHtml}</p>

            <p style="color: #4b5563; font-size: 14px; margin-bottom: 15px;">We'll keep you updated as your order moves through each stage of the process.</p>
            <p style="color: #4b5563; font-size: 14px; margin-bottom: 15px;">If you have any questions regarding your order, please contact our support team.</p>
            <p style="color: #4b5563; font-size: 14px; font-style: italic; margin: 0;">Thank you for choosing <strong>SRIJAN Fashion</strong>.</p>
          </div>

          <!-- Bottom Footer -->
          <div style="text-align: center; margin-top: 25px;">
            <p style="font-weight: bold; margin: 0 0 5px; color: #111; font-size: 16px;">SRIJAN Fashion | Designer Boutique | Custom Fashion</p>
            <p style="color: #6b7280; font-size: 12px; margin: 0;">This is an automated generated email, please do not reply. For support visit our website.</p>
          </div>
        </div>
      `;
      
      invoiceDiv.style.position = 'absolute';
      invoiceDiv.style.left = '-9999px';
      invoiceDiv.style.top = '0';
      document.body.appendChild(invoiceDiv);

      // Add a small delay to ensure images load properly before generating PDF
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(invoiceDiv, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_SRJ_${displayOrderId}.pdf`);

      document.body.removeChild(invoiceDiv);
    } catch (error) {
      alert("Failed to generate invoice. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={generatePDF}
      disabled={isGenerating}
      className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
    >
      {isGenerating ? <Loader2 size={16} className="animate-spin text-[#0ba6ff]" /> : <Download size={16} className="text-[#0ba6ff]" />}
      {isGenerating ? 'Generating...' : 'Download Invoice'}
    </button>
  );
}