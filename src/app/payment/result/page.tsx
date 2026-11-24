"use client";

import React, { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetPaymentStatusQuery } from "@/redux/api/paymentApi";
import { useAppSelector } from "@/redux/hooks";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  RefreshCw,
  Home,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = useAppSelector((state) => state.auth.token);

  const tranId = searchParams.get("tran_id") || "";
  const paramStatus = searchParams.get("status") || "";

  const {
    data: paymentResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetPaymentStatusQuery(tranId, {
    skip: !tranId || !token,
  }) as any;

  const payment = paymentResponse?.data;
  // If payment status query resolved, use the verified DB status; otherwise fallback to URL indication
  const verifiedStatus = payment?.status || (paramStatus === "success" ? "SUCCESS" : paramStatus === "fail" ? "FAILED" : "CANCELLED");

  const isSuccess = verifiedStatus === "SUCCESS";
  const isFailed = verifiedStatus === "FAILED";
  const isCancelled = verifiedStatus === "CANCELLED";

  if (!tranId) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-xs p-8 text-center shadow-xs">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900">Missing Transaction Reference</h2>
          <p className="text-xs text-gray-500 mt-2">
            No transaction ID was provided in the return URL. If you completed a payment, please check your Member Portal billing history.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              onClick={() => router.push("/user")}
              className="text-xs bg-gray-900 text-white"
            >
              Go to Member Portal
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="text-xs"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <h2 className="text-base font-bold text-gray-900">Verifying Payment With Gateway...</h2>
        <p className="text-xs text-gray-500 mt-1">
          Validating transaction <span className="font-mono text-gray-700">{tranId}</span> directly against SSLCommerz records.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-gray-50/50">
      <div className="max-w-lg w-full bg-white border border-gray-200/90 rounded-xs shadow-sm overflow-hidden">
        {/* Status Header Banner */}
        <div
          className={`p-6 text-center text-white ${
            isSuccess
              ? "bg-gradient-to-br from-emerald-600 to-emerald-800"
              : isFailed
              ? "bg-gradient-to-br from-rose-600 to-rose-800"
              : "bg-gradient-to-br from-gray-700 to-gray-900"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="w-14 h-14 mx-auto mb-2 text-white/95" />
          ) : isFailed ? (
            <XCircle className="w-14 h-14 mx-auto mb-2 text-white/95" />
          ) : (
            <AlertTriangle className="w-14 h-14 mx-auto mb-2 text-white/95" />
          )}

          <h1 className="text-xl font-bold tracking-tight">
            {isSuccess
              ? "Payment Successful & Membership Activated"
              : isFailed
              ? "Payment Processing Failed"
              : "Payment Cancelled"}
          </h1>
          <p className="text-xs text-white/80 mt-1 font-mono">
            Tran ID: {tranId}
          </p>
        </div>

        {/* Verification Summary Body */}
        <div className="p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs">
            <span className="text-gray-500">Security Verification</span>
            <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              ORDER VALIDATED
            </span>
          </div>

          {/* Details Table */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Membership Tier</span>
              <span className="font-bold text-gray-900">
                {payment?.subscription?.planName || "Pro Membership"}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold text-gray-900">
                {payment?.amount
                  ? `BDT ${(payment.amount / 100).toLocaleString("en-US")}`
                  : "N/A"}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-500">Payment Channel</span>
              <span className="font-mono text-gray-700">
                {payment?.cardBrand || payment?.cardType || payment?.method || "SSLCommerz Hosted"}
              </span>
            </div>

            {payment?.paidAt && (
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Settled Timestamp</span>
                <span className="text-gray-700 font-mono">
                  {new Date(payment.paidAt).toLocaleString("en-US", {
                    timeZone: "Asia/Dhaka",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}{" "}
                  (Dhaka)
                </span>
              </div>
            )}

            <div className="flex justify-between py-1">
              <span className="text-gray-500">Gateway Status</span>
              <span
                className={`font-mono font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                  isSuccess
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {verifiedStatus}
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-2.5">
            {isSuccess ? (
              <Button
                onClick={() => router.push("/user")}
                className="w-full gap-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
              >
                <span>Enter Member Portal & Book Classes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <div className="space-y-2">
                <Button
                  onClick={() => router.push("/#pricing")}
                  className="w-full gap-2 text-xs font-semibold bg-gray-900 hover:bg-emerald-600 text-white cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Purchasing Again</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/#contact")}
                  className="w-full text-xs text-gray-700 cursor-pointer"
                >
                  Contact Gym Helpdesk
                </Button>
              </div>
            )}

            <Link
              href="/"
              className="text-center text-xs text-gray-500 hover:text-gray-900 py-1"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <PaymentResultContent />
    </Suspense>
  );
}
