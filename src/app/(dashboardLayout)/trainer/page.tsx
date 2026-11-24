"use client";

import React, { useState } from "react";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetClassSessionsQuery, ClassSession } from "@/redux/api/classApi";
import {
  useGetSessionRosterQuery,
  useMarkAttendanceMutation,
  RosterAttendee,
} from "@/redux/api/bookingApi";
import { useUpdateMyProfileMutation } from "@/redux/api/trainerApi";
import { useAppSelector } from "@/redux/hooks";
import {
  Calendar,
  Clock,
  Dumbbell,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  MapPin,
  Sparkles,
  UserCheck,
  ShieldCheck,
  Edit3,
  Save,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function TrainerDashboardPage() {
  const token = useAppSelector((state) => state.auth.token);
  const [activeTab, setActiveTab] = useState<"classes" | "profile">("classes");
  const [filterState, setFilterState] = useState<"ALL" | "TODAY" | "UPCOMING">("ALL");

  // Selected session for roster attendance inspection
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [rosterModalOpen, setRosterModalOpen] = useState(false);

  // Queries
  const { data: meResponse, isLoading: meLoading } = useGetMeQuery(undefined, {
    skip: !token,
  }) as any;
  const user = meResponse?.data || meResponse;

  const { data: sessionsResponse, isLoading: sessionsLoading } = useGetClassSessionsQuery(
    undefined,
    { skip: !token }
  ) as any;
  const allSessions: ClassSession[] = sessionsResponse?.data || [];

  // Filter sessions assigned to this trainer (or show all if admin)
  const mySessions = allSessions.filter((s) => {
    if (!user) return false;
    if (user.role === "ADMIN") return true;
    return s.trainerId === user.id;
  });

  // Filter logic: Today, Upcoming, All
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const filteredSessions = mySessions.filter((s) => {
    const sessionDate = new Date(s.startsAt).toISOString().split("T")[0];
    if (filterState === "TODAY") {
      return sessionDate === todayStr;
    }
    if (filterState === "UPCOMING") {
      return new Date(s.startsAt) >= now;
    }
    return true;
  });

  // Roster query for the selected session
  const {
    data: rosterResponse,
    isLoading: rosterLoading,
    refetch: refetchRoster,
  } = useGetSessionRosterQuery(selectedSession?.id || "", {
    skip: !selectedSession?.id || !rosterModalOpen,
  }) as any;
  const roster: RosterAttendee[] = rosterResponse?.data || [];

  // Attendance mutation
  const [markAttendance, { isLoading: isMarking }] = useMarkAttendanceMutation();

  // Profile update mutation
  const [updateMyProfile, { isLoading: isUpdatingProfile }] = useUpdateMyProfileMutation();
  const [bioInput, setBioInput] = useState<string>("");
  const [specialtiesInput, setSpecialtiesInput] = useState<string>("");
  const [certificationsInput, setCertificationsInput] = useState<string>("");
  const [profileInitialized, setProfileInitialized] = useState(false);

  // Populate profile form when user data loads
  React.useEffect(() => {
    if (user?.trainerProfile && !profileInitialized) {
      setBioInput(user.trainerProfile.bio || "");
      setSpecialtiesInput((user.trainerProfile.specialties || []).join(", "));
      setCertificationsInput((user.trainerProfile.certifications || []).join(", "));
      setProfileInitialized(true);
    }
  }, [user, profileInitialized]);

  const handleOpenRoster = (session: ClassSession) => {
    setSelectedSession(session);
    setRosterModalOpen(true);
  };

  const handleMarkStatus = async (
    bookingId: string,
    newStatus: "ATTENDED" | "NO_SHOW"
  ) => {
    try {
      await markAttendance({ bookingId, status: newStatus }).unwrap();
      toast.success(
        newStatus === "ATTENDED"
          ? "Attendance marked as ATTENDED"
          : "Attendance recorded as NO_SHOW"
      );
      refetchRoster();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update attendance");
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const specialties = specialtiesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const certifications = certificationsInput
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      await updateMyProfile({
        bio: bioInput,
        specialties,
        certifications,
      }).unwrap();

      toast.success("Trainer profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (meLoading || sessionsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Calculate quick metrics
  const totalAssignedSessions = mySessions.length;
  const todaySessionsCount = mySessions.filter(
    (s) => new Date(s.startsAt).toISOString().split("T")[0] === todayStr
  ).length;
  const totalBookedAttendees = mySessions.reduce((acc, s) => acc + (s.bookedCount || 0), 0);

  return (
    <div className="space-y-6 container mx-auto py-2 text-white">
      {/* 1. Header Banner */}
      <div className="bg-[#0e0e12] p-6 rounded-xs border border-white/[0.08] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded-xs border border-[#22c55e]/30">
              FACULTY PORTAL
            </span>
            <span className="text-xs text-zinc-500 font-mono">• TRAINER HUB</span>
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">
            Coach {user?.name || "Trainer"}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-sans">
            Manage your scheduled sessions, inspect confirmed member rosters, and record attendance.
          </p>
        </div>

        {/* Tab Switcher Controls */}
        <div className="flex items-center gap-1.5 bg-[#121216] p-1 rounded-xs border border-white/[0.08] text-xs font-mono">
          <button
            onClick={() => setActiveTab("classes")}
            className={`px-3 py-1.5 uppercase tracking-wider font-bold rounded-sm transition-all cursor-pointer text-[11px] ${
              activeTab === "classes"
                ? "bg-[#22c55e] !text-black shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Sessions & Roster
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-3 py-1.5 uppercase tracking-wider font-bold rounded-sm transition-all cursor-pointer text-[11px] ${
              activeTab === "profile"
                ? "bg-[#22c55e] !text-black shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Faculty Profile
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              Today&apos;s Sessions
            </span>
            <Clock className="w-4 h-4 text-[#22c55e]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {todaySessionsCount}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Scheduled for today</p>
        </div>

        <div className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              Total Enrolled Members
            </span>
            <Users className="w-4 h-4 text-[#22c55e]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {totalBookedAttendees}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Across all your active classes</p>
        </div>

        <div className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider font-mono">
              Total Sessions Taught
            </span>
            <Dumbbell className="w-4 h-4 text-[#22c55e]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-white font-mono">
            {totalAssignedSessions}
          </div>
          <p className="text-xs text-zinc-500 mt-1">Assigned roster history</p>
        </div>
      </div>

      {/* 3. Main Content Body */}
      {activeTab === "classes" ? (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e0e12] p-4 rounded-xs border border-white/[0.08] shadow-lg">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Dumbbell className="w-4 h-4 text-[#22c55e]" />
              <span>Assigned Training Sessions</span>
            </div>

            <div className="inline-flex items-center p-0.5 bg-[#0b0b0d] rounded-xs border border-white/[0.1] text-xs font-medium">
              {(["ALL", "TODAY", "UPCOMING"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setFilterState(filter)}
                  className={`px-3 py-1 rounded-sm transition-all cursor-pointer font-mono uppercase text-[11px] ${
                    filterState === filter
                      ? "bg-[#22c55e] text-black shadow-xs font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {filter === "ALL" ? "All Sessions" : filter === "TODAY" ? "Today" : "Upcoming"}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions Grid */}
          {filteredSessions.length === 0 ? (
            <div className="bg-[#0e0e12] p-12 text-center rounded-xs border border-white/[0.08] shadow-lg">
              <Dumbbell className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No sessions found</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                No classes match the selected filter. As an administrator schedules training sessions under your instructor profile, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSessions.map((session) => {
                const starts = new Date(session.startsAt);
                const ends = new Date(session.endsAt);
                const capacityPercentage = Math.round(
                  ((session.bookedCount || 0) / (session.capacity || 1)) * 100
                );
                const isFull = (session.bookedCount || 0) >= session.capacity;
                const isCancelled = session.status === "CANCELLED";

                return (
                  <div
                    key={session.id}
                    className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg flex flex-col justify-between hover:border-[#22c55e]/50 transition-all"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded border border-[#22c55e]/30">
                          {session.classType?.difficulty || "ALL LEVELS"}
                        </span>
                        <Badge
                          variant={
                            isCancelled
                              ? "destructive"
                              : session.status === "COMPLETED"
                              ? "secondary"
                              : "default"
                          }
                          className={`text-[10px] font-mono ${
                            !isCancelled && session.status !== "COMPLETED"
                              ? "bg-[#22c55e] text-black font-bold"
                              : session.status === "COMPLETED"
                              ? "bg-white/[0.08] text-zinc-400"
                              : ""
                          }`}
                        >
                          {session.status}
                        </Badge>
                      </div>

                      <h3 className="text-base font-bold text-white">
                        {session.classType?.name || "Fitness Class"}
                      </h3>

                      <div className="space-y-1.5 mt-3 text-xs text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#22c55e]" />
                          <span>
                            {starts.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#22c55e]" />
                          <span>
                            {starts.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {ends.toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#22c55e]" />
                          <span>{session.room || "Studio 1, Main Floor"}</span>
                        </div>
                      </div>

                      {/* Capacity Progress */}
                      <div className="mt-4 pt-3 border-t border-white/[0.08]">
                        <div className="flex items-center justify-between text-xs mb-1 font-mono">
                          <span className="text-zinc-400">Attendee Roster</span>
                          <span className="font-bold text-white">
                            {session.bookedCount || 0} / {session.capacity} spots
                          </span>
                        </div>
                        <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isFull ? "bg-rose-500" : "bg-[#22c55e]"
                            }`}
                            style={{ width: `${Math.min(100, capacityPercentage)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleOpenRoster(session)}
                      className="mt-5 w-full gap-2 text-xs font-bold font-mono uppercase tracking-wider bg-[#22c55e] hover:bg-[#16a34a] text-black transition-colors cursor-pointer rounded-sm"
                    >
                      <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Inspect Roster & Attendance</span>
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Trainer Profile Management */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-[#0e0e12] p-6 rounded-xs border border-white/[0.08] shadow-lg">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08] mb-6">
              <Edit3 className="w-4 h-4 text-[#22c55e]" />
              <h2 className="text-base font-bold text-white">
                Edit Public Trainer Profile
              </h2>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  Professional Bio
                </label>
                <Textarea
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  placeholder="Share your coaching philosophy, athletic background, and experience..."
                  rows={4}
                  className="text-xs bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-500 focus-visible:ring-[#22c55e]"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  This bio is featured on the public website coaches directory.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  Specialties (Comma Separated)
                </label>
                <Input
                  value={specialtiesInput}
                  onChange={(e) => setSpecialtiesInput(e.target.value)}
                  placeholder="e.g. Strength & Conditioning, HIIT, Hypertrophy, Mobility"
                  className="text-xs bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-500 focus-visible:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                  Certifications (Comma Separated)
                </label>
                <Input
                  value={certificationsInput}
                  onChange={(e) => setCertificationsInput(e.target.value)}
                  placeholder="e.g. CSCS, ACE Certified Personal Trainer, CPR/AED"
                  className="text-xs bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-500 focus-visible:ring-[#22c55e]"
                />
              </div>

              <div className="pt-3 border-t border-white/[0.08] flex justify-end">
                <Button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="gap-2 text-xs font-bold font-mono uppercase tracking-wider bg-[#22c55e] hover:bg-[#16a34a] text-black cursor-pointer rounded-sm"
                >
                  {isUpdatingProfile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                  <span>Save Profile Changes</span>
                </Button>
              </div>
            </form>
          </div>

          {/* Profile Preview Card */}
          <div className="bg-[#0e0e12] p-6 rounded-xs border border-white/[0.08] shadow-lg h-fit">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4 font-mono">
              Directory Preview
            </h3>
            <div className="border border-[#22c55e]/30 bg-[#22c55e]/5 p-5 rounded-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22c55e]">
                  Certified Instructor
                </span>
              </div>
              <h4 className="text-lg font-bold text-white">{user?.name}</h4>
              <p className="text-xs text-zinc-300 italic">
                {bioInput || "No bio published yet. Add your philosophy to help members connect."}
              </p>

              <div className="pt-2">
                <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-1 font-mono">
                  Focus Disciplines
                </span>
                <div className="flex flex-wrap gap-1">
                  {specialtiesInput
                    ? specialtiesInput.split(",").map((s, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white/[0.04] text-zinc-200 border border-white/[0.08] px-2 py-0.5 rounded font-mono"
                        >
                          {s.trim()}
                        </span>
                      ))
                    : <span className="text-xs text-zinc-500">None specified</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Session Roster & Attendance Modal */}
      <Dialog open={rosterModalOpen} onOpenChange={setRosterModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-[#0e0e12] border-white/[0.08] text-white">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded border border-[#22c55e]/30">
                {selectedSession?.classType?.name}
              </span>
              <span className="text-xs text-zinc-400">
                • {selectedSession?.room || "Studio 1"}
              </span>
            </div>
            <DialogTitle className="text-lg font-bold text-white">
              Class Session Attendee Roster
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              {selectedSession &&
                new Date(selectedSession.startsAt).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
              • Total Booked: {roster.length} / {selectedSession?.capacity}
            </DialogDescription>
          </DialogHeader>

          {rosterLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#22c55e]" />
            </div>
          ) : roster.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              <Users className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-white">
                No members booked for this session yet
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Members will appear here once they reserve a spot through their portal.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-white/[0.08] rounded-xs mt-2">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Member</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Attendance Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {roster.map((booking) => {
                    const isAttended = booking.status === "ATTENDED";
                    const isNoShow = booking.status === "NO_SHOW";
                    const isCancelled = booking.status === "CANCELLED";

                    return (
                      <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-white">
                            {booking.user?.name || "Member"}
                          </div>
                          <div className="text-[10px] text-zinc-400 font-mono">
                            Booked:{" "}
                            {new Date(booking.bookedAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-zinc-300">
                          <div>{booking.user?.email}</div>
                          <div className="text-[11px] text-zinc-400">
                            {booking.user?.phone || "N/A"}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              isAttended
                                ? "bg-[#22c55e]/15 text-[#22c55e] border border-[#22c55e]/30"
                                : isNoShow
                                ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                                : isCancelled
                                ? "bg-white/[0.06] text-zinc-400 border border-white/[0.08]"
                                : "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          {isCancelled ? (
                            <span className="text-[11px] text-zinc-500 italic">
                              Cancelled
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                disabled={isMarking || isAttended}
                                onClick={() => handleMarkStatus(booking.id, "ATTENDED")}
                                className={`h-7 px-2.5 text-[11px] font-semibold gap-1 rounded-sm cursor-pointer font-mono uppercase ${
                                  isAttended
                                    ? "bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/30 hover:bg-[#22c55e]/20"
                                    : "bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold"
                                }`}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                <span>{isAttended ? "Attended" : "Mark Present"}</span>
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isMarking || isNoShow}
                                onClick={() => handleMarkStatus(booking.id, "NO_SHOW")}
                                className={`h-7 px-2.5 text-[11px] font-semibold gap-1 rounded-sm cursor-pointer font-mono uppercase ${
                                  isNoShow
                                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20"
                                    : "border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                                }`}
                              >
                                <XCircle className="w-3 h-3" />
                                <span>{isNoShow ? "No-Show" : "No-Show"}</span>
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
