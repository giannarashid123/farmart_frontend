import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSellClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/auth", { state: { role: 'farmer' } });
    }
  };