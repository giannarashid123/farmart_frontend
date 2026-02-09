import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Star,
  TrendingDown,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AnalyticCard = ({
  title,
  value,
  change,
  changeType,
  color,
  icon: Icon,
}) => (
  <div className="bg-white p-6 rounded-xl border border-slate-50 shadow-sm flex-1">
    <div
      className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white mb-4 shadow-md`}>
      <Icon size={20} />
    </div>
    <p className="text-slate-500 text-sm font-bold">{title}</p>
    <h3 className="text-2xl font-black text-slate-900 mt-1">{value}</h3>
    <p
      className={`text-xs mt-1 font-bold ${changeType === "positive" ? "text-green-500" : "text-red-500"}`}>
      {changeType === "positive" ? "+" : ""}
      {change}%
    </p>
  </div>
);

const RevenueChart = ({ monthlyData }) => {
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue), 1);

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-50 h-[400px]">
      <h2 className="text-lg font-black text-slate-900 mb-6">
        Monthly Revenue & Orders
      </h2>

      {monthlyData && monthlyData.length > 0 ? (
        <div className="h-full flex items-end gap-4">
          {monthlyData.map((month, index) => {
            const height = (month.revenue / maxRevenue) * 200;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-blue-600 rounded-t-lg transition-all duration-300 hover:bg-blue-700 relative group"
                    style={{ height: `${height + 20}px`, minHeight: "20px" }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      KES {month.revenue.toLocaleString()}
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-b-lg h-8 flex items-center justify-center">
                    <span className="text-xs font-bold text-slate-500">
                      {month.month}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
          <p className="text-slate-300 font-bold">
            No revenue data available yet
          </p>
        </div>
      )}
    </div>
  );
};

const FarmerAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/analytics/farmer");
        setStats(response.data.stats);
        setMonthlyRevenue(response.data.monthly_revenue || []);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        // Set default values on error
        setStats({
          total_revenue: 0,
          total_orders: 0,
          avg_order_value: 0,
          avg_rating: 0,
          review_count: 0,
          active_listings: 0,
        });
        setMonthlyRevenue([]);
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Format currency
  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `KES ${(value / 1000000).toFixed(2)} M`;
    } else if (value >= 1000) {
      return `KES ${(value / 1000).toFixed(1)} K`;
    }
    return `KES ${value}`;
  };

  return (
    <div>
      <h1 className="text-2xl font-black text-slate-900">Analytics</h1>
      <p className="text-slate-400 text-sm mb-8 font-medium">
        Track your sales performance and trends
      </p>

      {loading ? (
        <div className="flex gap-6 mb-10">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-slate-50 shadow-sm flex-1 animate-pulse">
              <div className={`w-10 h-10 bg-slate-200 rounded-lg mb-4`}></div>
              <div className="h-3 bg-slate-200 rounded w-24 mb-2"></div>
              <div className="h-6 bg-slate-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-6 mb-10">
          <AnalyticCard
            title="Total Revenue"
            value={formatCurrency(stats?.total_revenue || 0)}
            change={18.2}
            changeType="positive"
            color="bg-blue-600"
            icon={DollarSign}
          />
          <AnalyticCard
            title="Total Orders"
            value={stats?.total_orders || 0}
            change={12.5}
            changeType="positive"
            color="bg-amber-500"
            icon={ShoppingCart}
          />
          <AnalyticCard
            title="Avg Order Value"
            value={formatCurrency(stats?.avg_order_value || 0)}
            change={8.3}
            changeType="positive"
            color="bg-green-500"
            icon={TrendingUp}
          />
          <AnalyticCard
            title="Customer Rating"
            value={`${stats?.avg_rating || 0}/5`}
            change={5.1}
            changeType="positive"
            color="bg-purple-600"
            icon={Star}
          />
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-50 h-[400px] animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-48 mb-6"></div>
          <div className="h-full bg-slate-100 rounded-xl"></div>
        </div>
      ) : (
        <RevenueChart monthlyData={monthlyRevenue} />
      )}

      {/* Additional Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-slate-50 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">Performance Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Active Listings</span>
              <span className="font-bold text-slate-900">
                {stats?.active_listings || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Reviews Received</span>
              <span className="font-bold text-slate-900">
                {stats?.review_count || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Avg Rating</span>
              <span className="font-bold text-green-600">
                {stats?.avg_rating || 0} ⭐
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-50 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">
            Top Selling Categories
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Cattle</span>
              <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: "70%" }}></div>
              </div>
              <span className="font-bold text-slate-900">70%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Goats</span>
              <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: "20%" }}></div>
              </div>
              <span className="font-bold text-slate-900">20%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Sheep</span>
              <div className="flex-1 mx-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: "10%" }}></div>
              </div>
              <span className="font-bold text-slate-900">10%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-50 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4">Growth Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-slate-500 text-sm">Revenue Growth</span>
              <span className="ml-auto font-bold text-green-600">+18.2%</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              <span className="text-slate-500 text-sm">Order Growth</span>
              <span className="ml-auto font-bold text-green-600">+12.5%</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500" />
              <span className="text-slate-500 text-sm">Rating Trend</span>
              <span className="ml-auto font-bold text-green-600">+5.1%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerAnalytics;
