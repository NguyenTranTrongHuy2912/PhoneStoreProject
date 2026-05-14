import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@/lib/zod-schemas';
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from '@/lib/constants';

// Danh sách chỉ thanh toán thông thường (không gồm VNPay)
const STANDARD_METHODS = Object.values(PAYMENT_METHODS).filter(m => m !== PAYMENT_METHODS.VNPAY);

function CheckoutForm({ onSubmit, onVnpaySubmit, isSubmitting }) {
	const {
		register,
		handleSubmit,
		getValues,
		setValue,
		watch,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(checkoutSchema),
		defaultValues: {
			shippingAddress: {
				street: '',
				city: '',
				state: '',
				country: 'Viet Nam',
			},
			paymentMethod: PAYMENT_METHODS.CREDIT_CARD,
			billingAddressSameAsShipping: true,
		},
	});

	const selectedMethod = watch('paymentMethod');

	// Xử lý khi click nút VNPay — validate form rồi gọi onVnpaySubmit
	const handleVnpayClick = async () => {
		// Tạm set paymentMethod = vnpay để pass validate
		setValue('paymentMethod', PAYMENT_METHODS.VNPAY);
		handleSubmit((data) => {
			onVnpaySubmit(data);
		})();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			{/* ── Địa chỉ giao hàng ── */}
			<div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
				<h3 className="text-base font-bold text-gray-900">Địa chỉ giao hàng</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-semibold text-gray-700">Đường / số nhà</label>
						<input
							{...register('shippingAddress.street')}
							className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="123 Nguyễn Văn A"
						/>
						{errors.shippingAddress?.street && (
							<p className="text-xs text-red-500">{errors.shippingAddress.street.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-semibold text-gray-700">Thành phố</label>
						<input
							{...register('shippingAddress.city')}
							className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Hồ Chí Minh"
						/>
						{errors.shippingAddress?.city && (
							<p className="text-xs text-red-500">{errors.shippingAddress.city.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-semibold text-gray-700">Tỉnh / thành</label>
						<input
							{...register('shippingAddress.state')}
							className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Quận 1"
						/>
						{errors.shippingAddress?.state && (
							<p className="text-xs text-red-500">{errors.shippingAddress.state.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-semibold text-gray-700">Quốc gia</label>
						<input
							{...register('shippingAddress.country')}
							className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Viet Nam"
						/>
						{errors.shippingAddress?.country && (
							<p className="text-xs text-red-500">{errors.shippingAddress.country.message}</p>
						)}
					</div>
				</div>
			</div>

			{/* ── Phương thức thanh toán ── */}
			<div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
				<h3 className="text-base font-bold text-gray-900">Phương thức thanh toán</h3>

				{/* Các phương thức thông thường */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{STANDARD_METHODS.map((method) => (
						<label
							key={method}
							className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-colors ${
								selectedMethod === method
									? 'border-blue-500 bg-blue-50'
									: 'border-gray-200 hover:border-blue-300'
							}`}
						>
							<input
								type="radio"
								value={method}
								{...register('paymentMethod')}
								className="accent-blue-500"
							/>
							<span className="text-sm text-gray-700 font-semibold">
								{PAYMENT_METHOD_LABELS[method]}
							</span>
						</label>
					))}
				</div>

				{/* Divider */}
				<div className="flex items-center gap-3 my-2">
					<div className="flex-1 h-px bg-gray-100" />
					<span className="text-xs text-gray-400 font-medium">hoặc thanh toán online</span>
					<div className="flex-1 h-px bg-gray-100" />
				</div>

				{/* VNPay option - nổi bật */}
				<label
					className={`flex items-center gap-4 border-2 rounded-xl px-5 py-4 cursor-pointer transition-all ${
						selectedMethod === PAYMENT_METHODS.VNPAY
							? 'border-[#0066cc] bg-blue-50 shadow-md'
							: 'border-dashed border-[#0066cc]/40 hover:border-[#0066cc] hover:bg-blue-50/50'
					}`}
				>
					<input
						type="radio"
						value={PAYMENT_METHODS.VNPAY}
						{...register('paymentMethod')}
						className="accent-[#0066cc]"
					/>
					{/* VNPay Logo giả lập */}
					<div className="flex items-center gap-3 flex-1">
						<div className="w-12 h-8 bg-[#0066cc] rounded-md flex items-center justify-center shadow">
							<span className="text-white text-[10px] font-black tracking-tighter leading-none">
								VN<br />PAY
							</span>
						</div>
						<div>
							<p className="text-sm font-bold text-[#0066cc]">Thanh toán VNPay</p>
							<p className="text-xs text-gray-500">Thẻ ATM, Visa, MasterCard, QR Code</p>
						</div>
					</div>
					<span className="text-[10px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
						AN TOÀN
					</span>
				</label>

				{errors.paymentMethod && (
					<p className="text-xs text-red-500">{errors.paymentMethod.message}</p>
				)}
			</div>

			{/* ── Nút hành động ── */}
			<div className="space-y-3">
				{/* Nút đặt hàng thông thường (ẩn khi chọn VNPay) */}
				{selectedMethod !== PAYMENT_METHODS.VNPAY && (
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60"
					>
						{isSubmitting ? 'Đang xử lý...' : 'Đặt hàng'}
					</button>
				)}

				{/* Nút thanh toán VNPay (hiện khi chọn VNPay) */}
				{selectedMethod === PAYMENT_METHODS.VNPAY && (
					<button
						type="button"
						onClick={handleVnpayClick}
						disabled={isSubmitting}
						className="w-full flex items-center justify-center gap-3 bg-[#0066cc] hover:bg-[#0055aa] text-white font-bold py-3.5 rounded-full transition-all shadow-lg hover:shadow-xl disabled:opacity-60 active:scale-[0.98]"
					>
						<div className="w-7 h-5 bg-white rounded flex items-center justify-center">
							<span className="text-[#0066cc] text-[8px] font-black leading-none">VN<br/>PAY</span>
						</div>
						{isSubmitting ? 'Đang chuyển hướng...' : 'Thanh toán qua VNPay'}
					</button>
				)}
			</div>
		</form>
	);
}

export default CheckoutForm;
