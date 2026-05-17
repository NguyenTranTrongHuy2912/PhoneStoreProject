import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowRight, Loader } from 'lucide-react';
import { useNotificationStore } from '@/store/notificationStore';
import { authService } from '@/services/authService';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationStore();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      addNotification({ type: 'error', message: 'Vui lòng nhập email' });
      return;
    }

    try {
      setLoading(true);
      const res = await authService.forgotPassword(email);
      addNotification({ type: 'success', message: res.message });
      setStep(2);
    } catch (error) {
      addNotification({ 
        type: 'error', 
        message: error.response?.data?.message || 'Có lỗi xảy ra khi gửi email' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      addNotification({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      addNotification({ type: 'error', message: 'Mật khẩu xác nhận không khớp' });
      return;
    }

    if (newPassword.length < 6) {
      addNotification({ type: 'error', message: 'Mật khẩu phải có ít nhất 6 ký tự' });
      return;
    }

    try {
      setLoading(true);
      const res = await authService.resetPassword({ email, otp, newPassword });
      addNotification({ type: 'success', message: res.message });
      navigate('/login');
    } catch (error) {
      addNotification({ 
        type: 'error', 
        message: error.response?.data?.message || 'Có lỗi xảy ra khi đặt lại mật khẩu' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Khôi phục mật khẩu
        </h2>
        <p className="mt-2 text-center text-sm text-neutral-400">
          Hoặc{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
            quay lại đăng nhập
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-neutral-700">
          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-300">
                  Địa chỉ Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm bg-neutral-700 border-neutral-600 rounded-md text-white placeholder-neutral-400 py-2.5 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-neutral-900 bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Gửi mã xác nhận <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-neutral-300">
                  Mã xác nhận (OTP)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm bg-neutral-700 border-neutral-600 rounded-md text-white placeholder-neutral-400 py-2.5 transition-colors"
                    placeholder="Nhập mã 6 chữ số"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-300">
                  Mật khẩu mới
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm bg-neutral-700 border-neutral-600 rounded-md text-white placeholder-neutral-400 py-2.5 transition-colors"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300">
                  Xác nhận mật khẩu
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm bg-neutral-700 border-neutral-600 rounded-md text-white placeholder-neutral-400 py-2.5 transition-colors"
                    placeholder="Xác nhận mật khẩu mới"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-neutral-900 bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    'Đặt lại mật khẩu'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
