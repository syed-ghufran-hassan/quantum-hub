import { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';

interface StakeInfo {
  amount: number; // STX amount
  lockEndBlock?: number; // block when lock ends
  currentBlock: number; // current blockchain block
}

interface FeeInfo {
  normalFee: number; // %
  earlyFee: number; // %
  lockBlocks: number; // min blocks before normal withdrawal
}

// Reusable Stat Card
function StatCard({
  title,
  value,
  color = 'green',
  subtitle,
}: {
  title: string;
  value: string | number;
  color?: 'green' | 'blue';
  subtitle?: string;
}) {
  const colors = {
    green: { bg: 'bg-green-50', text: 'text-green-900', label: 'text-green-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-900', label: 'text-blue-600' },
  };

  return (
    <div className={`${colors[color].bg} rounded-lg p-4`}>
      <div className={`text-sm ${colors[color].label}`}>{title}</div>
      <div className={`text-2xl font-bold ${colors[color].text}`}>{value}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
    </div>
  );
}

// ----------------
// Stake Stats
// ----------------
export function StakingStats({ stakeInfo }: { stakeInfo: StakeInfo }) {
  const lockStatus = useMemo(() => {
    if (!stakeInfo.lockEndBlock) return '-';
    const blocksLeft = stakeInfo.lockEndBlock - stakeInfo.currentBlock;
    return blocksLeft > 0 ? `${blocksLeft} blocks left` : 'Unlocked';
  }, [stakeInfo]);

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Your Stake</h2>
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Staked Amount" value={`${stakeInfo.amount} STX`} color="green" />
        <StatCard title="Lock Status" value={lockStatus} color="blue" />
      </div>
    </div>
  );
}

// ----------------
// Fee Structure
// ----------------
export function FeeStructure({ feeInfo }: { feeInfo: FeeInfo }) {
  return (
    <div className="mt-8 bg-green-50 rounded-2xl p-6">
      <h3 className="text-lg font-bold text-green-900 mb-2">Fee Structure</h3>
      <div className="grid md:grid-cols-2 gap-4 text-green-800">
        <div className="bg-white rounded-lg p-4">
          <div className="font-medium">Normal Withdrawal</div>
          <div className="text-2xl font-bold">{feeInfo.normalFee}%</div>
          <div className="text-sm">After ~{feeInfo.lockBlocks} blocks</div>
        </div>
        <div className="bg-white rounded-lg p-4">
          <div className="font-medium">Early Withdrawal</div>
          <div className="text-2xl font-bold">{feeInfo.earlyFee}%</div>
          <div className="text-sm">Before lock period ends</div>
        </div>
      </div>
    </div>
  );
}
