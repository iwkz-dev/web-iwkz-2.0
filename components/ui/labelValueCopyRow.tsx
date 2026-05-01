import { Check, Copy } from 'lucide-react';

interface LabelValueCopyRowProps {
  label: string;
  value: string;
  isCopied: boolean;
  onCopy: () => void;
}

export function LabelValueCopyRow({
  label,
  value,
  isCopied,
  onCopy,
}: LabelValueCopyRowProps) {
  return (
    <div className="mb-2 last:mb-0 flex items-center justify-between rounded-lg bg-white p-2 border border-gray-100 gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </p>
        <p className="text-xs font-semibold text-gray-800 font-mono wrap-break-word">
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-emerald-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
