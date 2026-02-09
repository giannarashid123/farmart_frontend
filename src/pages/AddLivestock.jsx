import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  X,
  Image as ImageIcon,
  DollarSign,
  Scale,
  Calendar,
  Tag,
  FileText,
  CheckCircle,
} from "lucide-react";
import api from "../api/axios";
import toast from "react-hot-toast";

const AddLivestock = () => {
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    species: "",
    breed: "",
    age: "",
    ageUnit: "years",
    weight: "",
    price: "",
    description: "",
    gender: "male",
    health_history: "",
  });

    const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories] = useState(["Cow", "Goat", "Sheep", "Chicken", "Pig"]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }


 // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Remove image
  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.species || !formData.breed || !formData.price || !imageFile) {
      toast.error("Please fill in all required fields and upload an image");
      return;
    }

    setLoading(true);

    try {
      // Create FormData for multipart/form-data
      const data = new FormData();
      data.append("species", formData.species);
      data.append("breed", formData.breed);
      data.append("age", formData.age);
      data.append("ageUnit", formData.ageUnit);
      data.append("weight", formData.weight);
      data.append("price", formData.price);
      data.append("description", formData.description);
      data.append("gender", formData.gender);
      data.append("health_history", formData.health_history);
      data.append("image", imageFile);

      // Actual API call
      const response = await api.post("/livestock/create", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Livestock listed successfully!");
      navigate("/farmer-dashboard/inventory");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Failed to upload livestock");
    } finally {
      setLoading(false);
    }
  };
