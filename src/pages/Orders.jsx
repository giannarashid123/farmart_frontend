import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, Calendar, CheckCircle, Download } from 'lucide-react';
import { generateInvoice } from '../utils/generateInvoice';

const Orders = () => {
  const orders = useSelector(state => state.orders.history);

  const formatPrice = (price) => {
    return `KSh ${price.toLocaleString()}`;
  };

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-center">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No past orders found</h2>
          <p className="text-slate-500 mb-6">Start shopping to see your order history here.</p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
            <ArrowLeft size={20} />
            Browse Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Orders</h1>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-slate-500">Order ID</p>
                  <p className="font-mono font-bold text-slate-900">#{order.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{order.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'Paid' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status === 'Paid' && (
                    <CheckCircle size={12} className="inline mr-1" />
                  )}
                  {order.status}
                </span>
                <button
                  onClick={() => generateInvoice(order)}
                  className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                  title="Download Receipt">
                  <Download size={16} />
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                          <ShoppingCart size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{item.name}</p>
                      <p className="text-sm text-slate-500">
                        Qty: {item.quantity} × {formatPrice(item.price)}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-slate-500">
                  <p>Payment: {order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}</p>
                  {order.customer && (
                    <p className="mt-1">
                      Ship to: {order.customer.county}, {order.customer.town}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total Amount</p>
                  <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
