import React from "react";

interface Props {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

function LegalPageLayout({ title, lastUpdated, children }: Props) {
  return (
    <main className="bg-slate-50 py-14 sm:py-16">
      <div className="my-container">
        <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            {title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last updated: {lastUpdated}
          </p>
          <div className="prose-legal mt-8 space-y-6 text-[15px] leading-7 text-slate-700">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export default LegalPageLayout;
