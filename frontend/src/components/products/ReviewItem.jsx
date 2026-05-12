import React from 'react';
import { HiOutlineStar } from 'react-icons/hi';
import { formatDate } from '@/lib/formatters';

const getReviewerName = (review) => {
	if (!review?.userId) return 'Khach hang';
	if (typeof review.userId === 'string') return 'Khach hang';
	return review.userId.fullname || 'Khach hang';
};

function ReviewItem({ review }) {
	const rating = review?.rating || 0;
	const reviewer = getReviewerName(review);

	return (
		<div className="border border-gray-200 rounded-xl p-4 space-y-2">
			<div className="flex items-center justify-between">
				<div className="text-sm font-semibold text-gray-800">{reviewer}</div>
				<div className="text-xs text-gray-400">{formatDate(review.createdAt)}</div>
			</div>
			<div className="flex items-center gap-1 text-yellow-500">
				{Array.from({ length: 5 }).map((_, index) => (
					<HiOutlineStar
						key={index}
						className={index < rating ? 'text-yellow-500' : 'text-gray-300'}
					/>
				))}
				<span className="text-xs text-gray-500 ml-2">{rating}/5</span>
			</div>
			<p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
		</div>
	);
}

export default ReviewItem;
