import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema } from '@/lib/zod-schemas';
import { PAYMENT_METHOD_LABELS, PAYMENT_METHODS } from '@/lib/constants';

function CheckoutForm({ onSubmit, isSubmitting }) {
	const {
		register,
		handleSubmit,
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

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
				<h3 className="text-base font-bold text-gray-900">Dia chi giao hang</h3>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<label className="text-sm font-semibold text-gray-700">Duong / so nha</label>
						<input
							{...register('shippingAddress.street')}
							className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="123 Nguyen Van A"
						/>
						{errors.shippingAddress?.street && (
							<p className="text-xs text-red-500">{errors.shippingAddress.street.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-semibold text-gray-700">Thanh pho</label>
						<input
							{...register('shippingAddress.city')}
							className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Ho Chi Minh"
						/>
						{errors.shippingAddress?.city && (
							<p className="text-xs text-red-500">{errors.shippingAddress.city.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-semibold text-gray-700">Tinh / thanh</label>
						<input
							{...register('shippingAddress.state')}
							className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
							placeholder="Quan 1"
						/>
						{errors.shippingAddress?.state && (
							<p className="text-xs text-red-500">{errors.shippingAddress.state.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<label className="text-sm font-semibold text-gray-700">Quoc gia</label>
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

			<div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
				<h3 className="text-base font-bold text-gray-900">Phuong thuc thanh toan</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
					{Object.values(PAYMENT_METHODS).map((method) => (
						<label
							key={method}
							className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 cursor-pointer"
						>
							<input
								type="radio"
								value={method}
								{...register('paymentMethod')}
							/>
							<span className="text-sm text-gray-700 font-semibold">
								{PAYMENT_METHOD_LABELS[method]}
							</span>
						</label>
					))}
				</div>
				{errors.paymentMethod && (
					<p className="text-xs text-red-500">{errors.paymentMethod.message}</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-full transition-colors disabled:opacity-60"
			>
				{isSubmitting ? 'Dang xu ly...' : 'Dat hang'}
			</button>
		</form>
	);
}

export default CheckoutForm;
