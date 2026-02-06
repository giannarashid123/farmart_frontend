import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Package,
  Heart,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

// Mock User Data
const USER_DATA = {
  fullName: 'Jeff Ouda',
  role: 'Buyer',
  phone: '+254 712 345 678',
  location: 'Kiambu County',
  email: 'jeff@example.com',
};

const STATS = {
  activeOrders: 2,
  wishlistItems: 4,
  totalSpent: 145000,
};

function BuyerOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              Welcome back, {USER_DATA.fullName.split(' ')[0]}!
            </h1>
            <p className="text-slate-500 mt-1">Ready to find your next livestock?</p>
          </div>
          <Link
            to="/browse"
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-black uppercase text-xs tracking-wider rounded-xl hover:bg-green-500 transition-all active:scale-95">
            <ShoppingBag size={18} />
            Browse Marketplace
          </Link>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-900 uppercase italic tracking-tight mb-6">
          Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Full Name</p>
              <p className="font-bold text-slate-900">{USER_DATA.fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p>
              <p className="font-bold text-slate-900">{USER_DATA.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
              <p className="font-bold text-slate-900">{USER_DATA.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
              <p className="font-bold text-slate-900">{USER_DATA.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{STATS.activeOrders}</p>
          <p className="text-sm text-slate-500 uppercase tracking-wider">Active Orders</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart size={24} className="text-pink-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">{STATS.wishlistItems}</p>
          <p className="text-sm text-slate-500 uppercase tracking-wider">Wishlist Items</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ShoppingBag size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">KSh {STATS.totalSpent.toLocaleString()}</p>
          <p className="text-sm text-slate-500 uppercase tracking-wider">Total Spent</p>
        </div>
      </div>
    </div>
  );
}

export default BuyerOverview;
