"use client";

import { useState } from "react";
import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import { cn } from "@/lib/utils";

interface ImageGalleryEditorProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  className?: string;
}

export default function ImageGalleryEditor({
  urls,
  onChange,
  maxImages = 10,
  className,
}: ImageGalleryEditorProps) {
  const [newUrl, setNewUrl] = useState("");

  const add = () => {
    const trimmed = newUrl.trim();
    if (!trimmed || urls.length >= maxImages) return;
    onChange([...urls, trimmed]);
    setNewUrl("");
  };

  const remove = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= urls.length) return;
    const next = [...urls];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex gap-2">
        <Input
          type="url"
          placeholder="Image URL"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          className="flex-1"
        />
        <Button type="button" size="sm" onClick={add} disabled={urls.length >= maxImages}>
          Add
        </Button>
      </div>
      <p className="text-xs text-gray-500">Up to {maxImages} images. First image is primary.</p>
      <ul className="space-y-2">
        {urls.map((url, i) => (
          <li key={i} className="flex items-center gap-2 rounded border border-gray-200 bg-gray-50 p-2 text-sm">
            <span className="text-gray-500 w-6">{i + 1}.</span>
            <span className="min-w-0 flex-1 truncate text-gray-700">{url}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
                className="text-gray-500 hover:text-gray-900 disabled:opacity-50"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                disabled={i === urls.length - 1}
                className="text-gray-500 hover:text-gray-900 disabled:opacity-50"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
