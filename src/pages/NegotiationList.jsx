import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  ArrowLeft,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
const NegotiationList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, accepted, rejected, completed
  
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/bargain/sessions');
      setSessions(response.data.sessions || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      toast.error('Failed to load negotiations');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (currentUser?.role === 'farmer') {
      navigate('/farmer-dashboard');
    } else {
      navigate('/dashboard');
    }
  };

    const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'counter': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'counter': return <AlertCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
 const getOtherPartyName = (session) => {
    if (currentUser?.role === 'buyer') {
      return session.animal?.farmer_name || 'Farmer';
    } else {
      return session.buyer?.full_name || 'Buyer';
    }
  };

const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    // Added pt-24 to fix Navbar overlap
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBack}
              className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-100 transition-colors text-gray-600 shadow-sm"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Negotiations</h1>
              <p className="text-gray-500 text-sm">Manage your active deals and offers</p>
            </div>
          </div>
        </div>

        {/* Stats Cards - Accurate Business Logic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Active Discussions (Purely chatting phase) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">Active Discussions</p>
            <p className="text-3xl font-bold text-blue-600 mt-1">
              {sessions.filter(n => n.status === 'pending' || n.status === 'counter').length}
            </p>
          </div>

          {/* Card 2: Pending Payment (Agreed but no order created yet) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">Pending Payment</p>
            <p className="text-3xl font-bold text-orange-500 mt-1">
              {sessions.filter(n => n.status === 'accepted' && !n.order_id).length}
            </p>
          </div>

          {/* Card 3: Deals Closed (Agreed AND order created) */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">Deals Closed</p>
            <p className="text-3xl font-bold text-green-600 mt-1">
              {sessions.filter(n => n.status === 'accepted' && n.order_id).length}
            </p>
          </div>
        </div>
          {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['all', 'pending', 'accepted', 'counter', 'completed'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
