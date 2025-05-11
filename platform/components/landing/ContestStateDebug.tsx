'use client';

import { useContest, ContestState } from '@/contexts/ContestContext';

export default function ContestStateDebug() {
  const { contestState } = useContest();
  
  let stateName = '';
  if (contestState === undefined) {
    stateName = 'UNDEFINED';
  } else {
    switch(contestState) {
      case ContestState.NOT_STARTED:
        stateName = 'NOT_STARTED';
        break;
      case ContestState.REGISTRATION:
        stateName = 'REGISTRATION';
        break;
      case ContestState.STARTED:
        stateName = 'STARTED';
        break;
      default:
        stateName = 'UNKNOWN';
    }
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 p-3 rounded border border-white/20 backdrop-blur-sm">
      <p className="text-xs mb-1 text-white/80">Current Contest State:</p>
      <p className="text-sm font-bold">{stateName} (Value: {contestState})</p>
    </div>
  );
} 