import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { vnpayService } from '@/services/vnpayService';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { formatPrice } from '@/lib/formatters';

/**
 * VnpayReturnPage
 * Trang này là return URL mà backend redirect về sau khi VNPay xử lý.
 * Backend đã xác thực chữ ký và gắn ?success=1|0&responseCode=...
 */
function VnpayReturnPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'failed'
  const [orderId, setOrderId] = useState(null);
  const [pendingOrder, setPendingOrder] = useState(null);

  const success = searchParams.get('success') === '1';
  const responseCode = searchParams.get('responseCode') || '';
  const transactionId = searchParams.get('transactionId') || '';
  const orderInfo = searchParams.get('orderInfo') || '';

  // Bảng mã lỗi VNPay
  const VNPAY_RESPONSE_CODES = {
    '00': 'Giao dịch thành công',
    '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan đến lừa đảo, giao dịch bất thường)',
    '09': 'Thẻ/Tài khoản chưa đăng ký dịch vụ Internet Banking',
    '10': 'Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
    '11': 'Đã hết hạn chờ thanh toán. Vui lòng thực hiện lại giao dịch',
    '12': 'Thẻ/Tài khoản bị khóa',
    '13': 'Mã OTP không đúng',
    '24': 'Giao dịch bị hủy',
    '51': 'Tài khoản không đủ số dư',
    '65': 'Tài khoản đã vượt quá hạn mức giao dịch trong ngày',
    '75': 'Ngân hàng thanh toán đang bảo trì',
    '79': 'Nhập sai mật khẩu thanh toán quá số lần quy định',
    '99': 'Lỗi không xác định',
  };

  useEffect(() => {
    const raw = sessionStorage.getItem('vnpay_pending_order');
    if (raw) {
      try {
        setPendingOrder(JSON.parse(raw));
      } catch (_) {}
    }

    if (!success) {
      setStatus('failed');
      return;
    }

    // Thanh toán thành công -> xác nhận tạo đơn hàng
    const confirm = async () => {
      if (!raw) {
        // Không tìm thấy dữ liệu chờ -> redirect order history
        setStatus('success');
        clearCart();
        sessionStorage.removeItem('vnpay_pending_order');
        return;
      }

      try {
        const pending = JSON.parse(raw);
        const res = await vnpayService.confirmOrder({
          ...pending,
          transactionId,
          responseCode,
          orderInfo,
        });

        if (res.success) {
          setOrderId(res.data._id);
          clearCart();
          sessionStorage.removeItem('vnpay_pending_order');
          setStatus('success');
        } else {
          setStatus('failed');
        }
      } catch (err) {
        console.error('[VNPay] confirm error:', err);
        setStatus('failed');
      }
    };

    confirm();
  }, []);

  const errorMessage = VNPAY_RESPONSE_CODES[responseCode] || 'Thanh toán thất bại';

  // ── Loading ──
  if (status === 'loading') {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 font-medium">Đang xác nhận thanh toán VNPay...</p>
        </div>
      </div>
    );
  }

  // ── Thành công ──
  if (status === 'success') {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[700px] mx-auto px-6 py-16 space-y-6">
          {/* Header thành công */}
          <div className="bg-white border border-green-100 rounded-2xl p-10 text-center space-y-4 shadow-sm">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Thanh toán VNPay thành công!</h1>
            <p className="text-gray-500 text-sm">Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.</p>

            {/* VNPay Badge */}
            <div className="inline-flex items-center gap-2 bg-[#0066cc]/10 text-[#0066cc] px-4 py-2 rounded-full text-sm font-semibold">
              <div className="w-6 h-4 bg-[#0066cc] rounded flex items-center justify-center">
                <span className="text-white text-[6px] font-black leading-none">VN<br/>PAY</span>
              </div>
              Thanh toán qua VNPay
            </div>
          </div>

          {/* Thông tin giao dịch */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-sm">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Chi tiết giao dịch</h3>
            <div className="space-y-2 text-sm">
              {transactionId && (
                <div className="flex justify-between text-gray-600">
                  <span>Mã giao dịch VNPay</span>
                  <span className="font-mono font-semibold text-gray-900">{transactionId}</span>
                </div>
              )}
              {orderId && (
                <div className="flex justify-between text-gray-600">
                  <span>Mã đơn hàng</span>
                  <span className="font-mono font-semibold text-gray-900 text-xs">{orderId}</span>
                </div>
              )}
              {pendingOrder?.totalAmount && (
                <div className="flex justify-between text-gray-600">
                  <span>Số tiền thanh toán</span>
                  <span className="font-bold text-green-600">{formatPrice(pendingOrder.totalAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Mã phản hồi</span>
                <span className="text-green-600 font-semibold">{responseCode} - Thành công</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            {orderId && (
              <Link
                to={`/order-success/${orderId}`}
                className="flex-1 inline-flex items-center justify-center border border-gray-200 px-6 py-3 rounded-full text-sm font-semibold text-gray-700 hover:text-blue-600 hover:border-blue-400 transition-colors"
              >
                Xem chi tiết đơn hàng
              </Link>
            )}
            <Link
              to="/products"
              className="flex-1 inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Thất bại ──
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[700px] mx-auto px-6 py-16 space-y-6">
        <div className="bg-white border border-red-100 rounded-2xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Thanh toán không thành công</h1>
          <p className="text-gray-500 text-sm">{errorMessage}</p>
          {responseCode && responseCode !== '00' && (
            <p className="text-xs text-gray-400">Mã lỗi: {responseCode}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/checkout')}
            className="flex-1 inline-flex items-center justify-center bg-[#0066cc] hover:bg-[#0055aa] text-white font-semibold px-6 py-3 rounded-full transition-colors"
          >
            Thử lại thanh toán
          </button>
          <Link
            to="/products"
            className="flex-1 inline-flex items-center justify-center border border-gray-200 px-6 py-3 rounded-full text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
          >
            Về trang sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VnpayReturnPage;
