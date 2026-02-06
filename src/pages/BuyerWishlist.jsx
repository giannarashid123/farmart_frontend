import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

// Mock Wishlist Data
const MOCK_WISHLIST = [
  {
    id: 1,
    name: 'Boran Bull',
    breed: 'Boran',
    age: '3 years',
    price: 85000,
    location: 'Nairobi County',
    image: '🐂',
  },
  {
    id: 2,
    name: 'East African Goat',
    breed: 'Galla Goat',
    age: '1 year',
    price: 12500,
    location: 'Kajiado County',
    image: '🐐',
  },
  {
    id: 3,
    name: 'Dorper Sheep',
    breed: 'Dorper',
    age: '6 months',
    price: 18000,
    location: 'Uasin Gishu',
    image: '🐑',
  },
];

function BuyerWishlist() {
  const [wishlist, setWishlist] = useState(MOCK_WISHLIST);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleRemove = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  const handleBuyNow = (item) => {
    alert(`Proceeding to buy: ${item.name}`);
  };

  // Empty State
  if (wishlist.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
            My Wishlist
          </h1>
          <p className="text-slate-500 mt-1">Items you've saved for later</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-pink-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Your wishlist is empty</h2>
          <p className="text-slate-500 mb-6">Save items you're interested in to see them here</p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
            <ShoppingBag size={20} />
            Browse Marketplace
          </Link>
        </div>

        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
            My Wishlist
          </h1>
          <p className="text-slate-500 mt-1">{wishlist.length} items saved</p>
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {/* Animal Image/Icon */}
            <div className="h-48 bg-gradient-to-br from-green-50 to-slate-100 flex items-center justify-center text-6xl">
              {item.image}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-500">{item.breed} • {item.age}</p>
                </div>
              </div>

              <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                <span className="text-green-600">📍</span> {item.location}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xl font-black text-green-600">
                  {formatCurrency(item.price)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove from wishlist">
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => handleBuyNow(item)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors">
                    <ShoppingBag size={16} />
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Back Link */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-600 transition-colors">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
}

export default BuyerWishlist;
