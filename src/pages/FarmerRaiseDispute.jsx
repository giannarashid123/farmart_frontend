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