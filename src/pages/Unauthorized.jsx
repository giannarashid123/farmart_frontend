import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, ArrowLeft, Home } from 'lucide-react';

function Unauthorized() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-red-600" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-slate-500 mb-8">
          You do not have permission to view this page. Please contact your administrator if you believe this is an error.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-green-700 transition-colors">
            <Home size={18} />
            Go Home
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 font-bold uppercase text-xs tracking-wider rounded-xl hover:bg-slate-200 transition-colors">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Unauthorized;
