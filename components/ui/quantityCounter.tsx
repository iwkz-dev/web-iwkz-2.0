'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantityCounterProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

export function QuantityCounter({
  quantity,
  onQuantityChange,
  min = 0,
  max = 99,
}: QuantityCounterProps) {
  return (
    <div className="flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-all hover:bg-emerald-100 hover:text-emerald-600 active:scale-90 disabled:opacity-30 disabled:hover:bg-gray-100 disabled:hover:text-gray-600"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="flex h-8 w-10 items-center justify-center text-sm font-bold text-gray-800">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 transition-all hover:bg-emerald-100 active:scale-90 disabled:opacity-30"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
