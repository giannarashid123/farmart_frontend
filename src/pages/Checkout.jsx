import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useParams } from "react-router-dom";
import { clearCart } from "../redux/cartSlice";
import toast from "react-hot-toast";
import api from "../api/axios";
import {
  ShoppingCart,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  ArrowLeft,
  Check,
  Loader2,
  Smartphone,
} from "lucide-react";

const KENYAN_COUNTIES = [
  "Mombasa",
  "Kwale",
  "Kilifi",
  "Tana River",
  "Lamu",
  "Taita/Taveta",
  "Garissa",
  "Wajir",
  "Mandera",
  "Marsabit",
  "Isiolo",
  "Meru",
  "Tharaka-Nithi",
  "Embu",
  "Kitui",
  "Machakos",
  "Makueni",
  "Nyandarua",
  "Nyeri",
  "Kirinyaga",
  "Murang'a",
  "Kiambu",
  "Turkana",
  "West Pokot",
  "Samburu",
  "Trans Nzoia",
  "Uasin Gishu",
  "Elgeyo/Marakwet",
  "Nandi",
  "Baringo",
  "Laikipia",
  "Nakuru",
  "Narok",
  "Kajiado",
  "Kericho",
  "Bomet",
  "Kakamega",
  "Vihiga",
  "Bungoma",
  "Busia",
  "Siaya",
  "Kisumu",
  "Homa Bay",
  "Migori",
  "Kisii",
  "Nyamira",
  "Nairobi City",
];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);

  const [bargainOrder, setBargainOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isWaitingForMpesa, setIsWaitingForMpesa] = useState(false);

  const items = bargainOrder?.items || cartItems;
  const total = bargainOrder?.total_amount || totalAmount;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    county: "",
    town: "",
    instructions: "",
    paymentMethod: "mpesa",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (orderId) fetchBargainOrder();
  }, [orderId]);

  const fetchBargainOrder = async () => {
    setLoadingOrder(true);
    try {
      const response = await api.get(`/orders/${orderId}`);
      if (
        response.data.status === "paid" ||
        response.data.status === "completed"
      ) {
        toast.error("This order has already been paid!");
        navigate("/dashboard/orders");
        return;
      }
      setBargainOrder(response.data);
    } catch (error) {
      toast.error("Failed to load order details");
    } finally {
      setLoadingOrder(false);
    }
  };

  const formatPrice = (price) => `KSh ${price.toLocaleString()}`;
  const shippingCost = total > 50000 ? 0 : 1500;
  const grandTotal = total + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";

    const phone = formData.phone.trim();
    const phoneRegex = /^(?:254|\+254|0)?(7|1)\d{8}$/;
    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Enter a valid Safaricom/Airtel number";
    }

    if (!formData.county) newErrors.county = "County is required";
    if (!formData.town.trim()) newErrors.town = "Town is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * M-PESA POLLING LOGIC
   * Pings the backend to check if the user has completed the STK push
   */
  const pollPaymentStatus = async (id, toastId) => {
    let attempts = 0;
    const maxAttempts = 12; // 60 seconds (12 * 5s)

    const interval = setInterval(async () => {
      try {
        attempts++;
        const response = await api.get(`/orders/${id}/status`);
        const status = response.data.status;

        if (status === "paid" || status === "completed") {
          clearInterval(interval);
          toast.success("Payment confirmed! Thank you.", { id: toastId });
          if (!bargainOrder) dispatch(clearCart());
          navigate(`/order-confirmation/${id}`);
        } else if (status === "failed" || attempts >= maxAttempts) {
          clearInterval(interval);
          setIsWaitingForMpesa(false);
          setSubmitting(false);
          toast.error(
            status === "failed" ? "Transaction failed." : "STK Push timed out.",
            { id: toastId },
          );
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000);
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setSubmitting(true);
    const loadingToastId = toast.loading("Processing order...");

    try {
      const orderPayload = {
        items: items.map((item) => ({
          animal_id: item.id,
          quantity: item.quantity || 1,
          price: item.price,
        })),
        total_amount: grandTotal,
        payment_method: formData.paymentMethod,
        phone_number: formData.phone,
        shipping_address: `${formData.town}, ${formData.county}. ${formData.instructions}`,
      };

      let currentOrderId;

      if (bargainOrder) {
        await api.put(`/orders/${bargainOrder.id}`, {
          ...orderPayload,
          status: "pending",
        });
        currentOrderId = bargainOrder.id;
      } else {
        const response = await api.post("/orders/", orderPayload);
        currentOrderId = response.data.order.id;
      }

      if (formData.paymentMethod === "mpesa") {
        setIsWaitingForMpesa(true);
        toast.loading("Please enter your M-Pesa PIN on your phone...", {
          id: loadingToastId,
        });
        pollPaymentStatus(currentOrderId, loadingToastId);
      } else {
        toast.success("Order placed! Pay on delivery.", { id: loadingToastId });
        if (!bargainOrder) dispatch(clearCart());
        navigate(`/order-confirmation/${currentOrderId}`);
      }
    } catch (error) {
      setSubmitting(false);
      toast.error(error.response?.data?.message || "Order failed", {
        id: loadingToastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* M-PESA WAITING OVERLAY */}
      {isWaitingForMpesa && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-green-600 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Waiting for M-Pesa
            </h3>
            <p className="text-slate-600 mb-6">
              Please check your phone and enter your PIN to complete the payment
              of <strong>{formatPrice(grandTotal)}</strong>
            </p>
            <div className="flex items-center justify-center gap-2 text-green-600 font-medium">
              <Loader2 className="animate-spin" size={20} />
              <span>Verifying transaction...</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to={bargainOrder ? "/dashboard/orders" : "/cart"}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft size={20} />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">
            {bargainOrder ? "Complete Payment" : "Checkout"}
          </h1>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handlePlaceOrder();
          }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone size={20} className="text-green-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Contact Information
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number (For M-Pesa STK) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 ${errors.phone ? "border-red-500 bg-red-50" : "border-slate-300"}`}
                      placeholder="0712345678"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1 font-medium">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg ${errors.fullName ? "border-red-500" : "border-slate-300"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg ${errors.email ? "border-red-500" : "border-slate-300"}`}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={20} className="text-green-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Delivery Details
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      County *
                    </label>
                    <select
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg ${errors.county ? "border-red-500" : "border-slate-300"}`}>
                      <option value="">Select County</option>
                      {KENYAN_COUNTIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Town/Location *
                    </label>
                    <input
                      type="text"
                      name="town"
                      value={formData.town}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 border rounded-lg ${errors.town ? "border-red-500" : "border-slate-300"}`}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard size={20} className="text-green-600" />
                  <h2 className="text-lg font-bold text-slate-900">
                    Payment Method
                  </h2>
                </div>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === "mpesa" ? "border-green-600 bg-green-50" : "border-slate-200"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={formData.paymentMethod === "mpesa"}
                      onChange={handleChange}
                      className="text-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">
                        M-Pesa STK Push
                      </p>
                      <p className="text-sm text-slate-500">
                        We will send a payment request to your phone
                      </p>
                    </div>
                  </label>
                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer ${formData.paymentMethod === "cod" ? "border-green-600 bg-green-50" : "border-slate-200"}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                      className="text-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">
                        Cash on Delivery
                      </p>
                      <p className="text-sm text-slate-500">
                        Pay when your livestock arrives
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  Order Summary
                </h2>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Shipping</span>
                    <span>
                      {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-xl font-black text-slate-900">
                    <span>Total</span>
                    <span>{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 py-4 bg-green-600 text-white font-black uppercase tracking-widest rounded-xl hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {submitting ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Check />
                  )}
                  {formData.paymentMethod === "mpesa"
                    ? "Pay with M-Pesa"
                    : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
