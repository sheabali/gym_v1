"use client";

import React, { useState } from "react";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetMySubscriptionsQuery } from "@/redux/api/subscriptionApi";
import {
  useGetMyBookingsQuery,
  useBookSessionMutation,
  useCancelBookingMutation,
} from "@/redux/api/bookingApi";
import { useGetClassSessionsQuery } from "@/redux/api/classApi";
import { useAppSelector } from "@/redux/hooks";
import {
  Calendar,
  Clock,
  CreditCard,
  Dumbbell,
  Loader2,
  MapPin,
  Plus,
  Shield,
  ShieldCheck,
  User,
  XCircle,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link";

export default function UserDashboardPage() {
  const token = useAppSelector((state) => state.auth.token);
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "billing">("overview");
  const [scheduleFilter, setScheduleFilter] = useState<"ALL" | "MORNING" | "FEMALE" | "COMBINED" | "PRIME">("ALL");
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);

  // API hooks
  const { data: meResponse, isLoading: meLoading } = useGetMeQuery(undefined, { skip: !token }) as any;
  const { data: subsResponse, isLoading: subsLoading } = useGetMySubscriptionsQuery(undefined, { skip: !token }) as any;
  const { data: bookingsResponse, isLoading: bookingsLoading, refetch: refetchBookings } = useGetMyBookingsQuery(undefined, { skip: !token }) as any;
  const { data: sessionsResponse, isLoading: sessionsLoading } = useGetClassSessionsQuery(undefined) as any;

  const [bookSession, { isLoading: isBooking }] = useBookSessionMutation();
  const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation();

  const user = meResponse?.data || meResponse;
  const subscriptions = subsResponse?.data || [];
  const bookings = bookingsResponse?.data || [];
  const availableSessions = sessionsResponse?.data || [];

  // Find currently active subscription
  const activeSubscription = subscriptions.find((s: any) => s.status === "ACTIVE");

  const handleBook = async (sessionId: string) => {
    try {
      await bookSession({ sessionId }).unwrap();
      toast.success("Spot reserved successfully! See you in class.");
      refetchBookings();
    } catch (err: any) {
      toast.error(err?.data?.message || "Booking failed. Please ensure you have an active membership.");
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBookingId) return;
    try {
      await cancelBooking(cancellingBookingId).unwrap();
      toast.success("Booking cancelled successfully.");
      setCancellingBookingId(null);
      refetchBookings();
    } catch (err: any) {
      toast.error(err?.data?.message || "Cancellation failed. Cutoff is 2 hours before session start.");
    }
  };

  const calculateDaysRemaining = (endDateStr?: string | null) => {
    if (!endDateStr) return 0;
    const end = new Date(endDateStr).getTime();
    const now = new Date().getTime();
    const diffDays = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (meLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#22c55e]" />
      </div>
    );
  }

  const daysRemaining = activeSubscription ? calculateDaysRemaining(activeSubscription.endDate) : 0;
  const totalDays = activeSubscription?.planDuration || 30;
  const progressPercent = Math.min(100, Math.max(5, (daysRemaining / totalDays) * 100));

  const filteredSessions = availableSessions.filter((session: any) => {
    if (scheduleFilter === "ALL") return true;
    const title = (session.classType?.name || "").toLowerCase();
    const room = (session.room || "").toLowerCase();
    const hour = new Date(session.startsAt).getHours();

    if (scheduleFilter === "MORNING") return hour >= 7 && hour < 12;
    if (scheduleFilter === "FEMALE") return hour >= 12 && hour < 16.5 || title.includes("female") || room.includes("female");
    if (scheduleFilter === "COMBINED") return hour >= 16.5 && hour < 18.5 || title.includes("combined");
    if (scheduleFilter === "PRIME") return hour >= 18.5 || title.includes("prime") || title.includes("male");
    return true;
  });

  return (
    <div className="space-y-6 container mx-auto py-2 text-white">
      {/* 1. Header Banner */}
      <div className="bg-[#0e0e12] p-6 rounded-xs border border-white/[0.08] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-xs border border-[#22c55e]/30">
              MEMBER ATHLETE
            </span>
            <span className="text-xs text-zinc-500 font-mono">• MEMBER PORTAL</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Welcome back, {user?.name || "Member"}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5 font-sans">
            Manage your active membership, book coaching sessions, and inspect payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/#pricing">
            <Button
              variant="outline"
              size="sm"
              className="text-xs font-mono uppercase tracking-wider rounded-sm border-white/[0.12] bg-white/[0.02] text-white hover:bg-white/[0.08] cursor-pointer"
            >
              Browse Plans
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={() => setActiveTab("schedule")}
            className="text-xs font-mono uppercase tracking-wider font-black rounded-sm bg-[#22c55e] hover:bg-[#16a34a] !text-black shadow-md shadow-[#22c55e]/20 cursor-pointer"
          >
            <Plus size={14} className="mr-1 stroke-[2.5]" />
            Book a Class
          </Button>
        </div>
      </div>

      {/* 2. Membership Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Active Membership Status */}
        <div className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Membership State
            </span>
            {activeSubscription ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-mono font-bold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">
                <CheckCircle2 size={13} className="text-[#22c55e]" />
                ACTIVE
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs text-[11px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertCircle size={13} className="text-amber-400" />
                NO ACTIVE PLAN
              </span>
            )}
          </div>

          <div className="my-2">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {activeSubscription ? activeSubscription.planName : "Inactive Member"}
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              {activeSubscription && activeSubscription.endDate
                ? `Expires on ${new Date(activeSubscription.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "Asia/Dhaka",
                })}`
                : "Select an official package to activate daily gym floor access."}
            </p>

            {/* Days Remaining Progress Bar */}
            {activeSubscription && (
              <div className="mt-3">
                <div className="flex justify-between text-[11px] font-mono text-zinc-400 mb-1">
                  <span>VALIDITY REMAINING</span>
                  <span className="text-[#22c55e] font-bold">{daysRemaining} DAYS</span>
                </div>
                <div className="w-full bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#22c55e] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-zinc-500 font-mono">
              {activeSubscription ? `${daysRemaining} days remaining` : "0 days left"}
            </span>
            <Link href="/#pricing" className="text-[#22c55e] font-mono uppercase tracking-wider font-bold hover:underline flex items-center gap-0.5">
              {activeSubscription ? "Renew Plan" : "Enroll Now"}
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Bookings KPI */}
        <div className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Reserved Sessions
            </span>
            <div className="p-1.5 rounded-xs bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Dumbbell size={16} />
            </div>
          </div>

          <div className="my-2">
            <h3 className="text-2xl font-black text-white tracking-tight font-mono">
              {bookings.filter((b: any) => b.status === "BOOKED").length} Active
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Upcoming class spots reserved on your schedule
            </p>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500">
              {bookings.length} historical bookings
            </span>
            <button
              onClick={() => setActiveTab("overview")}
              className="text-blue-400 font-bold hover:underline cursor-pointer uppercase tracking-wider"
            >
              View All
            </button>
          </div>
        </div>

        {/* Profile & Telemetry */}
        <div className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
              Account Telemetry
            </span>
            <div className="p-1.5 rounded-xs bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">
              <ShieldCheck size={16} />
            </div>
          </div>

          <div className="my-2 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between">
              <span className="text-zinc-500">PHONE:</span>
              <span className="font-bold text-white">{user?.phone || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">EMAIL:</span>
              <span className="font-bold text-white truncate max-w-[170px]">{user?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">COMPLIMENTARY TRIAL:</span>
              <span className={`font-bold ${user?.trialUsed ? "text-zinc-500" : "text-[#22c55e]"}`}>
                {user?.trialUsed ? "USED" : "AVAILABLE"}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono">
            <span className="text-[#22c55e] font-bold flex items-center gap-1 text-[11px]">
              <CheckCircle2 size={13} />
              VERIFIED ATHLETE
            </span>
            <span className="text-zinc-500 text-[11px]">#PG-{user?.id?.slice(-5) || "001"}</span>
          </div>
        </div>
      </div>

      {/* 3. Tabbed Navigation with Icons */}
      <div className="border-b border-white/[0.08]">
        <nav className="flex space-x-2 sm:space-x-4 text-xs font-mono uppercase tracking-wider">
          {[
            { key: "overview", label: "My Bookings", icon: Calendar },
            { key: "schedule", label: "Book a Session", icon: Dumbbell },
            { key: "billing", label: "Dues & Receipts", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-3.5 px-3 border-b-2 flex items-center gap-2 transition-all cursor-pointer font-bold ${
                  isActive
                    ? "border-[#22c55e] text-[#22c55e]"
                    : "border-transparent text-zinc-400 hover:text-white hover:border-white/20"
                }`}
              >
                <Icon size={14} className={isActive ? "text-[#22c55e]" : "text-zinc-500"} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 4. Tab Content */}
      {/* Tab A: Bookings */}
      {activeTab === "overview" && (
        <div className="bg-[#0e0e12] p-6 rounded-xs border border-white/[0.08] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">Your Reserved Class Sessions</h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">Upcoming scheduled workouts and coaching sessions</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setActiveTab("schedule")}
              className="text-xs font-mono uppercase tracking-wider rounded-sm border-white/[0.12] bg-white/[0.02] text-white hover:bg-white/[0.08] cursor-pointer"
            >
              + Reserve Another Spot
            </Button>
          </div>

          {bookingsLoading ? (
            <div className="py-8 text-center text-xs text-zinc-500 font-mono">Loading your reserved sessions...</div>
          ) : bookings.length === 0 ? (
            <div className="py-12 text-center">
              <Calendar className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">No sessions booked yet</h3>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-4 font-sans">
                You haven&apos;t reserved any class sessions yet. Browse the weekly schedule to book your spot.
              </p>
              <Button
                size="sm"
                onClick={() => setActiveTab("schedule")}
                className="bg-[#22c55e] hover:bg-[#16a34a] !text-black font-mono uppercase font-black text-xs"
              >
                Browse Available Sessions
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121217] text-zinc-400 border-b border-white/[0.08] uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Coach on Duty</th>
                    <th className="py-3 px-4">Studio / Room</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {bookings.map((booking: any) => {
                    const session = booking.session;
                    const startsAt = new Date(session.startsAt);
                    const timeStr = startsAt.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "Asia/Dhaka",
                    });
                    const dateStr = startsAt.toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      timeZone: "Asia/Dhaka",
                    });

                    return (
                      <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">
                          {session.classType?.name || "Fitness Class"}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 font-mono">
                          {dateStr} • {timeStr}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300">
                          {session.trainer?.name || "Floor Trainer"}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500 font-mono">
                          {session.room || "Main Studio"}
                        </td>
                        <td className="py-3.5 px-4">
                          {booking.status === "BOOKED" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">
                              BOOKED
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono font-medium bg-white/[0.04] text-zinc-400">
                              {booking.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {booking.status === "BOOKED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCancellingBookingId(booking.id)}
                              className="text-xs font-mono uppercase text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7 px-2 cursor-pointer rounded-sm"
                            >
                              <XCircle size={13} className="mr-1" />
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab B: Available Schedule */}
      {activeTab === "schedule" && (
        <div className="bg-[#0e0e12] p-6 rounded-xs border border-white/[0.08] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">Scheduled Classes & Sessions</h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">
                Reserve your coaching slot. Sessions maintain strict capacity limits.
              </p>
            </div>

            {/* Shift Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 p-0.5 bg-[#121216] border border-white/[0.08] rounded-xs font-mono text-[11px]">
              {(["ALL", "MORNING", "FEMALE", "COMBINED", "PRIME"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setScheduleFilter(filter)}
                  className={`px-2.5 py-1 rounded-sm uppercase tracking-wider transition-all cursor-pointer ${
                    scheduleFilter === filter
                      ? "bg-[#22c55e] !text-black font-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {sessionsLoading ? (
            <div className="py-8 text-center text-xs text-zinc-500 font-mono">Loading scheduled sessions...</div>
          ) : filteredSessions.length === 0 ? (
            <div className="py-8 text-center text-xs text-zinc-500 font-mono">
              No sessions found matching this shift filter. Please select another slot.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session: any) => {
                const startsAt = new Date(session.startsAt);
                const timeStr = startsAt.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Dhaka",
                });
                const dateStr = startsAt.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  timeZone: "Asia/Dhaka",
                });
                const availableSeats = session.capacity - session.bookedCount;
                const isAlreadyBooked = bookings.some(
                  (b: any) => b.sessionId === session.id && b.status === "BOOKED"
                );

                return (
                  <div
                    key={session.id}
                    className="p-4 rounded-xs border border-white/[0.08] bg-[#121216] flex flex-col justify-between hover:border-white/20 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-mono">
                        <span>{dateStr}</span>
                        <span className="font-bold text-[#22c55e]">{timeStr}</span>
                      </div>

                      <h3 className="text-sm font-bold text-white mb-1">
                        {session.classType?.name || "Fitness Class"}
                      </h3>

                      <p className="text-xs text-zinc-400 mb-3 font-sans">
                        Coach: {session.trainer?.name || "Floor Specialist"} • {session.room || "Studio 1"}
                      </p>

                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-xs font-mono text-[10px] font-bold ${
                          availableSeats > 0 ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30" : "bg-red-500/10 text-red-400 border border-red-500/30"
                        }`}>
                          {availableSeats > 0 ? `${availableSeats} SPOTS LEFT` : "SESSION FULL"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06]">
                      {isAlreadyBooked ? (
                        <Button
                          disabled
                          size="sm"
                          className="w-full text-xs font-mono uppercase font-bold bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30"
                        >
                          <CheckCircle2 size={13} className="mr-1" />
                          Reserved
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleBook(session.id)}
                          disabled={availableSeats <= 0 || isBooking}
                          className="w-full text-xs font-mono uppercase tracking-wider font-black bg-[#22c55e] hover:bg-[#16a34a] !text-black cursor-pointer shadow-md shadow-[#22c55e]/20"
                        >
                          {availableSeats <= 0 ? "Session Full" : "Book Spot"}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab C: Billing & Invoices */}
      {activeTab === "billing" && (
        <div className="bg-[#0e0e12] p-6 rounded-xs border border-white/[0.08] shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-tight">Subscription Invoices & Receipts</h2>
              <p className="text-xs text-zinc-400 font-sans mt-0.5">Verified record of membership dues and transactions</p>
            </div>
            <Link href="/#pricing">
              <Button size="sm" className="text-xs font-mono uppercase tracking-wider font-black bg-[#22c55e] hover:bg-[#16a34a] !text-black">
                New Subscription
              </Button>
            </Link>
          </div>

          {subsLoading ? (
            <div className="py-8 text-center text-xs text-zinc-500 font-mono">Loading payment history...</div>
          ) : subscriptions.length === 0 ? (
            <div className="py-10 text-center">
              <CreditCard className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-white">No past subscriptions found</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-4 font-sans">
                You have not initiated or activated any subscriptions yet.
              </p>
              <Link href="/#pricing">
                <Button size="sm" className="bg-[#22c55e] !text-black font-mono uppercase font-black text-xs">
                  View Official Rate Card
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121217] text-zinc-400 border-b border-white/[0.08] uppercase text-[10px] font-mono tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Plan Package</th>
                    <th className="py-3 px-4">Amount Paid</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Activation Date</th>
                    <th className="py-3 px-4">Expiration Date</th>
                    <th className="py-3 px-4">Invoiced On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.05]">
                  {subscriptions.map((sub: any) => {
                    const priceBdt = sub.pricePaid / 100;
                    const createdDate = new Date(sub.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const startDate = sub.startDate
                      ? new Date(sub.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      : "Pending Payment";
                    const endDate = sub.endDate
                      ? new Date(sub.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                      : "N/A";

                    return (
                      <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white">{sub.planName}</td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#22c55e]">
                          ৳{priceBdt.toLocaleString("en-US")}
                        </td>
                        <td className="py-3.5 px-4">
                          {sub.status === "ACTIVE" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/30">
                              ACTIVE
                            </span>
                          ) : sub.status === "PENDING" ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                              PENDING
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-xs text-[10px] font-mono font-medium bg-white/[0.04] text-zinc-400">
                              {sub.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-300 font-mono">{startDate}</td>
                        <td className="py-3.5 px-4 text-zinc-300 font-mono">{endDate}</td>
                        <td className="py-3.5 px-4 text-zinc-500 font-mono">{createdDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e12] border border-white/[0.1] p-6 max-w-md w-full rounded-xs shadow-2xl text-white space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <AlertCircle size={20} />
              <h4 className="font-bold uppercase tracking-tight text-white">Confirm Booking Cancellation</h4>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Are you sure you want to cancel this class reservation? Note: Cancellations must be submitted at least 2 hours prior to the session start time.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCancellingBookingId(null)}
                className="text-xs font-mono uppercase tracking-wider rounded-sm border-white/[0.12] bg-white/[0.02] text-white hover:bg-white/[0.08]"
              >
                Keep Booking
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="text-xs font-mono uppercase tracking-wider font-bold bg-red-600 hover:bg-red-700 text-white rounded-sm"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
