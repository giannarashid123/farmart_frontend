import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, MessageCircle, ShoppingCart, MapPin, ChevronRight,
  Shield, Calendar, Weight, Scale, Award, CheckCircle
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../redux/wishlistSlice';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import api from '../api/axios';

function LivestockDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const wishlistItems = useSelector(state => state.wishlist.items);

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/livestock/${id}`);
        setAnimal(response.data);
      } catch (error) {
        console.error('Failed to fetch animal:', error);
        setError('Failed to load animal details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);

  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (animal) {
      setIsWishlisted(
        wishlistItems.some(
          item => String(item.animal?.id) === String(animal.id)
        )
      );
    }
  }, [animal, wishlistItems]);

  const handleToggleWishlist = () => {
    if (!currentUser) {
      toast.error('Please login to save items');
      navigate('/auth');
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(animal.id));
      toast.success('Removed from wishlist');
    } else {
      dispatch(addToWishlist(animal.id));
      toast.success('Added to wishlist!');
    }

    setIsWishlisted(!isWishlisted);
  };

  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      maximumFractionDigits: 0,
    }).format(price || 0);
  };

  const handleAddToCart = () => {
    if (!currentUser) {
      toast.error('Please login to add items to cart');
      navigate('/auth');
      return;
    }

    dispatch(addToCart({
      id: animal.id,
      name: `${animal.species} - ${animal.breed}`,
      price: animal.price,
      image: animal.image_url || animal.image
    }));

    toast.success('Added to cart!');
  };

  const [activeTab, setActiveTab] = useState('description');

  const handleMessageFarmer = () => {
    if (!currentUser) {
      toast.error('Please login to message the farmer');
      navigate('/auth');
      return;
    }

    toast.success('Opening chat with farmer...');
  };

  {/* Tabs */}
  <div className="bg-white rounded-2xl shadow-sm mt-6 overflow-hidden">
   <div className="flex border-b border-gray-100">
      {['description', 'health', 'seller'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-4 text-sm font-semibold capitalize ${
          activeTab === tab
            ? 'text-green-600 border-b-2 border-green-600'
            : 'text-slate-500'
        }`}
      >
        {tab === 'health' ? 'Health Records' : tab === 'seller' ? 'Seller Info' : 'Description'}
      </button>
    ))}
  </div>

  {activeTab === 'description' && (
  <p>{animal?.description || 'No description available for this animal.'}</p>
)}

  {activeTab === 'health' && (
  <p>No health records available</p>
)}

  {activeTab === 'seller' && (
  <button onClick={handleMessageFarmer}>Contact</button>
)}