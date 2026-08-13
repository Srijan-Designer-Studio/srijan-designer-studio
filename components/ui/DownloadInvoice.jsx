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
      
      invoiceDiv.innerHTML = `
        <div style="padding: 40px; font-family: sans-serif; color: #333; width: 800px; background: white;">
          <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px;">
            <div>
              <h1 style="color: #0ba6ff; margin: 0; font-size: 28px;">SRIJAN Fashion</h1>
              <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Santipur, West Bengal, India</p>
              <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Email: support@srijanfashion.com</p>
            </div>
            <div style="text-align: right;">
              <h2 style="margin: 0; color: #111; font-size: 24px;">INVOICE</h2>
              <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Order ID: #${order.id.split('-')[0].toUpperCase()}</p>
              <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Date: ${new Date(order.created_at).toLocaleDateString('en-IN')}</p>
              <p style="margin: 5px 0 0; color: #666; font-size: 14px;">Payment: ${order.payment_method} (${order.payment_status})</p>
            </div>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="margin-bottom: 10px; color: #111; font-size: 16px;">Billed To:</h3>
            <p style="margin: 0; font-size: 15px;"><strong>${order.profiles?.first_name || 'Customer'} ${order.profiles?.last_name || ''}</strong></p>
            <p style="margin: 5px 0; font-size: 14px; color: #444; max-width: 300px;">${order.shipping_address || 'Address not provided'}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; border-bottom: 2px solid #ddd; text-align: left; font-size: 14px; color: #111;">Item Details</th>
                <th style="padding: 12px; border-bottom: 2px solid #ddd; text-align: center; font-size: 14px; color: #111;">Qty</th>
                <th style="padding: 12px; border-bottom: 2px solid #ddd; text-align: right; font-size: 14px; color: #111;">Unit Price</th>
                <th style="padding: 12px; border-bottom: 2px solid #ddd; text-align: right; font-size: 14px; color: #111;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.order_items?.map(item => `
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; color: #444;">
                    ${item.product_variants?.products?.title || 'Premium Product'} 
                    <br/><span style="font-size: 12px; color: #888;">Size: ${item.product_variants?.size || 'Standard'}</span>
                  </td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-size: 14px; color: #444;">${item.quantity}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-size: 14px; color: #444;">₹${Number(item.price).toLocaleString('en-IN')}</td>
                  <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-size: 14px; color: #444;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div style="display: flex; justify-content: flex-end;">
            <div style="width: 300px;">
              <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; color: #444;">
                <span>Subtotal:</span>
                <span>₹${Number(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 10px 0; font-size: 14px; color: #444;">
                <span>Shipping Fee:</span>
                <span>₹0</span>
              </div>
              <div style="display: flex; justify-content: space-between; padding: 15px 0; border-top: 2px solid #111; font-weight: bold; font-size: 18px; color: #111;">
                <span>Total Amount:</span>
                <span>₹${Number(order.total_amount).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
          
          <div style="margin-top: 50px; text-align: center; color: #888; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
            <p>This is a computer-generated invoice and does not require a physical signature.</p>
          </div>
        </div>
      `;
      
      invoiceDiv.style.position = 'absolute';
      invoiceDiv.style.left = '-9999px';
      invoiceDiv.style.top = '0';
      document.body.appendChild(invoiceDiv);

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
      pdf.save(`Invoice_SRJ_${order.id.split('-')[0].toUpperCase()}.pdf`);

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
      className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
    >
      {isGenerating ? <Loader2 size={16} className="animate-spin text-[#0ba6ff]" /> : <Download size={16} className="text-[#0ba6ff]" />}
      {isGenerating ? 'Generating...' : 'Download Invoice'}
    </button>
  );
}