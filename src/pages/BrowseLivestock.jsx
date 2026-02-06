import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, MapPin, Filter, Star } from "lucide-react";

// Mock Data - Expanded Kenyan Livestock Listings
const MOCK_LIVESTOCK = [
  {
    id: 1,
    title: "Boran Bull - Premium",
    price: 185000,
    location: "Nakuru",
    type: "Cow",
    breed: "Boran",
    weight: "450kg",
    age: "3 years",
    image:
      "https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&q=80",
    farmer: { name: "John Kamau", avatar: "JK" },
    rating: 4.8,
    verified: true,
  },
  {
    id: 2,
    title: "Boer Goat - Doe",
    price: 28000,
    location: "Kiambu",
    type: "Goat",
    breed: "Boer",
    weight: "35kg",
    age: "1.5 years",
    image:
      "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80",
    farmer: { name: "Mary Wanjiku", avatar: "MW" },
    rating: 4.5,
    verified: true,
  },
  {
    id: 3,
    title: "Sahiwal Heifer",
    price: 165000,
    location: "Narok",
    type: "Cow",
    breed: "Sahiwal",
    weight: "380kg",
    age: "2.5 years",
    image:
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80",
    farmer: { name: "Samuel Ole", avatar: "SO" },
    rating: 4.9,
    verified: true,
  },
  {
    id: 4,
    title: "Dorper Ram",
    price: 32000,
    location: "Kajiado",
    type: "Sheep",
    breed: "Dorper",
    weight: "45kg",
    age: "1 year",
    image:
      "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80",
    farmer: { name: "Paul Mutua", avatar: "PM" },
    rating: 4.6,
    verified: true,
  },
  {
    id: 5,
    title: "Kienyenji Chicken - Layers",
    price: 3500,
    location: "Nairobi",
    type: "Chicken",
    breed: "Kienyenji",
    weight: "2kg",
    age: "8 months",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80",
    farmer: { name: "Grace Achieng", avatar: "GA" },
    rating: 4.3,
    verified: true,
  },
  {
    id: 6,
    title: "Large White Pig - Sow",
    price: 45000,
    location: "Eldoret",
    type: "Pig",
    breed: "Large White",
    weight: "120kg",
    age: "1.5 years",
    image:
      "https://images.unsplash.com/photo-1604842247038-08c761d7a4d2?auto=format&fit=crop&q=80",
    farmer: { name: "Robert Kiprop", avatar: "RK" },
    rating: 4.7,
    verified: true,
  },
  {
    id: 7,
    title: "Ankole Bull - Breeding",
    price: 220000,
    location: "Kisumu",
    type: "Cow",
    breed: "Ankole",
    weight: "520kg",
    age: "4 years",
    image:
      "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&q=80",
    farmer: { name: "Daniel Ochieng", avatar: "DO" },
    rating: 4.9,
    verified: true,
  },
  {
    id: 8,
    title: "Galla Goat - Buck",
    price: 25000,
    location: "Marsabit",
    type: "Goat",
    breed: "Galla",
    weight: "40kg",
    age: "2 years",
    image:
      "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80",
    farmer: { name: "Hassan Adan", avatar: "HA" },
    rating: 4.4,
    verified: true,
  },
  {
    id: 9,
    title: "Red Maasai Sheep - Ewe",
    price: 28000,
    location: "Kajiado",
    type: "Sheep",
    breed: "Red Maasai",
    weight: "38kg",
    age: "1.5 years",
    image:
      "https://images.unsplash.com/photo-1484557985045-edf25e08da73?auto=format&fit=crop&q=80",
    farmer: { name: "Peter Leriano", avatar: "PL" },
    rating: 4.5,
    verified: true,
  },
  // Additional livestock
  {
    id: 10,
    title: "Friesian Cow - Dairy",
    price: 200000,
    location: "Nyeri",
    type: "Cow",
    breed: "Friesian",
    weight: "480kg",
    age: "3 years",
    image:
      "https://images.unsplash.com/photo-1604079625626-6d8b2f0c8e55?auto=format&fit=crop&q=80",
    farmer: { name: "Alice Njeri", avatar: "AN" },
    rating: 4.6,
    verified: true,
  },
  {
    id: 11,
    title: "Kiko Goat - Buck",
    price: 30000,
    location: "Machakos",
    type: "Goat",
    breed: "Kiko",
    weight: "42kg",
    age: "2 years",
    image:
      "https://images.unsplash.com/photo-1605613473116-fcc6882ab1f0?auto=format&fit=crop&q=80",
    farmer: { name: "Brian Mwangi", avatar: "BM" },
    rating: 4.5,
    verified: true,
  },
  {
    id: 12,
    title: "Merino Sheep - Ram",
    price: 35000,
    location: "Laikipia",
    type: "Sheep",
    breed: "Merino",
    weight: "50kg",
    age: "2 years",
    image:
      "https://images.unsplash.com/photo-1588731240401-040a69a1f9ec?auto=format&fit=crop&q=80",
    farmer: { name: "Esther Chebet", avatar: "EC" },
    rating: 4.7,
    verified: true,
  },
  {
    id: 13,
    title: "Rhode Island Chicken - Layers",
    price: 4000,
    location: "Thika",
    type: "Chicken",
    breed: "Rhode Island",
    weight: "2.2kg",
    age: "9 months",
    image:
      "https://images.unsplash.com/photo-1602182141680-466c887e3053?auto=format&fit=crop&q=80",
    farmer: { name: "Faith Wanjiru", avatar: "FW" },
    rating: 4.2,
    verified: true,
  },
  {
    id: 14,
    title: "Berkshire Pig - Boar",
    price: 55000,
    location: "Kitale",
    type: "Pig",
    breed: "Berkshire",
    weight: "125kg",
    age: "2 years",
    image:
      "https://images.unsplash.com/photo-1602656511796-9a0a9e3b8a4f?auto=format&fit=crop&q=80",
    farmer: { name: "James Kimani", avatar: "JK" },
    rating: 4.8,
    verified: true,
  },
  {
    id: 15,
    title: "Nguni Cow - Beef",
    price: 180000,
    location: "Kisii",
    type: "Cow",
    breed: "Nguni",
    weight: "460kg",
    age: "3 years",
    image:
      "https://images.unsplash.com/photo-1610001962783-2ccf7d63c5a1?auto=format&fit=crop&q=80",
    farmer: { name: "Mercy Akinyi", avatar: "MA" },
    rating: 4.6,
    verified: true,
  },
];

