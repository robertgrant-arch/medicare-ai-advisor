'use client';

// Coverage choice chip card (PR 1, additive). Not yet wired into HeroChat;
// will be referenced by chat once NEXT_PUBLIC_COVERAGE_CHIPS=1.

import React from 'react';

export interface CoverageChoiceCardProps {
  prompt?: string;
  chips: string[];
  onSelect: (chip: string) => void;
  disabled?: boolean;
}

export const CoverageChoiceCard: React.FC<CoverageChoiceCardProps> = ({
  prompt,
  chips,
  onSelect,
  disabled,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-4 shadow-sm">
      {prompt ? (
        <p className="mb-3 text-sm text-slate-700">{prompt}</p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(chip)}
            className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CoverageChoiceCard;
