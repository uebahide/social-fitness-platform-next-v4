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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://127.0.0.1:3000"),
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
    images: ["/images/SFA-LOGO.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Social Fitness Platform",
    description:
      "Track activities, connect with friends, and stay in sync with your training partners.",
    images: ["/images/SFA-LOGO.png"],
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

  if (user) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user?.id);
    if (error) {
      throw new Error(error.message);
    }
    profile = data?.[0];
  }

  const { data: categoriesData } = await supabase
    .from("categories")
    .select("*");
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <StoreProvider>
          <SidebarProvider>
            <TooltipProvider>
              <UserProvider initialUser={profile as User | null}>
                <CategoriesProvider
                  initialCategories={(categoriesData ?? []) as Category[]}
                >
                  <AppSidebar />
                  <Main>
                    <SidebarTrigger />
                    <Toaster />
                    {children}
                  </Main>
                </CategoriesProvider>
              </UserProvider>
            </TooltipProvider>
          </SidebarProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
