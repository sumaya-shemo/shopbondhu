import { CheckCircle2, Info, XCircle, X } from "lucide-react";
import { useStore } from "../store/StoreContext";

export default function Toasts() {
  const { toasts, dismissToast } = useStore();
  if (!toasts.length) return null;
  return (
    <div className="toasts" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div className={`toast toast--${toast.tone}`} key={toast.id} role="status">
          {toast.tone === "error" ? (
            <XCircle size={18} />
          ) : toast.tone === "neutral" ? (
            <Info size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{toast.message}</span>
          <button type="button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss notification">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
