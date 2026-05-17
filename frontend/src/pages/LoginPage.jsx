import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaPhoneAlt } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/lib/zod-schemas';

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Tiêu đề */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">Chào mừng bạn!</h2>
          <p className="text-gray-500 text-sm font-medium">
            Đăng nhập để tiếp tục hành trình mua sắm tuyệt vời.
          </p>
        </div>

        {/* Form Đăng nhập */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <div className="relative group">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors" />
              <input
                {...register('email')}
                type="email"
                placeholder="example@email.com"
                className={`w-full pl-12 pr-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-300 ${
                  errors.email ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          {/* Mật khẩu */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Mật khẩu</label>
            <div className="relative group">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`w-full pl-12 pr-12 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-300 ${
                  errors.password ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {/* Quên mật khẩu */}
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
              Quên mật khẩu?
            </Link>
          </div>

          {/* Nút Đăng nhập */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2d6289] hover:bg-[#244e6d] disabled:bg-gray-400 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98]"
          >
            {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        {/* Hoặc tiếp tục với */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Hoặc tiếp tục với</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700">
            <FcGoogle size={20} /> Google
          </button>
          <button type="button" className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700">
            <FaPhoneAlt size={20} className="text-black" /> Số điện thoại
          </button>
        </div>

        {/* Đăng ký ngay */}
        <p className="text-center text-sm text-gray-500 font-medium">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-[#2d6289] font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </p>

        {/* Điều khoản */}
        <p className="text-center text-[11px] text-gray-400 leading-relaxed px-4">
          Bằng cách đăng nhập, bạn đồng ý với{' '}
          <Link to="#" className="underline hover:text-gray-600">
            Điều khoản dịch vụ
          </Link>{' '}
          và{' '}
          <Link to="#" className="underline hover:text-gray-600">
            Chính sách bảo mật
          </Link>{' '}
          của chúng tôi.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;