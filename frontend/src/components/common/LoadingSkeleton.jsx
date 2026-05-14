import React from 'react';

function LoadingSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-4 bg-gray-200 rounded-full" />
      ))}
    </div>
  );
}

export default LoadingSkeleton;