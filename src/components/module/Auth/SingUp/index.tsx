/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRegisterMutation } from "@/redux/api/authApi";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const registerSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .email("Invalid email address")
      .min(1, "Email is required"),
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    skillLevel: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    agreedToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegistrationForm() {
  const router = useRouter();

  const [registerUser, { isLoading }] = useRegisterMutation() as any;

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateOfBirth: "",
      skillLevel: "",
      password: "",
      confirmPassword: "",
      agreedToTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    const payload = {
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phoneNumber,
      password: data.password,
    };

    try {
      const res = await registerUser(payload).unwrap();

      if (res.success) {
        toast.success(res.message || "Registration successful");
        form.reset();
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-8 lg:gap-12 xl:gap-16">
        {/* Left Image Banner */}
        <div className="hidden md:flex flex-1 relative border border-white/[0.08] bg-[#121216] p-2 rounded-xs overflow-hidden min-h-[450px] lg:min-h-[640px] max-h-[85vh] group">
          <div className="relative w-full h-full min-h-[440px] lg:min-h-[620px] overflow-hidden rounded-xs bg-zinc-900">
            <Image
              src="/images/rgp.jpg"
              alt="Registration"
              fill
              className="object-cover contrast-110 grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-zinc-300">
              <span className="mono-label text-[11px] text-white font-bold">
                ATHLETIC SANCTUARY • BLOCK-D
              </span>
              <span className="text-[#22c55e] font-mono font-bold text-[11px]">
                JOIN THE RANKS
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-xl mx-auto bg-[#0e0e12] border border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-2xl rounded-xs">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] text-xs font-mono">
            <span className="mono-label text-zinc-400">
              AUTH • NEW MEMBER ENROLLMENT
            </span>
            <span className="text-[#22c55e] font-bold text-[11px]">
              MAIN CAMPUS
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Create Your Account
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 font-sans">
              Sign up to book classes, select membership packages, and access training schedules.
            </p>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              {/* First Name & Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PHInput
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="John"
                />

                <PHInput
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Doe"
                />
              </div>

              {/* Email Address */}
              <PHInput
                control={form.control}
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@domain.com"
              />

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PHInput
                  control={form.control}
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="At least 6 chars"
                />

                <PHInput
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Re-enter password"
                />
              </div>

              {/* Terms and Conditions */}
              <div>
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <input
                    type="checkbox"
                    id="agreedToTerms"
                    {...form.register("agreedToTerms")}
                    className="mt-1 w-4 h-4 bg-[#121216] border-white/[0.2] rounded-xs accent-[#22c55e] cursor-pointer"
                  />
                  <label
                    htmlFor="agreedToTerms"
                    className="text-xs text-zinc-400 leading-relaxed cursor-pointer font-sans"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms-privacy"
                      className="text-[#22c55e] hover:underline font-semibold"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/terms-privacy"
                      className="text-[#22c55e] hover:underline font-semibold"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {form.formState.errors.agreedToTerms?.message && (
                  <p className="text-red-400 text-xs mt-1 font-mono">
                    {form.formState.errors.agreedToTerms.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-xs sm:text-sm font-mono uppercase tracking-wider font-black !text-black bg-[#22c55e] hover:bg-[#16a34a] transition-all rounded-sm shadow-lg shadow-[#22c55e]/20 cursor-pointer"
                >
                  {isLoading ? <Spinner /> : "Complete Registration"}
                </Button>
              </div>

              <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-sans">
                <span>Already have an account?</span>
                <Link
                  href="/login"
                  className="text-[#22c55e] font-bold hover:underline font-mono uppercase tracking-wider"
                >
                  Sign In →
                </Link>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