const ANIMAL_TYPES = ["Cow", "Goat", "Sheep", "Chicken", "Pig"];
const LOCATIONS = [
  "Nakuru",
  "Kiambu",
  "Narok",
  "Kajiado",
  "Nairobi",
  "Eldoret",
  "Kisumu",
  "Marsabit",
  "Nyeri",
  "Machakos",
  "Laikipia",
  "Thika",
  "Kitale",
  "Kisii",
];

function BrowseLivestock() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [healthVerifiedOnly, setHealthVerifiedOnly] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleTypeToggle = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleLocationToggle = (location) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((l) => l !== location)
        : [...prev, location],
    );
  };

  const filteredLivestock = MOCK_LIVESTOCK.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.breed.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(item.type);
    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.includes(item.location);
    const matchesMinPrice =
      !priceRange.min || item.price >= parseInt(priceRange.min);
    const matchesMaxPrice =
      !priceRange.max || item.price <= parseInt(priceRange.max);
    const matchesVerified = !healthVerifiedOnly || item.verified;
    return (
      matchesSearch &&
      matchesType &&
      matchesLocation &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesVerified
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
            Browse Livestock
          </h1>
          <div className="flex-1 max-w-xl relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search livestock..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-100 rounded-xl font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl font-medium text-slate-700"
          >
            <Filter size={20} /> Filters
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar & Filters omitted for brevity; keep the previous one you had */}

        {/* Main Grid */}
        <main className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-900">
                {filteredLivestock.length}
              </span>{" "}
              livestock
            </p>
          </div>

          {filteredLivestock.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                No livestock found
              </h3>
              <p className="text-slate-500">
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLivestock.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-slate-400 hover:text-red-500 transition-colors">
                      <Heart size={18} />
                    </button>
                    {item.verified && (
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-green-600 text-white text-[10px] font-black uppercase tracking-wider rounded-lg">
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 leading-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xl font-black text-orange-500 mb-2">
                      KES {item.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400 mb-3">
                      {item.breed} • {item.weight} • {item.age}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-[10px] font-bold text-green-700">
                        {item.farmer.avatar}
                      </div>
                      <span className="text-xs font-medium text-slate-600">
                        {item.farmer.name}
                      </span>
                      <div className="flex items-center gap-1 ml-auto text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-bold">{item.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-400 mb-4">
                      <MapPin size={12} />
                      <span>{item.location}</span>
                    </div>

                    <Link
                      to={`/livestock/${item.id}`}
                      className="block w-full py-3 text-center bg-gradient-to-r from-orange-400 to-yellow-400 text-white font-black uppercase text-xs tracking-wider rounded-xl hover:from-orange-500 hover:to-yellow-500 transition-all active:scale-95"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer remains unchanged */}
    </div>
  );
}

export default BrowseLivestock;
