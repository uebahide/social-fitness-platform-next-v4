/**
 * Layout component for the app
 * This component is used to wrap the app in a layout component
 * It is used to provide the user with a layout component and other data for the app
 * such as categories, notifications, and user profile
 **/

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Main from "@/components/Main";
import { UserProvider } from "@/contexts/UserProvider";
import { createClient } from "@/lib/supabase/server";
import { User } from "@/types/api/user";
import { CategoriesProvider } from "@/contexts/CategoriesProvider";
import { Category } from "@/types/api/category";
import StoreProvider from "./StoreProvider";
import { Toaster } from "sonner";
import { QueryProvider } from "./QueryProvider";
import { NotificationListener } from "./NotificationListener";
import { getNotifications } from "@/lib/server/getNotifications";
import { Notification } from "@/types/api/notification";
import { getCategories } from "@/lib/server/getCategories";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const getMetadataBase = () => {
  const rawUrl =
    process.env.APP_URL?.trim() ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
    process.env.VERCEL_URL?.trim();

  if (!rawUrl) {
    return new URL("http://127.0.0.1:3000");
  }

  const normalizedUrl =
    rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `https://${rawUrl}`;

  try {
    return new URL(normalizedUrl);
  } catch {
    return new URL("http://127.0.0.1:3000");
  }
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  applicationName: "Social Fitness Platform",
  title: {
    default: "Social Fitness Platform",
    template: "%s | Social Fitness Platform",
  },
  description:
    "A social fitness platform for tracking activities, connecting with friends, and messaging training partners.",
  openGraph: {
    title: "Social Fitness Platform",
    description:
      "Track activities, connect with friends, and stay in sync with your training partners.",
    siteName: "Social Fitness Platform",
    type: "website",
    images: [
      {
        url: "/images/open-graph-image.png",
        width: 1024,
        height: 1024,
        alt: "Social Fitness Platform logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Fitness Platform",
    description:
      "Track activities, connect with friends, and stay in sync with your training partners.",
    images: [
      {
        url: "/images/open-graph-image.png",
        alt: "Social Fitness Platform logo",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  let profile: User | null = null;
  let notifications: Notification[] = [];

  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user?.id);
    if (error) {
      throw new Error(error.message);
    }
    // get profile for the user in server component
    profile = data?.[0];
    // get notifications for the user in server component
    notifications = await getNotifications(profile?.id as number);
  }

  // get categories for the user in server component
  const categoriesData = await getCategories();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <StoreProvider>
          <QueryProvider>
            <SidebarProvider>
              <TooltipProvider>
                <UserProvider initialUser={profile as User | null}>
                  <NotificationListener notifications={notifications}>
                    <CategoriesProvider
                      initialCategories={(categoriesData ?? []) as Category[]}
                    >
                      <AppSidebar />
                      <Main>
                        <SidebarTrigger />
                        <Toaster position="top-right" />
                        {children}
                      </Main>
                    </CategoriesProvider>
                  </NotificationListener>
                </UserProvider>
              </TooltipProvider>
            </SidebarProvider>
          </QueryProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
