'use client';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (base64: string) => void;
}

export default function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      onChange(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mb-1">
        {label}
      </label>
      {value ? (
        <div className="space-y-2">
          <img src={value} alt="logo" className="h-16 w-auto object-contain" />
          <div className="flex gap-2">
            <label className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-text underline cursor-pointer hover:text-ledger-oxblood">
              Replace
              <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
            </label>
            <button
              type="button"
              onClick={() => onChange('')}
              className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-oxblood hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="block border border-dashed border-ledger-grey/40 p-4 text-center cursor-pointer hover:border-ledger-text transition-colors">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey">
            Upload Logo
          </span>
          <input type="file" accept="image/*" onChange={handleFile} className="sr-only" />
        </label>
      )}
    </div>
  );
}
