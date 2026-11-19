import React, { useState } from 'react';
import { EntryPass } from '../types';
import { PassBoqSummary, isBoqMaterialItem } from '../utils/boqUtils';
import { verifyItemMakeAndModel } from '../utils/boqAnnexureData';
import { Layers, Truck, CheckCircle2, Clock, ChevronDown, ChevronUp, AlertTriangle, ClipboardCheck } from 'lucide-react';

interface BoqDeliveryTrackerBarProps {
  summary: PassBoqSummary;
  passNumber: string;
  pass?: EntryPass;
  onReviewMakeModel?: () => void;
  compact?: boolean;
}

export const BoqDeliveryTrackerBar: React.FC<BoqDeliveryTrackerBarProps> = ({
  summary,
  passNumber,
  pass,
  onReviewMakeModel,
  compact = false,
}) => {
  const [showAllItems, setShowAllItems] = useState(false);

  const makeModelStats = React.useMemo(() => {
    if (!pass || !Array.isArray(pass.materialItems)) return null;
    const boqItems = pass.materialItems.filter((m) => isBoqMaterialItem(m, pass));
    if (boqItems.length === 0) return null;
    let verified = 0;
    let mismatch = 0;
    for (const item of boqItems) {
      const res = verifyItemMakeAndModel(item);
      if (res.status === 'verified') verified += 1;
      else if (res.status === 'mismatch') mismatch += 1;
    }
    return { total: boqItems.length, verified, mismatch };
  }, [pass]);

  const unitSuffix = summary.commonUnit ? ` ${summary.commonUnit}` : '';
  const visibleItems =
    showAllItems || summary.items.length <= 3 ? summary.items : summary.items.slice(0, 3);
  const hiddenCount = Math.max(0, summary.items.length - visibleItems.length);

  const hasOverDelivery = summary.items.some((i) => i.overDeliveredQty > 0);
  const isFullyDelivered =
    summary.pendingDeliveryQty !== null && summary.pendingDeliveryQty === 0 && !summary.hasUnknownBoqTotal;

  return (
    <div
      className={`rounded-lg border border-indigo-200/90 bg-gradient-to-r from-indigo-50/70 via-white to-slate-50/80 ${
        compact ? 'px-3 py-2.5' : 'p-3.5'
      }`}
    >
      {/* Top Row: Label + 4 Core BOQ Metrics */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-2xs shrink-0">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider">
                BOQ Delivery Summary
              </span>
              <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-100/80 px-1.5 py-0.2 rounded border border-indigo-200">
                {passNumber}
              </span>
              {isFullyDelivered && (
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                  100% Completed
                </span>
              )}
              {hasOverDelivery && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-200">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>Exceeds BOQ</span>
                </span>
              )}
              {makeModelStats && makeModelStats.mismatch > 0 && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.2 rounded border border-rose-200">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  <span>Make/Model Mismatch ({makeModelStats.mismatch})</span>
                </span>
              )}
              {makeModelStats && makeModelStats.mismatch === 0 && makeModelStats.verified === makeModelStats.total && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded border border-emerald-200">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Make/Model Verified</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {summary.overallPercentDelivered !== null && (
                <>
                  <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        hasOverDelivery
                          ? 'bg-rose-500'
                          : isFullyDelivered
                            ? 'bg-emerald-500'
                            : 'bg-indigo-600'
                      }`}
                      style={{ width: `${summary.overallPercentDelivered}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-600">
                    {summary.overallPercentDelivered}% delivered
                  </span>
                </>
              )}
              {onReviewMakeModel && (
                <button
                  type="button"
                  onClick={onReviewMakeModel}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold shadow-2xs transition cursor-pointer"
                  title="Review Make & Model against official Unpriced BoQ (Annexure 2)"
                >
                  <ClipboardCheck className="w-3 h-3" />
                  <span>Review Make &amp; Model</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 4 Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1 lg:max-w-3xl">
          {/* 1. Total BOQ Items */}
          <div className="bg-white rounded-md border border-slate-200/90 px-2.5 py-1.5 shadow-2xs">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
              <Layers className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="truncate">Total BOQ Items</span>
            </div>
            <div className="mt-0.5 flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-extrabold text-slate-900 tabular-nums">
                {summary.totalBoqQty !== null
                  ? `${summary.totalBoqQty.toLocaleString()}${unitSuffix}`
                  : `${summary.totalBoqLineItems} Item${summary.totalBoqLineItems === 1 ? '' : 's'}`}
              </span>
              {summary.totalBoqQty !== null && (
                <span className="text-[10px] font-medium text-slate-500">
                  ({summary.totalBoqLineItems} item{summary.totalBoqLineItems === 1 ? '' : 's'})
                </span>
              )}
            </div>
          </div>

          {/* 2. Present Quantity Delivering */}
          <div className="bg-blue-50/70 rounded-md border border-blue-200/90 px-2.5 py-1.5 shadow-2xs">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-blue-700 uppercase tracking-wide">
              <Truck className="w-3 h-3 text-blue-600 shrink-0" />
              <span className="truncate">Present Delivering</span>
            </div>
            <div className="mt-0.5 text-sm font-extrabold text-blue-900 tabular-nums">
              {summary.presentDeliveringQty.toLocaleString()}
              {unitSuffix}
            </div>
          </div>

          {/* 3. Total Already Delivered */}
          <div className="bg-emerald-50/70 rounded-md border border-emerald-200/90 px-2.5 py-1.5 shadow-2xs">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-700 uppercase tracking-wide">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">Already Delivered</span>
            </div>
            <div className="mt-0.5 text-sm font-extrabold text-emerald-900 tabular-nums">
              {summary.alreadyDeliveredQty.toLocaleString()}
              {unitSuffix}
            </div>
          </div>

          {/* 4. Total Pending Delivery */}
          <div
            className={`rounded-md border px-2.5 py-1.5 shadow-2xs ${
              isFullyDelivered
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-amber-50/80 border-amber-200/90'
            }`}
          >
            <div
              className={`flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide ${
                isFullyDelivered ? 'text-emerald-700' : 'text-amber-800'
              }`}
            >
              <Clock
                className={`w-3 h-3 shrink-0 ${
                  isFullyDelivered ? 'text-emerald-600' : 'text-amber-600'
                }`}
              />
              <span className="truncate">Pending Delivery</span>
            </div>
            <div
              className={`mt-0.5 text-sm font-extrabold tabular-nums ${
                isFullyDelivered ? 'text-emerald-900' : 'text-amber-900'
              }`}
            >
              {summary.pendingDeliveryQty !== null
                ? `${summary.pendingDeliveryQty.toLocaleString()}${unitSuffix}`
                : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* Item-wise BOQ Breakdown Table */}
      <div className="mt-2.5 pt-2 border-t border-indigo-100/90 overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-200/80">
              <th className="py-1 pr-2 font-bold">BOQ Ref</th>
              <th className="py-1 px-2 font-bold">BOQ Item Description</th>
              <th className="py-1 px-2 text-right font-bold">Total BOQ Qty</th>
              <th className="py-1 px-2 text-right font-bold text-blue-700">Present Delivering</th>
              <th className="py-1 px-2 text-right font-bold text-emerald-700">Already Delivered</th>
              <th className="py-1 pl-2 text-right font-bold text-amber-800">Pending Delivery</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleItems.map((item) => (
              <tr key={item.key} className="hover:bg-indigo-50/30">
                <td className="py-1 pr-2 font-mono font-bold text-indigo-800 whitespace-nowrap">
                  {item.boqRef}
                </td>
                <td className="py-1 px-2 font-medium text-slate-800">
                  <span>{item.itemName}</span>
                  {item.priorPassNumbers.length > 0 && (
                    <span
                      className="ml-1.5 text-[10px] text-slate-400 font-normal"
                      title={`Prior passes: ${item.priorPassNumbers.join(', ')}`}
                    >
                      (Prior: {item.priorPassNumbers.slice(0, 2).join(', ')}
                      {item.priorPassNumbers.length > 2
                        ? ` +${item.priorPassNumbers.length - 2}`
                        : ''}
                      )
                    </span>
                  )}
                </td>
                <td className="py-1 px-2 text-right font-bold text-slate-900 whitespace-nowrap tabular-nums">
                  {item.totalBoqQty !== null ? `${item.totalBoqQty} ${item.unit}` : 'Not Set'}
                </td>
                <td className="py-1 px-2 text-right font-bold text-blue-800 whitespace-nowrap tabular-nums">
                  {item.presentDeliveringQty} {item.unit}
                </td>
                <td className="py-1 px-2 text-right font-bold text-emerald-800 whitespace-nowrap tabular-nums">
                  {item.alreadyDeliveredQty} {item.unit}
                </td>
                <td className="py-1 pl-2 text-right font-bold whitespace-nowrap tabular-nums">
                  {item.pendingDeliveryQty !== null ? (
                    <span
                      className={
                        item.overDeliveredQty > 0
                          ? 'text-rose-700'
                          : item.pendingDeliveryQty === 0
                            ? 'text-emerald-700'
                            : 'text-amber-800'
                      }
                    >
                      {item.pendingDeliveryQty} {item.unit}
                      {item.overDeliveredQty > 0 && (
                        <span className="ml-1 text-[10px] font-semibold">
                          (+{item.overDeliveredQty} excess)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {summary.items.length > 3 && (
          <div className="mt-1.5 flex justify-end">
            <button
              type="button"
              onClick={() => setShowAllItems((prev) => !prev)}
              className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition cursor-pointer"
            >
              {showAllItems ? (
                <>
                  <span>Show fewer BOQ items</span>
                  <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  <span>Show {hiddenCount} more BOQ item{hiddenCount === 1 ? '' : 's'}</span>
                  <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
