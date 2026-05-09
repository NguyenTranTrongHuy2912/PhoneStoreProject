import React from 'react';
import { Link } from 'react-router-dom';
import {
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineRefresh,
  HiOutlineSupport,
  HiOutlineGlobeAlt
} from 'react-icons/hi';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-20">
      {/* Tầng 1: Cam kết dịch vụ (Service Bars) */}
      <div className="max-w-[1440px] mx-auto px-10 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <HiOutlineShieldCheck className="text-4xl text-blue-600" />
          <div>
            <h4 className="font-bold text-gray-800 text-sm">100% Chính hãng</h4>
            <p className="text-xs text-gray-500">Bảo hành toàn quốc</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <HiOutlineTruck className="text-4xl text-blue-600" />
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Miễn phí giao hàng</h4>
            <p className="text-xs text-gray-500">Cho đơn hàng từ 5tr</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <HiOutlineRefresh className="text-4xl text-blue-600" />
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Đổi trả 30 ngày</h4>
            <p className="text-xs text-gray-500">Thủ tục nhanh gọn</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <HiOutlineSupport className="text-4xl text-blue-600" />
          <div>
            <h4 className="font-bold text-gray-800 text-sm">Hỗ trợ 24/7</h4>
            <p className="text-xs text-gray-500">Giải đáp mọi thắc mắc</p>
          </div>
        </div>
      </div>

      {/* Tầng 2: Thông tin chi tiết */}
      <div className="max-w-[1440px] mx-auto px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Cột 1: Giới thiệu */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
            <span>PhoneStore</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed">
            PhoneStore tự hào là đơn vị bán lẻ thiết bị công nghệ hàng đầu, mang đến trải nghiệm mua sắm thông minh và an tâm nhất cho người tiêu dùng Việt Nam.
          </p>
          <div className="flex gap-4 text-2xl text-gray-400">
            <FaFacebook className="hover:text-blue-600 cursor-pointer transition-colors" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer transition-colors" />
            <FaYoutube className="hover:text-red-600 cursor-pointer transition-colors" />
          </div>
        </div>

        {/* Cột 2: Danh mục */}
        <div>
          <h4 className="font-bold text-gray-800 mb-6 uppercase tracking-wider text-sm">Danh mục</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li className="hover:text-blue-600 cursor-pointer">Điện thoại iPhone</li>
            <li className="hover:text-blue-600 cursor-pointer">Điện thoại Samsung</li>
            <li className="hover:text-blue-600 cursor-pointer">Laptop & Tablet</li>
            <li className="hover:text-blue-600 cursor-pointer">Phụ kiện chính hãng</li>
            <li className="hover:text-blue-600 cursor-pointer">Máy cũ giá rẻ</li>
          </ul>
        </div>

        {/* Cột 3: Chính sách */}
        <div>
          <h4 className="font-bold text-gray-800 mb-6 uppercase tracking-wider text-sm">Chính sách</h4>
          <ul className="space-y-4 text-gray-500 text-sm">
            <li className="hover:text-blue-600 cursor-pointer">Chính sách bảo mật</li>
            <li className="hover:text-blue-600 cursor-pointer">Điều khoản dịch vụ</li>
            <li className="hover:text-blue-600 cursor-pointer">Thông tin giao hàng</li>
            <li className="hover:text-blue-600 cursor-pointer">Chính sách đổi trả</li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký nhận tin */}
        <div>
          <h4 className="font-bold text-gray-800 mb-6 uppercase tracking-wider text-sm">Đăng ký nhận tin</h4>
          <p className="text-gray-500 text-sm mb-6">Nhận thông báo về các chương trình khuyến mãi và sản phẩm mới nhất.</p>
          <div className="flex shadow-sm">
            <input
              type="email"
              placeholder="Email của bạn"
              className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <button className="bg-blue-500 text-white px-6 py-2.5 rounded-r-lg font-bold text-sm hover:bg-blue-600 transition-colors">
              Gửi
            </button>
          </div>
        </div>
      </div>

      {/* Tầng 3: Copyright */}
      <div className="bg-gray-50 border-t border-gray-100 py-6">
        <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
          <p>© {new Date().getFullYear()} PhoneStore. All rights reserved.</p>
          <div className="flex gap-8">
            <span className="hover:text-blue-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-blue-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-blue-600 cursor-pointer">Contact Us</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;