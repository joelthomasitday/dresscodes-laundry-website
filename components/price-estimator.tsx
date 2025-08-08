"use client";

import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const PRICES = {
  washIronPerKg: 140,
  washIronPerPiece: 30,
  ironingOnly: 20,
} as const;

export type ServiceKey = keyof typeof PRICES;

const SERVICE_LABELS: Record<ServiceKey, string> = {
  washIronPerKg: "Washing + Ironing (per kg)",
  washIronPerPiece: "Washing + Ironing (per piece)",
  ironingOnly: "Ironing only (per piece)",
};

export function PriceEstimator() {
  const [service, setService] = useState<ServiceKey>("washIronPerKg");
  const [amountInput, setAmountInput] = useState<string>("");

  const isPerKg = service === "washIronPerKg";

  const estimatedPrice = useMemo(() => {
    if (amountInput.trim() === "") return 0;

    const parsed = isPerKg
      ? parseFloat(amountInput)
      : parseInt(amountInput, 10);
    if (isNaN(parsed) || parsed <= 0) return 0;

    const unitPrice = PRICES[service];
    return Math.round(parsed * unitPrice);
  }, [amountInput, isPerKg, service]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="serviceType">Service Type</Label>
          <Select
            value={service}
            onValueChange={(v) => setService(v as ServiceKey)}
          >
            <SelectTrigger id="serviceType">
              <SelectValue placeholder="Select a service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="washIronPerKg">
                {SERVICE_LABELS.washIronPerKg}
              </SelectItem>
              <SelectItem value="washIronPerPiece">
                {SERVICE_LABELS.washIronPerPiece}
              </SelectItem>
              <SelectItem value="ironingOnly">
                {SERVICE_LABELS.ironingOnly}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount" className="whitespace-nowrap">
            {isPerKg ? "Weight (kg)" : "Quantity"}
          </Label>
          <Input
            id="amount"
            type="number"
            inputMode="decimal"
            step={isPerKg ? "0.1" : "1"}
            min={0}
            placeholder={isPerKg ? "e.g., 3.5" : "e.g., 12"}
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <p className="text-sm font-medium text-emerald-700">Estimated Price</p>
        <p className="mt-1 text-3xl font-bold text-emerald-900">
          ₹{estimatedPrice}
        </p>
      </div>

      <p className="text-xs text-gray-500">
        If the weight/quantity is empty or 0, the estimate shows ₹0. Final price
        may vary after inspection.
      </p>
    </div>
  );
}

export default PriceEstimator;
