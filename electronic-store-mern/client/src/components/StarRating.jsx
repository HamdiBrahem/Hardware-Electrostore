import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export default function StarRating({ rating, size = 14 }) {
  return (
    <div className="star-rating" style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((star) => {
        if (star <= Math.floor(rating)) {
          return <FaStar key={star} size={size} color="#f59e0b" />;
        }
        if (star - 0.5 <= rating) {
          return <FaStarHalfAlt key={star} size={size} color="#f59e0b" />;
        }
        return <FaRegStar key={star} size={size} color="#f59e0b" />;
      })}
    </div>
  );
}
