"use client";

import React, { useState } from "react";
import {
  useGetTrainersQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  TrainerProfile,
} from "@/redux/api/trainerApi";
import {
  Users,
  Plus,
  Edit2,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  Loader2,
  Sparkles,
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

export default function TrainersManager() {
  const { data: trainersResponse, isLoading, refetch } = useGetTrainersQuery(undefined) as any;
  const trainers: TrainerProfile[] = trainersResponse?.data || [];

  const [createTrainer, { isLoading: isCreating }] = useCreateTrainerMutation();
  const [updateTrainer, { isLoading: isUpdating }] = useUpdateTrainerMutation();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerProfile | null>(null);

  // Form State: New Trainer
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [specialtiesInput, setSpecialtiesInput] = useState("");
  const [certificationsInput, setCertificationsInput] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setBio("");
    setSpecialtiesInput("");
    setCertificationsInput("");
    setIsPublic(true);
    setSelectedTrainer(null);
  };

  const handleOpenEdit = (trainer: TrainerProfile) => {
    setSelectedTrainer(trainer);
    setBio(trainer.bio || "");
    setSpecialtiesInput((trainer.specialties || []).join(", "));
    setCertificationsInput((trainer.certifications || []).join(", "));
    setIsPublic(trainer.isPublic);
    setEditModalOpen(true);
  };

  const handleCreateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error("Please fill in required fields (Name, Email, Phone, Password)");
      return;
    }

    const specialties = specialtiesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const certifications = certificationsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      await createTrainer({
        name,
        email,
        phone,
        password,
        bio,
        specialties,
        certifications,
        isPublic,
      }).unwrap();

      toast.success(`Trainer account for ${name} created successfully`);
      setAddModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create trainer account");
    }
  };

  const handleUpdateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainer) return;

    const specialties = specialtiesInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const certifications = certificationsInput
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      await updateTrainer({
        id: selectedTrainer.userId,
        bio,
        specialties,
        certifications,
        isPublic,
      }).unwrap();

      toast.success(`Trainer profile updated successfully`);
      setEditModalOpen(false);
      resetForm();
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update trainer profile");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0e0e12] p-4 rounded-xs border border-white/[0.08] shadow-lg">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#22c55e]" />
            <span>Trainers & Coaching Staff Directory</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Manage fitness coach accounts, assign credentials, and curate public specialties.
          </p>
        </div>

        <Button
          onClick={() => {
            resetForm();
            setAddModalOpen(true);
          }}
          size="sm"
          className="gap-1.5 text-xs font-semibold bg-[#22c55e] hover:bg-[#16a34a] text-black font-black uppercase font-mono tracking-wider cursor-pointer rounded-sm"
        >
          <Plus size={14} className="stroke-[2.5]" />
          <span>Onboard New Trainer</span>
        </Button>
      </div>

      {/* Trainers Cards Grid */}
      {isLoading ? (
        <div className="flex h-48 items-center justify-center bg-[#0e0e12] rounded-xs border border-white/[0.08]">
          <Loader2 className="w-6 h-6 animate-spin text-[#22c55e]" />
        </div>
      ) : trainers.length === 0 ? (
        <div className="bg-[#0e0e12] p-12 text-center rounded-xs border border-white/[0.08] shadow-lg">
          <Users className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-white">No trainers registered yet</p>
          <Button
            onClick={() => {
              resetForm();
              setAddModalOpen(true);
            }}
            size="sm"
            className="mt-3 text-xs bg-[#22c55e] text-black font-bold hover:bg-[#16a34a]"
          >
            Onboard First Coach
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trainers.map((t) => (
            <div
              key={t.id}
              className="bg-[#0e0e12] p-5 rounded-xs border border-white/[0.08] shadow-lg flex flex-col justify-between hover:border-[#22c55e]/50 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22c55e] bg-[#22c55e]/10 px-2 py-0.5 rounded border border-[#22c55e]/30">
                      TRAINER ACCOUNT
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {t.user?.name || "Coach"}
                    </h3>
                  </div>
                  <Badge
                    variant={t.isPublic ? "default" : "secondary"}
                    className={t.isPublic ? "text-[10px] bg-[#22c55e] text-black font-bold" : "text-[10px] bg-white/[0.06] text-zinc-400"}
                  >
                    {t.isPublic ? "PUBLIC" : "PRIVATE"}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-zinc-400 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Mail size={12} className="text-zinc-500" />
                    <span className="text-zinc-300">{t.user?.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone size={12} className="text-zinc-500" />
                    <span className="text-zinc-300">{t.user?.phone || "N/A"}</span>
                  </div>
                </div>

                {t.bio && (
                  <p className="text-xs text-zinc-400 line-clamp-2 italic mb-3">
                    &quot;{t.bio}&quot;
                  </p>
                )}

                {/* Specialties */}
                <div className="space-y-1 mb-3">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase block font-mono">
                    Specialties
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {(t.specialties || []).map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-white/[0.04] text-zinc-300 border border-white/[0.08] px-1.5 py-0.5 rounded font-mono"
                      >
                        {spec}
                      </span>
                    ))}
                    {(t.specialties || []).length === 0 && (
                      <span className="text-xs text-zinc-500 italic">None specified</span>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                {(t.certifications || []).length > 0 && (
                  <div className="flex items-center gap-1 text-[11px] text-[#22c55e] font-mono">
                    <Award size={13} />
                    <span>{t.certifications.length} certifications recorded</span>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-3 border-t border-white/[0.08] flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenEdit(t)}
                  className="h-7 px-2.5 text-xs gap-1 border-white/[0.12] bg-white/[0.03] text-zinc-200 hover:bg-white/[0.08] hover:text-white cursor-pointer"
                >
                  <Edit2 size={12} />
                  <span>Edit Profile</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Onboard New Trainer */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="max-w-md bg-[#0e0e12] border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              Onboard New Coach
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Create a coach login account and initialize their directory profile.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateTrainer} className="space-y-3 text-xs mt-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Full Name *
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Coach Tariqul Islam"
                required
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="coach@apexfitness.demo"
                  required
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-300 mb-1">
                  Phone (Bangladesh) *
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+8801700000000"
                  required
                  className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Initial Password *
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Specialties (Comma Separated)
              </label>
              <Input
                value={specialtiesInput}
                onChange={(e) => setSpecialtiesInput(e.target.value)}
                placeholder="Powerlifting, Functional HIIT, Hypertrophy"
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Certifications (Comma Separated)
              </label>
              <Input
                value={certificationsInput}
                onChange={(e) => setCertificationsInput(e.target.value)}
                placeholder="CSCS, ACE Certified, CPR/AED"
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Professional Bio
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Brief athletic background..."
                rows={2}
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-white/[0.2] bg-[#0b0b0d] text-[#22c55e] focus:ring-[#22c55e]"
              />
              <span className="font-semibold text-zinc-300">Display in Public Directory</span>
            </label>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddModalOpen(false)}
                className="text-xs border-white/[0.12] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="text-xs bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold font-mono uppercase"
              >
                {isCreating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Create Trainer Account"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Edit Existing Trainer */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md bg-[#0e0e12] border-white/[0.08] text-white">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-white">
              Edit Trainer Profile: {selectedTrainer?.user?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Update coach bio, certifications, and public visibility.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateTrainer} className="space-y-3 text-xs mt-2">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Specialties (Comma Separated)
              </label>
              <Input
                value={specialtiesInput}
                onChange={(e) => setSpecialtiesInput(e.target.value)}
                placeholder="Powerlifting, HIIT"
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Certifications (Comma Separated)
              </label>
              <Input
                value={certificationsInput}
                onChange={(e) => setCertificationsInput(e.target.value)}
                placeholder="CSCS, ACE"
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Professional Bio
              </label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="bg-[#0b0b0d] border-white/[0.12] text-white placeholder:text-zinc-600 focus-visible:ring-[#22c55e]"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-white/[0.2] bg-[#0b0b0d] text-[#22c55e] focus:ring-[#22c55e]"
              />
              <span className="font-semibold text-zinc-300">Display in Public Directory</span>
            </label>

            <div className="pt-3 border-t border-white/[0.08] flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditModalOpen(false)}
                className="text-xs border-white/[0.12] bg-white/[0.03] text-zinc-300 hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="text-xs bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold font-mono uppercase"
              >
                {isUpdating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
