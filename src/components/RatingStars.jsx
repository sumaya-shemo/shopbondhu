import { Star } from "lucide-react";

export default function RatingStars({ rating, size = 14, showValue = false, count }) {
  const stars = [0, 1, 2, 3, 4];
  return (
    <span className="rating" aria-label={`${rating} out of 5 stars`}>
      <span className="rating__stars" style={{ "--rating-size": `${size}px` }}>
        <span className="rating__base" aria-hidden="true">
          {stars.map((i) => (
            <Star key={i} size={size} strokeWidth={1.8} />
          ))}
        </span>
        <span
          className="rating__fill"
          style={{ width: `${(Math.min(5, rating) / 5) * 100}%` }}
          aria-hidden="true"
        >
          {stars.map((i) => (
            <Star key={i} size={size} strokeWidth={1.8} />
          ))}
        </span>
      </span>
      {showValue && <span className="rating__value">{rating.toFixed(1)}</span>}
      {count != null && <span className="rating__count">({count})</span>}
    </span>
  );
}
