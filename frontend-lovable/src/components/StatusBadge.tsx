import type { OrderStatus } from "@/lib/types";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-warning/20 text-yellow-800 border-warning/40",
  confirmed: "bg-info/20 text-blue-800 border-info/40",
  shipped: "bg-nest-orange/20 text-orange-800 border-nest-orange/40",
  delivered: "bg-success/20 text-green-800 border-success/40",
  cancelled: "bg-destructive/15 text-red-800 border-destructive/40",
};

export default function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${STYLES[status] || ""}`}
    >
      {status}
    </span>
  );
}
