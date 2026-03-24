"use client";

import * as React from "react";
import { MessageCircleIcon, SearchIcon, UsersIcon } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import RunIcon from "./icons/Run";
import HomeIcon from "./icons/Home";
import { NavUser } from "./nav-user";
import { useUser } from "@/contexts/UserProvider";
import Logo from "@/components/Logo";
import Link from "next/link";
import { TeamSwitcher } from "./team-switcher";

const data = [
  {
    name: "Home",
    url: "/",
    icon: <HomeIcon />,
  },
  {
    name: "My Activity",
    url: "/activity",
    icon: <RunIcon />,
  },
  {
    name: "Friends",
    url: "#",
    icon: <UsersIcon />,
    isActive: true,
    items: [
      {
        name: "Friend list",
        url: "/friend/friend-list",
        icon: <UsersIcon />,
      },
      {
        name: "Search",
        url: "/friend/search",
        icon: <SearchIcon />,
      },
    ],
  },
  {
    name: "Messages",
    url: "/message",
    icon: <MessageCircleIcon />,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/" className="flex flex-row items-center gap-0 mt-3">
          <TeamSwitcher
            teams={[
              {
                name: "Social Fitness",
                logo: <Logo size="extra-small" />,
                plan: "Free",
              },
            ]}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
