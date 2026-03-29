import { X } from "lucide-react";
import { useToast } from "./toast-context";
import { cn } from "../../lib/cn";

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "glass-card px-4 py-3 flex items-center gap-3 animate-slide-in-right",
            toast.type === "error" ? "border-danger/30" : "border-cyan/30",
          )}
        >
          <p className="text-primary text-sm flex-1">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-muted hover:text-primary shrink-0"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
