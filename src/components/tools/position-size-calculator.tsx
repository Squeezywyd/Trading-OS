"use client";

import * as React from "react";
import { INSTRUMENTS, CONTRACT_POINT_VALUES, type Instrument } from "@/lib/constants/enums";
import { calcPositionSize, calcRiskUsd } from "@/lib/trading/risk";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";

export function PositionSizeCalculator() {
  const [instrument, setInstrument] = React.useState<Instrument>("MNQ");
  const [riskBudget, setRiskBudget] = React.useState("100");
  const [stopPoints, setStopPoints] = React.useState("10");

  const pointValue = CONTRACT_POINT_VALUES[instrument];
  const riskBudgetNum = Number(riskBudget) || 0;
  const stopPointsNum = Number(stopPoints) || 0;

  const contracts = calcPositionSize({
    instrument,
    riskBudgetUsd: riskBudgetNum,
    stopDistancePoints: stopPointsNum,
  });

  const actualRisk =
    contracts != null
      ? calcRiskUsd({ instrument, contracts, entryPrice: 0, stopPrice: stopPointsNum })
      : null;

  return (
    <div className="glass-panel space-y-4 p-5">
      <p className="label-muted">Position Size Calculator</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field>
          <FieldLabel>Instrument</FieldLabel>
          <FieldContent>
            <Select value={instrument} onValueChange={(v) => setInstrument(v as Instrument)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INSTRUMENTS.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="risk-budget">Risk budget ($)</FieldLabel>
          <FieldContent>
            <Input
              id="risk-budget"
              type="number"
              className="font-mono tabular-nums"
              value={riskBudget}
              onChange={(e) => setRiskBudget(e.target.value)}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="stop-points">Stop distance (points)</FieldLabel>
          <FieldContent>
            <Input
              id="stop-points"
              type="number"
              className="font-mono tabular-nums"
              value={stopPoints}
              onChange={(e) => setStopPoints(e.target.value)}
            />
          </FieldContent>
        </Field>
      </div>

      <div className="glass-panel-flat flex items-center justify-between p-4">
        {pointValue == null ? (
          <p className="text-muted-foreground text-sm">
            {instrument} has no fixed point value — size manually.
          </p>
        ) : contracts == null || contracts === 0 ? (
          <p className="text-muted-foreground text-sm">Enter a risk budget and stop distance</p>
        ) : (
          <>
            <div>
              <p className="label-muted">Max contracts</p>
              <p className="font-mono text-2xl font-semibold tabular-nums">{contracts}</p>
            </div>
            <div className="text-right">
              <p className="label-muted">Actual risk</p>
              <p className="font-mono text-sm tabular-nums">${actualRisk?.toFixed(2)}</p>
              <p className="text-muted-foreground text-xs">
                ${pointValue}/pt × {stopPointsNum}pt × {contracts}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
