"use client";

import { LockOutlined, CarOutlined, UndoOutlined } from "@ant-design/icons";

interface Props {
  secureCheckoutLabel: string;
  freeShippingLabel: string;
  freeReturnsLabel: string;
}

function HomeHeroTrustBadges({
  secureCheckoutLabel,
  freeShippingLabel,
  freeReturnsLabel,
}: Props) {
  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2.5 sm:mt-9">
      <span className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-200 sm:text-sm">
        <LockOutlined aria-hidden className="text-blue-300" />
        {secureCheckoutLabel}
      </span>
      <span className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-200 sm:text-sm">
        <CarOutlined aria-hidden className="text-violet-300" />
        {freeShippingLabel}
      </span>
      <span className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-slate-200 sm:text-sm">
        <UndoOutlined aria-hidden className="text-pink-300" />
        {freeReturnsLabel}
      </span>
    </div>
  );
}

export default HomeHeroTrustBadges;
