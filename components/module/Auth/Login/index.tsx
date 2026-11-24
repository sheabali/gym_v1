/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import PHInput from "@/components/form/NRInput";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLoginMutation } from "@/redux/api/authApi";
import { setUser } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";

import { setCookie } from "@/src/utils/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode, JwtPayload } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type LoginFormValues = {
  email: string;
  password: string;
};

interface CustomJwtPayload extends JwtPayload {
  role: string;
}

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(4, "Password must be at least 4 characters"),
});

const LoginPage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation() as any;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await login(data).unwrap();

      if (res.success) {
        const token = res.data.accessToken || res.data.token;

        setCookie(token);

        let decodedRole = "MEMBER";
        try {
          const decoded = jwtDecode<CustomJwtPayload>(token);
          decodedRole = decoded.role;
        } catch {
          // ignore decode errors if already in res.data.user
        }

        const user = res.data.user || { role: decodedRole };

        dispatch(setUser({ token, user }));

        toast.success(res.message || "Login successful!");

          if (user?.role === "ADMIN" || decodedRole === "ADMIN") {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
        } else {
          toast.error(res.message || "Login failed");
        }
      } catch (error: any) {
        toast.error(error?.data?.message || "Something went wrong");
      }
    };

  return (
    <div className="min-h-screen bg-[#0b0b0d] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row w-full max-w-7xl items-center justify-center gap-8 lg:gap-12 xl:gap-16">
        {/* Left Image Banner */}
        <div className="hidden md:flex flex-1 relative border border-white/[0.08] bg-[#121216] p-2 rounded-xs overflow-hidden min-h-[450px] lg:min-h-[580px] max-h-[85vh] group">
          <div className="relative w-full h-full min-h-[440px] lg:min-h-[560px] overflow-hidden rounded-xs bg-zinc-900">
            <Image
              src="/images/lip.jpg"
              alt="Fitness Center"
              fill
              className="object-cover contrast-110 grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
              priority
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-zinc-300">
              <span className="mono-label text-[11px] text-white font-bold">
                APEX FITNESS • MEMBER ACCESS
              </span>
              <span className="text-[#22c55e] font-mono font-bold text-[11px]">
                EST. 2018
              </span>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="w-full max-w-xl mx-auto bg-[#0e0e12] border border-white/[0.08] p-6 sm:p-8 md:p-10 shadow-2xl rounded-xs">
          {/* Architectural Telemetry Tag */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] text-xs font-mono">
            <span className="mono-label text-zinc-400">
              AUTH • ACCESS CONTROL
            </span>
            <span className="flex items-center gap-1.5 text-[#22c55e] font-bold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
              SECURE PORTAL
            </span>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Member Sign In
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 font-sans">
              Authenticate to manage memberships, view invoices, and book classes.
            </p>
          </div>

          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-5"
            >
              <PHInput
                control={form.control}
                name="email"
                label="Email Address"
                type="email"
                placeholder="you@domain.com"
              />

              <PHInput
                control={form.control}
                name="password"
                label="Password"
                type="password"
                placeholder="Enter password"
              />

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-xs text-[#22c55e] hover:underline font-mono uppercase tracking-wider"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 text-xs sm:text-sm font-mono uppercase tracking-wider font-black !text-black bg-[#22c55e] hover:bg-[#16a34a] transition-all rounded-sm shadow-lg shadow-[#22c55e]/20 cursor-pointer"
                >
                  {isLoading ? <Spinner /> : "Sign In to Account"}
                </Button>
              </div>
            </form>
          </FormProvider>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400 font-sans">
            <span>Don&apos;t have an account?</span>
            <Link
              href="/register"
              className="text-[#22c55e] font-bold hover:underline font-mono uppercase tracking-wider"
            >
              Create Account →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
  };

  export default LoginPage;
