"use client";

import React, { useState } from "react";
import { useGetAdminMembersQuery, AdminMember } from "@/redux/api/adminApi";
import { useGetPlansQuery, MembershipPlan } from "@/redux/api/planApi";
import { useAdminRecordSubscriptionMutation } from "@/redux/api/subscriptionApi";
import {
  Banknote,
  CheckCircle2,
  Search,
  User,
  Layers,
  Calendar,
  AlertCircle,
  Loader2,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function OfflineCashRecorder() {
  const [searchMember, setSearchMember] = useState("");
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [recordedResult, setRecordedResult] = useState<any | null>(null);

  // Queries
  const { data: membersResponse, isLoading: membersLoading } = useGetAdminMembersQuery(
    searchMember ? { search: searchMember } : undefined
  ) as any;
  const members: AdminMember[] = membersResponse?.data?.members || [];

  const { data: plansResponse, isLoading: plansLoading } = useGetPlansQuery(undefined) as any;
  const plans: MembershipPlan[] = plansResponse?.data || [];

  // Mutation
  const [recordCashPayment, { isLoading: isRecording }] = useAdminRecordSubscriptionMutation();

  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !selectedPlanId) {
      toast.error("Please select a registered member and a membership plan");
      return;
    }

    try {
      const res = await recordCashPayment({
        userId: selectedMember.id,
        planId: selectedPlanId,
        method: "CASH",
        note: paymentNote || `Front desk cash collection by Admin`,
      }).unwrap();

      toast.success(
        `Cash payment of ৳${(selectedPlan!.price / 100).toLocaleString(
          "en-US"
        )} recorded! Membership activated.`
      );
      setRecordedResult((res as any)?.data || res);
      setSelectedMember(null);
      setSelectedPlanId("");
      setPaymentNote("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to record cash payment");
    }
  };

  return (
    <div className="space-y-6 text-white">
      {/* Header Banner */}
      <div className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Banknote className="w-5 h-5 text-[#22c55e]" />
            <span>Front Desk Cash Payment & Walk-in Activation</span>
          </h2>
          <p className="text-xs text-zinc-400 font-sans mt-0.5">
            Collect cash from walk-in members, snapshot plan pricing, and activate or stack subscriptions instantly.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#22c55e] bg-[#22c55e]/10 px-2.5 py-1 rounded-xs border border-[#22c55e]/30 w-fit">
          <ShieldCheck size={14} />
          <span>ADMIN SETTLEMENT REGISTER</span>
        </div>
      </div>

      {/* Main Grid: Form & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 bg-[#0e0e12] p-6 rounded-xs border border-white/[0.08] shadow-lg space-y-6">
          <form onSubmit={handleRecordPayment} className="space-y-6 text-xs font-mono">
            {/* 1. Step: Select Member */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                1. Select Member
              </label>

              {/* Search Bar */}
              <div className="relative mb-3">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <Input
                  value={searchMember}
                  onChange={(e) => setSearchMember(e.target.value)}
                  placeholder="Search member by name, email, or Bangladesh phone..."
                  className="pl-9 text-xs bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-500 focus-visible:ring-[#22c55e]"
                />
              </div>

              {/* Members Selection List */}
              {selectedMember ? (
                <div className="p-3 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#22c55e] text-black flex items-center justify-center font-bold text-xs">
                      {selectedMember.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{selectedMember.name}</div>
                      <div className="text-[11px] text-zinc-400">
                        {selectedMember.email} • {selectedMember.phone}
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMember(null)}
                    className="h-7 text-[11px] cursor-pointer border-white/[0.12] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
                  >
                    Change Member
                  </Button>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto border border-white/[0.08] rounded-xs divide-y divide-white/[0.08] bg-[#0b0b0d]">
                  {membersLoading ? (
                    <div className="p-4 text-center text-zinc-500">
                      <Loader2 className="w-4 h-4 animate-spin mx-auto mb-1 text-[#22c55e]" />
                      <span>Loading members...</span>
                    </div>
                  ) : members.length === 0 ? (
                    <div className="p-4 text-center text-zinc-500">
                      No members match the query
                    </div>
                  ) : (
                    members.slice(0, 6).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setSelectedMember(m)}
                        className="w-full text-left p-2.5 hover:bg-white/[0.03] flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <div>
                          <div className="font-bold text-white">{m.name}</div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            {m.email} • {m.phone}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded border border-[#22c55e]/30">
                          SELECT
                        </span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 2. Step: Choose Plan */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                2. Select Membership Plan
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  const priceBdt = (plan.price / 100).toLocaleString("en-US");

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3.5 rounded-xs border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#22c55e] bg-[#22c55e]/10 ring-1 ring-[#22c55e]"
                          : "border-white/[0.08] bg-[#0b0b0d] hover:border-white/[0.2]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{plan.name}</span>
                        <span className="font-bold text-[#22c55e]">৳ {priceBdt}</span>
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-1">
                        Validity: {plan.durationDays} days
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Step: Note & Confirm */}
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                3. Receipt Reference / Admin Note
              </label>
              <Textarea
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                placeholder="e.g. Paid in physical cash at front desk. Signed receipt #1049."
                rows={2}
                className="text-xs bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-500 focus-visible:ring-[#22c55e]"
              />
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex justify-end">
              <Button
                type="submit"
                disabled={isRecording || !selectedMember || !selectedPlanId}
                className="gap-2 text-xs font-bold bg-[#22c55e] hover:bg-[#16a34a] text-black px-5 h-9 cursor-pointer font-mono uppercase tracking-wider"
              >
                {isRecording ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Banknote className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>Record Cash & Activate Membership</span>
              </Button>
            </div>
          </form>
        </div>

        {/* Right 1 Col: Live Invoice Preview */}
        <div className="bg-[#0e0e12] p-6 rounded-xs border border-white/[0.08] shadow-lg h-fit space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
            <FileText className="w-4 h-4 text-[#22c55e]" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Cash Voucher Preview
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Member:</span>
              <span className="font-bold text-white">
                {selectedMember ? selectedMember.name : "Not selected"}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Selected Tier:</span>
              <span className="font-bold text-white">
                {selectedPlan ? selectedPlan.name : "Not selected"}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Validity:</span>
              <span className="text-zinc-300">
                {selectedPlan ? `${selectedPlan.durationDays} days` : "—"}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-white/[0.04]">
              <span className="text-zinc-400">Payment Channel:</span>
              <span className="font-mono font-semibold text-zinc-200">CASH (Physical BDT)</span>
            </div>

            <div className="flex justify-between py-1 border-b border-white/[0.08] pt-2">
              <span className="text-sm font-bold text-white">Amount Due:</span>
              <span className="text-sm font-bold text-[#22c55e] font-mono">
                {selectedPlan
                  ? `৳ ${(selectedPlan.price / 100).toLocaleString("en-US")}`
                  : "৳ 0"}
              </span>
            </div>
          </div>

          {recordedResult && (
            <div className="mt-4 p-4 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xs text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-[#22c55e] font-bold">
                <CheckCircle2 size={16} />
                <span>Transaction Recorded!</span>
              </div>
              <p className="text-[11px] text-zinc-300">
                Subscription activated with validity calibrated to 23:59:59 Asia/Dhaka time.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
