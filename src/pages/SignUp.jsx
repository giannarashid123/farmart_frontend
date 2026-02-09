import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Tractor,
  User,
  Phone,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sprout,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const KENYAN_COUNTIES = [
  "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita/Taveta",
  "Garissa", "Wajir", "Mandera", "Marsabit", "Isiolo", "Meru",
  "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
  "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot",
  "Samburu", "Trans Nzoia", "Uasin Gishu", "Elgeyo/Marakwet", "Nandi",
  "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado", "Kericho",
  "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya",
  "Kisumu", "Homa Bay", "Migori", "Kisii", "Nyamira", "Nairobi City"
];

const SignUp = () => {
  const { register, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mode state: true = Login, false = Sign Up
  const [isLogin, setIsLogin] = useState(false);
  
  // Role state: 'buyer' or 'farmer'
  const [userRole, setUserRole] = useState('buyer');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form data for both login and signup
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    location: '',
    farm_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Pre-select role from navigation state
  useEffect(() => {
    if (location.state?.role) {
      setUserRole(location.state.role);
    }
    if (location.state?.mode === 'login') {
      setIsLogin(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const loggedInUser = await login({ 
        email: formData.email, 
        password: formData.password 
      });
      
      if (loggedInUser) {
        const userRoleStr = loggedInUser.user?.role || loggedInUser.role || '';
        const cleanRole = userRoleStr.toLowerCase();
        
        if (cleanRole === 'admin') {
          navigate('/admin', { replace: true });
        } else if (cleanRole === 'farmer') {
          navigate('/farmer-dashboard', { replace: true });
        } else {
          navigate('/marketplace', { replace: true });
        }
      } else {
        setMessage({
          type: 'error',
          text: 'Invalid email or password'
        });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Connection failed. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validate phone number
    const phone = formData.phone_number.trim();
    const startsWith07 = /^07\d{8}$/.test(phone);
    const startsWith01 = /^01\d{8}$/.test(phone);
    const startsWith254 = /^\+254\d{9}$/.test(phone);

    if (!startsWith07 && !startsWith01 && !startsWith254) {
      setMessage({
        type: 'error',
        text: 'Invalid phone number. Must start with 07/01 (10 digits) or +254 (13 digits).'
      });
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        full_name: formData.full_name,
        phone_number: formData.phone_number,
        location: formData.location,
        email: formData.email,
        password: formData.password,
        role: userRole,
      };
      
      // Farmers require farm_name
      if (userRole === 'farmer') {
        if (!formData.farm_name.trim()) {
          setMessage({ type: 'error', text: 'Farm name is required for farmers' });
          setIsLoading(false);
          return;
        }
        payload.farm_name = formData.farm_name;
      }
      
      const result = await register(payload);

      if (result.success) {
        // Auto-login after registration
        const loggedInUser = await login({ email: formData.email, password: formData.password });
        
        if (loggedInUser) {
          const userRoleStr = loggedInUser.user?.role || loggedInUser.role || '';
          const cleanRole = userRoleStr.toLowerCase();
          
          if (cleanRole === 'admin') {
            navigate('/admin', { replace: true });
          } else if (cleanRole === 'farmer') {
            navigate('/farmer-dashboard', { replace: true });
          } else {
            navigate('/marketplace', { replace: true });
          }
        }
      } else {
        setMessage({
          type: 'error',
          text: result.error || 'Registration failed. Please try again.'
        });
      }
    } catch (err) {
      // Handle 409 Conflict (email already registered)
      if (err.response?.status === 409) {
        setMessage({
          type: 'error',
          text: 'This email is already registered. Please login instead.'
        });
      } else {
        setMessage({
          type: 'error',
          text: err.response?.data?.message || 'Connection failed. Please try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic classes based on role
  const isFarmer = userRole === 'farmer';
  const bgGradient = isFarmer ? 'from-green-700 to-green-900' : 'from-blue-600 to-blue-800';
  const primaryColor = isFarmer ? 'green' : 'blue';
  const primaryBg = isFarmer ? 'bg-green-600' : 'bg-blue-600';
  const primaryHover = isFarmer ? 'hover:bg-green-700' : 'hover:bg-blue-700';
  const primaryLightBg = isFarmer ? 'bg-green-50' : 'bg-blue-50';
  const primaryText = isFarmer ? 'text-green-700' : 'text-blue-700';
  const primaryBorder = isFarmer ? 'border-green-500' : 'border-blue-500';
  const primaryIcon = isFarmer ? 'text-green-600' : 'text-blue-600';

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dynamic Branding */}
      <div className={`hidden lg:flex lg:w-1/2 ${bgGradient} p-12 flex-col justify-between relative overflow-hidden`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="farm-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="white"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#farm-pattern)" />
          </svg>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white">Farmart</h1>
          <p className="text-white/80 mt-2 text-lg">Connecting Farmers, Growing Business</p>
        </div>
        
        <div className="relative z-10">
          {isLogin ? (
            <>
              <h2 className="text-3xl font-semibold text-white mb-4">Welcome Back!</h2>
              <p className="text-white/80 text-lg mb-6">
                Manage your livestock, track orders, and grow your agricultural business.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-semibold text-white mb-4">Join Our Community</h2>
              <p className="text-white/80 text-lg mb-6">
                {isFarmer
                  ? "List your livestock and connect with buyers across Kenya. Grow your farming business."
                  : "Find quality livestock directly from farmers. Get the best deals on cattle, goats, and more."}
              </p>
            </>
          )}
          
          {/* Role-based icon */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              {isLogin ? (
                <User className="w-8 h-8 text-white" />
              ) : isFarmer ? (
                <Tractor className="w-8 h-8 text-white" />
              ) : (
                <ShoppingBag className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <p className="text-white font-medium">
                {isLogin ? 'Welcome Back' : (isFarmer ? 'Selling Mode' : 'Buying Mode')}
              </p>
              <p className="text-white/60 text-sm">
                {isLogin ? 'Sign in to continue' : (isFarmer ? 'Farmers marketplace' : 'Buyer dashboard')}
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full" />
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Farmart</h1>
            <p className="text-slate-600 mt-2">{isLogin ? 'Welcome back!' : 'Create your account'}</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-slate-600 mt-1">
                {isLogin ? 'Enter your credentials to access your account' : 'Join Farmart today'}
              </p>
            </div>

            {/* Toast Notifications */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-800'
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}

            {/* Mode Toggle (Login/Sign Up) */}
            <div className="mb-6">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    isLogin
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    !isLogin
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Role Selection (Only for Sign Up) */}
            {!isLogin && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  I want to join as a...
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setUserRole('farmer')}
                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      isFarmer
                        ? `${primaryBorder} ${primaryLightBg}`
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Tractor className={`w-6 h-6 ${isFarmer ? primaryIcon : 'text-slate-400'}`} />
                    <span className={`text-sm font-medium ${isFarmer ? primaryText : 'text-slate-600'}`}>
                      Farmer
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserRole('buyer')}
                    className={`flex-1 p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      !isFarmer
                        ? `${primaryBorder} ${primaryLightBg}`
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <ShoppingBag className={`w-6 h-6 ${!isFarmer ? primaryIcon : 'text-slate-400'}`} />
                    <span className={`text-sm font-medium ${!isFarmer ? primaryText : 'text-slate-600'}`}>
                      Buyer
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={isLogin ? handleLoginSubmit : handleSignupSubmit} className="space-y-4">
              {/* Full Name (Sign Up Only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="John Kamau"
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Phone (Sign Up Only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="07X XXX XXXX or +254 XXX XXX XXX"
                      required={!isLogin}
                      maxLength={13}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Location (Farmer Sign Up Only) */}
              {!isLogin && isFarmer && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    County/Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="location"
                      list="county-list"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Search or type your county"
                      required={!isLogin && isFarmer}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <datalist id="county-list">
                      {KENYAN_COUNTIES.map(county => (
                        <option key={county} value={county} />
                      ))}
                    </datalist>
                  </div>
                </div>
              )}

              {/* Farm Name (Farmer Sign Up Only) */}
              {!isLogin && isFarmer && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Farm Name
                  </label>
                  <div className="relative">
                    <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      name="farm_name"
                      value={formData.farm_name}
                      onChange={handleChange}
                      placeholder="Green Acres Farm"
                      required={!isLogin && isFarmer}
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={isLogin ? 'Enter your password' : 'Min. 6 characters'}
                    required
                    minLength={6}
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (Sign Up Only) */}
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required={!isLogin}
                      className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password (Login Only) */}
              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="text-sm text-green-600 hover:text-green-700 font-medium">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 ${primaryBg} ${primaryHover} disabled:opacity-50 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 mt-6`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Toggle Mode Link */}
            <p className="text-center text-slate-600 text-sm mt-6">
              {isLogin ? (
                <>
                  {"Don't have an account? "}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  {"Already have an account? "}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 text-xs mt-8">
            By {isLogin ? 'signing in' : 'creating an account'}, you agree to Farmart's{' '}
            <a href="#" className="text-green-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
