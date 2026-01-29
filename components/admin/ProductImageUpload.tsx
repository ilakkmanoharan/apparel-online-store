"use client";

interface ProductImageUploadProps {
  urls: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

export default function ProductImageUpload({ urls, onChange, disabled }: ProductImageUploadProps) {
  const addUrl = (url: string) => {
    const trimmed = url.trim();
    if (trimmed && !urls.includes(trimmed)) onChange([...urls, trimmed]);
  };

  const removeUrl = (index: number) => {
    onChange(urls.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Images</label>
      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <div key={i} className="relative group">
            <div className="w-20 h-20 rounded border border-gray-200 overflow-hidden bg-gray-100">
              <img src={url} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = ""; }} />
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => removeUrl(i)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-bl px-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
      {!disabled && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.elements.namedItem("url") as HTMLInputElement;
            if (input?.value) {
              addUrl(input.value);
              input.value = "";
            }
          }}
          className="flex gap-2"
        >
          <input
            name="url"
            type="url"
            placeholder="https://..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <button type="submit" className="px-3 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800">
            Add URL
          </button>
        </form>
      )}
    </div>
  );
}
