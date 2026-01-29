"use client";

import { useState } from "react";
import Modal from "@/components/common/Modal";
import { cn } from "@/lib/utils";

interface SizeGuideProps {
  className?: string;
  /** Optional table: e.g. [["Size", "Chest", "Waist", "Hip"], ["S", "34-36", "28-30", "36-38"], ...] */
  table?: string[][];
}

const DEFAULT_TABLE: string[][] = [
  ["Size", "Chest (in)", "Waist (in)", "Hip (in)", "Length (in)"],
  ["XS", "31-33", "24-26", "33-35", "25"],
  ["S", "34-36", "28-30", "36-38", "26"],
  ["M", "37-39", "31-33", "39-41", "27"],
  ["L", "40-42", "34-36", "42-44", "28"],
  ["XL", "43-45", "37-39", "45-47", "29"],
];

export default function SizeGuide({ className, table = DEFAULT_TABLE }: SizeGuideProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("text-sm text-gray-600 underline hover:text-gray-900", className)}
      >
        Size guide
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Size guide">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {table[0]?.map((cell, i) => (
                  <th key={i} className="py-2 pr-4 font-medium text-gray-900">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.slice(1).map((row, ri) => (
                <tr key={ri} className="border-b border-gray-100">
                  {row.map((cell, ci) => (
                    <td key={ci} className="py-2 pr-4 text-gray-700">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </>
  );
}
