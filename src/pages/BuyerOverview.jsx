import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  User,
  Package,
  Heart,
  ShoppingBag,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';

function BuyerOverview() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    total_orders: 0,
    total_spent: 0,
    wishlist_count: 0,
    loading: true,
  });
  
  // Debug: Log user data to see what backend is sending
  console.log('Current User Data:', currentUser);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch order stats
        const ordersRes = await api.get('/orders/stats');
        const orderStats = ordersRes.data || { total_orders: 0, total_spent: 0 };
        
        // Fetch wishlist count
        const wishlistRes = await api.get('/wishlist/count');
        const wishlistCount = wishlistRes.data?.count || 0;
        
        setStats({
          total_orders: orderStats.total_orders || 0,
          total_spent: orderStats.total_spent || 0,
          wishlist_count: wishlistCount,
          loading: false,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    
    if (currentUser) {
      fetchStats();
    }
  }, [currentUser]);
  
  // Clear stats on logout (handled by unmount)
  useEffect(() => {
    return () => {
      setStats({ total_orders: 0, total_spent: 0, wishlist_count: 0, loading: true });
    };
  }, []);
  
  // Get user name for welcome message
  const getUserFirstName = () => {
    const displayName = currentUser?.full_name || currentUser?.name || currentUser?.email?.split('@')[0] || 'Buyer';
    return displayName.split(' ')[0];
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              Welcome back, {getUserFirstName()}!
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
              <p className="font-bold text-slate-900">{currentUser?.full_name || currentUser?.name || 'User'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Phone size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p>
              <p className="font-bold text-slate-900">{currentUser?.phone_number || currentUser?.phone || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MapPin size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Location</p>
              <p className="font-bold text-slate-900">{currentUser?.location || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
              <p className="font-bold text-slate-900">{currentUser?.email || 'Not provided'}</p>
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
          <p className="text-3xl font-black text-slate-900">
            {stats.loading ? '-' : stats.total_orders}
          </p>
          <p className="text-sm text-slate-500 uppercase tracking-wider">Total Orders</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
              <Heart size={24} className="text-pink-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {stats.loading ? '-' : stats.wishlist_count}
          </p>
          <p className="text-sm text-slate-500 uppercase tracking-wider">Wishlist Items</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <ShoppingBag size={24} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900">
            {stats.loading ? '-' : `KSh ${stats.total_spent.toLocaleString()}`}
          </p>
          <p className="text-sm text-slate-500 uppercase tracking-wider">Total Spent</p>
        </div>
      </div>
    </div>
  );
}

export default BuyerOverview;
