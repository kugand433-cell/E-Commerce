import { Star } from "lucide-react";

export default function StarRating({ value = 0, count, size = 16, showValue = false }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ display: 'flex' }}>
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              style={{ width: size, height: size, color: filled ? 'var(--nest-orange)' : 'rgba(107,107,123,0.4)', fill: filled ? 'var(--nest-orange)' : 'none' }}
            />
          );
        })}
      </div>
      {showValue && <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{value.toFixed(1)}</span>}
      {typeof count === "number" && (
        <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>({count})</span>
      )}
    </div>
  );
}
