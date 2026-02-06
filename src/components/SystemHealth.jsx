import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

function SystemHealth() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      setHealth(data);
    } catch (err) {
      setError(err.message);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
        <RefreshCw className="w-4 h-4 animate-spin text-gray-500" />
        <span className="text-sm text-gray-500">Checking system health...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <span className="font-bold text-red-800">System Offline</span>
        </div>
        <p className="text-sm text-red-600">Cannot connect to backend: {error}</p>
        <button
          onClick={checkHealth}
          className="mt-2 text-xs text-red-700 underline hover:text-red-900">
          Try Again
        </button>
      </div>
    );
  }

  if (health?.status === 'online') {
    return (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="font-bold text-green-800">System Online</span>
        </div>
        <div className="text-sm text-green-700 space-y-1">
          <p>✅ Database: Connected</p>
          <p>🕐 Backend Time: {new Date(health.backend_time).toLocaleTimeString()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <XCircle className="w-5 h-5 text-yellow-600" />
        <span className="font-bold text-yellow-800">System Error</span>
      </div>
      <p className="text-sm text-yellow-700">{health?.database || 'Unknown error'}</p>
    </div>
  );
}

export default SystemHealth;
