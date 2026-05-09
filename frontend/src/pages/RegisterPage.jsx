import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineMail, 
  HiOutlineLockClosed, 
  HiOutlineEye, 
  HiOutlineEyeOff, 
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineQuestionMarkCircle 
} from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md space-y-7">
        {/* Tiêu đề */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">
            Tạo tài khoản mới ✨
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Tham gia cùng PhoneStore để nhận nhiều ưu đãi hấp dẫn.
          </p>
        </div>

        {/* Form Đăng ký */}
        <form className="mt-8 space-y-4">
          {/* Họ và Tên */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Họ và Tên</label>
            <div className="relative group">
              <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Số điện thoại */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Số điện thoại</label>
            <div className="relative group">
              <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors" />
              <input
                type="tel"
                placeholder="090xxxxxxx"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <div className="relative group">
              <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors" />
              <input
                type="email"
                placeholder="example@email.com"
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* Mật khẩu */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Mật khẩu</label>
            <div className="relative group">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 ml-1">Xác nhận mật khẩu</label>
            <div className="relative group">
              <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirmPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
              </button>
            </div>
          </div>

          {/* Điều khoản */}
          <div className="flex items-start gap-2 py-2">
            <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
            <span className="text-xs text-gray-500 leading-relaxed">
              Tôi đồng ý với các <Link to="/terms" className="text-blue-600 font-bold hover:underline">Điều khoản dịch vụ</Link> và <Link to="/privacy" className="text-blue-600 font-bold hover:underline">Chính sách bảo mật</Link> của PhoneStore.
            </span>
          </div>

          {/* Nút Đăng ký */}
          <button className="w-full bg-[#2d6289] hover:bg-[#244e6d] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.98] mt-2">
            Đăng ký tài khoản
          </button>
        </form>

        {/* Hoặc tiếp tục với */}
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Hoặc đăng ký bằng</span>
          </div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700">
            <FcGoogle size={20} /> Google
          </button>
          <button className="flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-semibold text-gray-700">
            <FaApple size={20} className="text-black" /> Apple
          </button>
        </div>

        {/* Đăng nhập ngay */}
        <p className="text-center text-sm text-gray-500 font-medium pb-8">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-[#2d6289] font-bold hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;