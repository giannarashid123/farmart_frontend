import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, UploadCloud, CheckCircle, 
  ArrowLeft, X, FileText, AlertCircle, Loader2, User
} from 'lucide-react';
import api from '../api/axios';
import { toast } from 'react-hot-toast';

const FarmerRaiseDispute = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // State
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  // Form state
  const [buyerName, setBuyerName] = useState('');
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [resolution, setResolution] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [evidencePreview, setEvidencePreview] = useState(null);

  // Constants
  const DISPUTE_REASONS = [
    { value: 'payment_not_received', label: 'Payment Not Received' },
    { value: 'buyer_no_show', label: 'Buyer No-Show' },
    { value: 'damage_property', label: 'Damage to Property' },
    { value: 'harassment', label: 'Harassment/Abuse' },
    { value: 'contract_violation', label: 'Contract Violation' },
    { value: 'other', label: 'Other' }
  ];


  const RESOLUTION_OPTIONS = [
    { value: 'refund', label: 'Request Payment', description: 'Get the payment you are owed' },
    { value: 'ban', label: 'Ban Buyer', description: 'Prevent this buyer from ordering again' },
    { value: 'apology', label: 'Request Apology', description: 'Get a formal apology from the buyer' },
    { value: 'report', label: 'Just Report', description: 'File a report for record keeping' }
  ];

  // Fetch order details if orderId exists
  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId && orderId !== 'new') {
        try {
          setLoading(true);
          const res = await api.get('/orders/' + orderId);
          setOrderDetails(res.data);
          
          // If we have order details, try to get buyer info
          if (res.data.buyer_name) {
            setBuyerName(res.data.buyer_name);
          }
        } catch (err) {
          console.error('Failed to fetch order:', err);
          toast.error('Could not load order details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

     // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setEvidence(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setEvidencePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeEvidence = () => {
    setEvidence(null);
    setEvidencePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!buyerName.trim()) {
      toast.error('Please enter the buyer name');
      return;
    }

    if (!reason) {
      toast.error('Please select a reason for the dispute');
      return;
    }

    if (description.length < 20) {
      toast.error('Description must be at least 20 characters');
      return;
    }

