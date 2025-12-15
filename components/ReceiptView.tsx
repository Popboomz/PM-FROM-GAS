
import React, { useState } from 'react';
import { Order, OrderType } from '../types';
import { Button } from './Button';
import { Share2, Printer, FileText, CheckCircle2, ArrowLeft, Hexagon, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReceiptViewProps {
  order: Order;
  onClose: () => void;
  isHistoryMode?: boolean;
}

export const ReceiptView: React.FC<ReceiptViewProps> = ({ order, onClose, isHistoryMode = false }) => {
  const [format, setFormat] = useState<'80mm' | 'A4'>('80mm');

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt ${order.id}`,
          text: `Invoice for ${order.customer.name} - Total: $${order.totalAmount}`,
          url: window.location.href, 
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      const text = `INVOICE: ${order.id}\nAmt: $${order.totalAmount}\nDate: ${order.date.toLocaleDateString()}`;
      navigator.clipboard.writeText(text);
      alert("Receipt details copied to clipboard!");
    }
  };

  const handleA4Preview = () => {
    setFormat('A4');
    setTimeout(() => {
      window.print();
    }, 200);
  };

  // --- RENDER HELPERS ---
  const isPreorder = order.type === OrderType.PREORDER;
  const locationName = order.location || 'Eastwood';
  const shopAddress = locationName === 'Eastwood' ? '123 Rowe Street, Eastwood NSW 2122' : '456 Church St, Parramatta NSW 2150';

  return (
    <div className="flex flex-col h-full bg-slate-900/90 backdrop-blur-sm absolute inset-0 z-[100] overflow-y-auto">
      
      {/* Printable Area */}
      <div className="flex-1 flex justify-center py-8 px-4" onClick={(e) => e.stopPropagation()}>
        <motion.div 
          id="printable-area"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-white shadow-2xl mx-auto overflow-hidden flex flex-col transition-all duration-300 ${
            format === 'A4' ? 'w-[210mm] min-h-[297mm] p-12' : 'w-[80mm] min-h-[400px] p-4 pb-8'
          }`}
        >
          {/* =======================
              A4 ENTERPRISE LAYOUT 
             ======================= */}
          {format === 'A4' && (
            <div className="flex flex-col h-full font-sans text-gray-800">
              {/* Header */}
              <div className="flex justify-between items-start mb-12">
                <div className="flex items-center space-x-3">
                   <div className="w-12 h-12 bg-slate-900 text-white flex items-center justify-center rounded-lg">
                      <Hexagon size={28} strokeWidth={2.5} />
                   </div>
                   <div>
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900">PHONE MECHANIC</h1>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Technology Specialists</p>
                   </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">TAX INVOICE</h2>
                  <p className="text-sm font-bold text-gray-500">#{order.id}</p>
                </div>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">From</h3>
                  <p className="font-bold text-gray-900">Phone Mechanic {locationName}</p>
                  <p className="text-sm text-gray-600">{shopAddress}</p>
                  <p className="text-sm text-gray-600">ABN: 12 345 678 901</p>
                  <p className="text-sm text-gray-600">Ph: (02) 9999 8888</p>
                  <p className="text-sm text-gray-600">support@phonemechanic.com.au</p>
                </div>
                <div>
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Bill To</h3>
                   <p className="font-bold text-gray-900">{order.customer.name}</p>
                   <p className="text-sm text-gray-600">{order.customer.phone}</p>
                   {order.customer.email && <p className="text-sm text-gray-600">{order.customer.email}</p>}
                   
                   <div className="mt-4 grid grid-cols-2 gap-4">
                     <div>
                       <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</h3>
                       <p className="text-sm font-semibold">{order.date.toLocaleDateString()}</p>
                     </div>
                     <div>
                       <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Staff</h3>
                       <p className="text-sm font-semibold">{order.staffName || 'Staff'}</p>
                     </div>
                   </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="flex-1">
                 <table className="w-full text-left mb-8">
                   <thead>
                     <tr className="border-b-2 border-slate-900 text-xs uppercase font-bold text-slate-900">
                       <th className="py-3">Description</th>
                       <th className="py-3 text-center">Qty</th>
                       <th className="py-3 text-right">Unit Price</th>
                       <th className="py-3 text-right">Total</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                     {order.items.map((item, i) => (
                       <tr key={i} className="border-b border-gray-100">
                         <td className="py-4 pr-4">
                           <p className="font-bold text-gray-900">{item.name}</p>
                           {/* Add extra details for repairs */}
                           {order.type === 'REPAIR' && i === 0 && order.deviceDetails && (
                              <p className="text-xs text-gray-500 mt-1">Device: {order.customer.deviceModel} {order.deviceDetails.imei && `(IMEI: ${order.deviceDetails.imei})`}</p>
                           )}
                         </td>
                         <td className="py-4 text-center text-gray-600">{item.quantity}</td>
                         <td className="py-4 text-right text-gray-600">${item.price.toFixed(2)}</td>
                         <td className="py-4 text-right font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
              </div>

              {/* Footer Totals */}
              <div className="flex justify-end mb-12">
                 <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm text-gray-600">
                       <span>Subtotal</span>
                       <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                         <span>Discount</span>
                         <span>-${order.discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-gray-600">
                       <span>GST (Included 10%)</span>
                       <span>${(order.totalAmount / 11).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t-2 border-slate-900">
                       <span className="font-bold text-xl text-slate-900">Total</span>
                       <span className="font-bold text-xl text-slate-900">${order.totalAmount.toFixed(2)}</span>
                    </div>

                    {/* Pre-Order Specifics */}
                    {isPreorder && (
                      <div className="pt-2 mt-2 border-t border-dashed border-gray-300 space-y-1">
                        <div className="flex justify-between text-sm text-gray-600">
                           <span>Deposit Paid ({order.paymentMethod})</span>
                           <span>-${order.deposit.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-red-600">
                           <span>Balance Due</span>
                           <span>${order.balanceDue.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                    {!isPreorder && (
                       <div className="text-right text-xs text-gray-500 pt-2">
                          PAID IN FULL via {order.paymentMethod}
                       </div>
                    )}
                 </div>
              </div>

              {/* Bottom Footer */}
              <div className="border-t border-gray-200 pt-8 flex items-center justify-between">
                 <div className="text-xs text-gray-500 space-y-1">
                    <p className="font-bold text-gray-900">Payment Terms</p>
                    <p>Standard repair warranty is 90 days on parts only.</p>
                    <p>Physical or liquid damage voids all warranties.</p>
                    <p>Goods not collected within 60 days may be disposed of.</p>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 mb-2">
                       <QrCode size={32} />
                    </div>
                    <span className="text-[10px] text-gray-400 uppercase tracking-wide">Scan for Invoice</span>
                 </div>
              </div>
            </div>
          )}

          {/* =======================
              80mm THERMAL LAYOUT 
             ======================= */}
          {format === '80mm' && (
            <div className="font-mono text-sm leading-tight text-black">
              <div className="text-center mb-4 pb-4 border-b-2 border-black">
                 <h2 className="text-2xl font-black mb-1">PHONE MECHANIC</h2>
                 <p className="font-bold uppercase text-xs mb-1">{locationName}</p>
                 <p className="text-[10px]">ABN: 12 345 678 901</p>
                 <p className="text-[10px]">Ph: (02) 9999 8888</p>
                 <h3 className="text-lg font-bold mt-3 border-2 border-black inline-block px-2 py-1">
                    {isPreorder ? 'PRE-ORDER' : 'TAX INVOICE'}
                 </h3>
              </div>

              <div className="mb-4 text-xs font-bold space-y-1">
                 <div className="flex justify-between"><span>Date:</span><span>{order.date.toLocaleDateString()} {order.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                 <div className="flex justify-between"><span>Inv #:</span><span>{order.id}</span></div>
                 <div className="flex justify-between"><span>Staff:</span><span>{order.staffName || 'Admin'}</span></div>
                 <div className="border-t border-dashed border-black my-2"></div>
                 <div>Customer: {order.customer.name}</div>
                 <div>Phone: {order.customer.phone}</div>
                 {order.customer.email && <div>Email: {order.customer.email}</div>}
              </div>

              <div className="mb-4">
                 <div className="flex font-bold border-b border-black pb-1 mb-1 text-xs uppercase">
                    <span className="flex-1">Item</span>
                    <span className="w-12 text-right">Amt</span>
                 </div>
                 {order.items.map((item, i) => (
                    <div key={i} className="mb-2 text-xs">
                       <div className="font-bold">{item.name}</div>
                       <div className="flex justify-between">
                          <span className="text-[10px]">{item.quantity} x ${item.price.toFixed(2)}</span>
                          <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="border-t-2 border-black pt-2 space-y-1">
                 <div className="flex justify-between font-bold text-sm">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                 </div>
                 {order.discount > 0 && (
                    <div className="flex justify-between text-xs">
                       <span>Discount</span>
                       <span>-${order.discount.toFixed(2)}</span>
                    </div>
                 )}
                 <div className="flex justify-between font-black text-xl mt-2">
                    <span>TOTAL</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                 </div>
                 <div className="text-[10px] text-right text-gray-500 mb-2">Inc GST</div>

                 {isPreorder ? (
                   <div className="border border-black p-2 mt-2">
                      <div className="flex justify-between font-bold text-sm">
                         <span>DEPOSIT ({order.paymentMethod})</span>
                         <span>${order.deposit.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-black my-1"></div>
                      <div className="flex justify-between font-black text-lg">
                         <span>BALANCE DUE</span>
                         <span>${order.balanceDue.toFixed(2)}</span>
                      </div>
                   </div>
                 ) : (
                   <div className="text-center font-bold border border-black p-1 mt-2">
                      PAID: {order.paymentMethod}
                   </div>
                 )}
              </div>

              <div className="text-center mt-6 text-[10px] font-bold">
                 <p className="mb-1">Thank you for your business!</p>
                 <p>www.phonemechanic.com.au</p>
                 <div className="mt-4 border-t border-dashed border-black pt-2">
                    <p>Terms & Conditions Apply</p>
                    <p>90 Day Warranty on Parts</p>
                 </div>
                 {/* Barcode Simulation */}
                 <div className="w-full h-8 bg-black mt-4 opacity-80"></div>
                 <div className="text-center text-[8px] mt-1">{order.id}</div>
              </div>
            </div>
          )}

        </motion.div>
      </div>

      {/* Floating Action Bar */}
      <div className="no-print p-4 bg-white border-t border-gray-200 flex justify-center gap-4 fixed bottom-0 w-full z-[110] md:static md:bg-transparent md:border-none md:p-6">
         <div className="flex gap-2 bg-slate-900 p-2 rounded-xl shadow-lg">
           <Button variant="secondary" onClick={handleShare} className="!h-10 text-xs">
             <Share2 size={16} className="mr-2" /> Share
           </Button>
           <Button variant="secondary" onClick={() => { setFormat('80mm'); setTimeout(handlePrint, 100); }} className="!h-10 text-xs">
             <Printer size={16} className="mr-2" /> 80mm
           </Button>
           <Button variant="secondary" onClick={handleA4Preview} className={`!h-10 text-xs ${format === 'A4' ? 'bg-blue-100' : ''}`}>
             <FileText size={16} className="mr-2" /> A4 PDF
           </Button>
           <div className="w-px bg-white/20 mx-1"></div>
           <Button onClick={onClose} className="!bg-green-600 !h-10 text-xs">
             {isHistoryMode ? <ArrowLeft size={16} className="mr-2" /> : <CheckCircle2 size={16} className="mr-2" />}
             {isHistoryMode ? 'Back' : 'Done'}
           </Button>
         </div>
      </div>
    </div>
  );
};
