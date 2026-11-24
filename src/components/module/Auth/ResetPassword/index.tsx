/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useResetPasswordMutation } from "@/redux/api/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],  
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const [resetPassword, { isLoading }] = useResetPasswordMutation() as any;

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!email) {
      toast.error("Session expired or email missing. Please try again.");
      router.replace("/forgot-password");
    }
  }, [email, router]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    if (!email) {
      toast.error("Email address is missing");
      router.push("/forgot-password");
      return;
    }

    const payload = {
      email: email,
      password: data.confirmPassword,
    };

    try {
      const res = (await resetPassword(payload).unwrap()) as any;

      if (res?.success) {
        toast.success(res.message || "Password reset successfully!");
        form.reset();
        router.push("/login");
      } else {
        toast.error(res?.message || "Failed to reset password");
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-8 lg:gap-12 xl:gap-16">
        {/* Left Image Banner */}
        <div className="hidden md:flex flex-1 relative border border-white/[0.08] bg-[#121216] p-2 rounded-xs overflow-hidden min-h-[450px] lg:min-h-[580px] max-h-[85vh] group">
          <div className="relative w-full h-full min-h-[440px] lg:min-h-[560px] overflow-hidden rounded-xs bg-zinc-900">
            <Image
              src="/images/fgp.jpg"
              alt="Reset Password"
              fill
              className="object-cover contrast-110 grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-zinc-300">
              <span className="mono-label text-[11px] text-white font-bold">
                CREDENTIAL UPDATE • SECURE
              </span>
              <span className="text-[#22c55e] font-mono font-bold text-[11px]">
                AUTHORIZED
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-xl mx-auto bg-[#0e0e12] border border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-2xl rounded-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] text-xs font-mono">
            <span className="mono-label text-zinc-400">
              AUTH • RESET CREDENTIALS
            </span>
            <span className="text-[#22c55e] font-bold text-[11px]">
              PASSWORD ROTATION
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Reset Password
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 font-sans">
              Enter your new secure password to restore access to your gym account.
            </p>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <PHInput
                control={form.control}
                name="newPassword"
                label="New Password"
                type="password"
                placeholder="At least 6 characters"
              />

              <PHInput
                control={form.control}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Re-enter new password"
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-xs sm:text-sm font-mono uppercase tracking-wider font-black !text-black bg-[#22c55e] hover:bg-[#16a34a] transition-all rounded-sm shadow-lg shadow-[#22c55e]/20 cursor-pointer"
                >
                  {isLoading ? <Spinner /> : "Confirm New Password"}
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-sans">
            <span>Remembered password?</span>
            <Link
              href="/login"
              className="text-[#22c55e] font-bold hover:underline font-mono uppercase tracking-wider"
            >
              Back to Sign In →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
