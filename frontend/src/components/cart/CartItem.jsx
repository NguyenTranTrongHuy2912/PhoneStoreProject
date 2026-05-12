import React from 'react';
import { HiOutlineMinusSm, HiOutlinePlusSm, HiOutlineTrash } from 'react-icons/hi';
import { formatPrice } from '@/lib/formatters';

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
	const product = item.product || {};
	const imageSrc = product?.images?.[0] || '/logo-grid.svg';
	const name = product?.name || item.name || 'San pham';
	const brand = product?.brand || '';

	return (
		<div className="flex flex-col md:flex-row gap-6 border border-gray-200 rounded-2xl p-5 bg-white">
			<div className="w-full md:w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center">
				<img
					src={imageSrc}
					alt={name}
					className="max-h-24 object-contain"
					onError={(event) => {
						event.currentTarget.src = '/logo-grid.svg';
					}}
				/>
			</div>

			<div className="flex-1 space-y-2">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h3 className="text-base font-bold text-gray-900">{name}</h3>
						{brand && <p className="text-xs text-gray-500 uppercase">{brand}</p>}
					</div>
					<button
						type="button"
						onClick={onRemove}
						className="text-sm text-gray-400 hover:text-red-500 transition-colors"
					>
						<HiOutlineTrash />
					</button>
				</div>

				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="text-blue-600 font-semibold text-lg">
						{formatPrice(item.price)}
					</div>

					<div className="flex items-center gap-3">
						<div className="flex items-center border border-gray-200 rounded-full">
							<button
								type="button"
								onClick={onDecrease}
								className="px-3 py-2 text-gray-600"
							>
								<HiOutlineMinusSm />
							</button>
							<span className="px-3 text-sm font-semibold">{item.quantity}</span>
							<button
								type="button"
								onClick={onIncrease}
								className="px-3 py-2 text-gray-600"
							>
								<HiOutlinePlusSm />
							</button>
						</div>
						<div className="text-sm text-gray-500">
							{formatPrice(item.price * item.quantity)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CartItem;
