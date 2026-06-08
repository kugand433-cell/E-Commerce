import { Star } from "lucide-react";

export default function StarRating({
  value = 0,
  count,
  size = 16,
  showValue = false,
}: {
  value?: number;
  count?: number;
  size?: number;
  showValue?: boolean;
}) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[0, 1, 2, 3, 4].map((i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              style={{ width: size, height: size }}
              className={filled ? "fill-nest-orange text-nest-orange" : "text-muted-foreground/40"}
            />
          );
        })}
      </div>
      {showValue && <span className="text-sm font-medium">{value.toFixed(1)}</span>}
      {typeof count === "number" && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}
