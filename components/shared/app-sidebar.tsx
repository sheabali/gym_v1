"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Logo from "@/src/assets/logo.png";
import {
  Home,
  LayoutDashboard,
  Shield,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

const data = {
  user: {
    navMain: [
      {
        title: "Member Portal",
        url: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  member: {
    navMain: [
      {
        title: "Member Portal",
        url: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  trainer: {
    navMain: [
      {
        title: "Trainer Portal",
        url: "/trainer",
        icon: LayoutDashboard,
      },
      {
        title: "Member Portal",
        url: "/user",
        icon: User,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
  admin: {
    navMain: [
      {
        title: "Admin Dashboard",
        url: "/admin/dashboard",
        icon: Shield,
      },
      {
        title: "Trainer Portal",
        url: "/trainer",
        icon: Users,
      },
      {
        title: "Member Portal",
        url: "/user",
        icon: LayoutDashboard,
      },
      {
        title: "Go Back To Home",
        url: "/",
        icon: Home,
      },
    ],
  },
};

interface AppSidebarProps {
  role: string;
}

export default function AppSidebar({ role, ...props }: AppSidebarProps) {
  const normalizedRole = role?.toLowerCase();
  const sidebarData = data[normalizedRole as keyof typeof data] || data.user;

  return (
    <Sidebar
      collapsible="icon"
      className="w-64 bg-[#0e0e12] border-r border-white/[0.08] text-white"
      {...props}
    >
      <SidebarHeader className="border-b border-white/[0.06] bg-[#0e0e12]">
        <Link
          href={"/"}
          className="flex items-center w-full max-h-40 justify-center p-3"
        >
          <Image
            src={Logo.src}
            alt="Gym Logo"
            width={180}
            height={60}
            className="h-9 w-auto object-contain brightness-125"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-[#0e0e12] py-2">
        <NavMain items={sidebarData?.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-white/[0.06] bg-[#0e0e12]">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
