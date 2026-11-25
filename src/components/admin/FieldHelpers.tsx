"use client";

import React from "react";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  helper,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  helper?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl px-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#294D3A] focus:bg-white transition-colors"
      />
      {helper && <p className="text-[11px] text-[#595959] mt-1">{helper}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold tracking-wider text-[#171717] uppercase mb-1.5">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#FAF8F5] border border-[#304B38]/15 rounded-xl p-3.5 text-sm text-[#171717] focus:outline-none focus:border-[#294D3A] focus:bg-white transition-colors"
      />
    </div>
  );
}

export function SectionGroup({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pt-6 border-t border-[#304B38]/10 first:pt-0 first:border-t-0 space-y-4">
      <div>
        <h3 className="text-base font-serif font-bold text-[#1F3026]">{title}</h3>
        {subtitle && <p className="text-xs text-[#595959] mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function ItemOrderControls({
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
}: {
  index: number;
  total: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {onMoveUp && (
        <button
          type="button"
          disabled={index === 0}
          onClick={onMoveUp}
          className="p-1.5 rounded-lg bg-white border border-[#304B38]/15 text-[#595959] hover:text-[#171717] disabled:opacity-35"
          title="Move up"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>
      )}
      {onMoveDown && (
        <button
          type="button"
          disabled={index === total - 1}
          onClick={onMoveDown}
          className="p-1.5 rounded-lg bg-white border border-[#304B38]/15 text-[#595959] hover:text-[#171717] disabled:opacity-35"
          title="Move down"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
          title="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

export function moveArrayItem<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  if (toIndex < 0 || toIndex >= arr.length) return arr;
  const copy = [...arr];
  const [moved] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, moved);
  return copy;
}
