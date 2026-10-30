import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, onChange, min = 1, max = 99, small = false }) {
  return (
    <div className={`qty ${small ? "qty--sm" : ""}`} role="group" aria-label="Quantity">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={small ? 13 : 15} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={small ? 13 : 15} />
      </button>
    </div>
  );
}
