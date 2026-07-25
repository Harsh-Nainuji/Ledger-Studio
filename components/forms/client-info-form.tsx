'use client';

import { ClientInfo } from '@/lib/types';
import ImageUpload from './image-upload';

interface ClientInfoFormProps {
  clientInfo: ClientInfo;
  onUpdate: (updates: Partial<ClientInfo>) => void;
}

const inputClass =
  'w-full font-mono text-sm text-ledger-text bg-transparent outline-none border-b border-ledger-grey/30 focus:border-ledger-text pb-1 placeholder:text-ledger-grey';

const labelClass =
  'block font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mb-1';

export default function ClientInfoForm({
  clientInfo,
  onUpdate,
}: ClientInfoFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-serif text-lg text-ledger-text">Bill To (Client Info)</h3>

      <ImageUpload
        label="Logo"
        value={clientInfo.logo}
        onChange={(logo) => onUpdate({ logo })}
      />

      <div>
        <label className={labelClass}>Name</label>
        <input
          type="text"
          placeholder="Client Name"
          value={clientInfo.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          placeholder="Client Email"
          value={clientInfo.email}
          onChange={(e) => onUpdate({ email: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Company</label>
        <input
          type="text"
          placeholder="Company Name"
          value={clientInfo.company}
          onChange={(e) => onUpdate({ company: e.target.value })}
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <textarea
          placeholder="Address"
          value={clientInfo.address}
          onChange={(e) => onUpdate({ address: e.target.value })}
          className={`${inputClass} resize-none`}
          rows={2}
        />
      </div>
    </div>
  );
}
