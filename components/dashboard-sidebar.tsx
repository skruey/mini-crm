"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Building2, Contact, DollarSign, LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "companies";

  const handleTabChange = (tab: string) => {
    router.push(`/dashboard?tab=${tab}`);
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <DollarSign className="h-6 w-6" />
          <span className="font-bold">Mini CRM</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/dashboard" && currentTab === "companies"}
            >
              <button onClick={() => handleTabChange("companies")}>
                <Building2 />
                <span>Companies</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={currentTab === "contacts"}>
              <button onClick={() => handleTabChange("contacts")}>
                <Contact />
                <span>Contacts</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={currentTab === "deals"}>
              <button onClick={() => handleTabChange("deals")}>
                <DollarSign />
                <span>Deals</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="mb-8">
              <a href="/api/auth/signout">
                <LogOut />
                <span>Logout</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarTrigger />
    </Sidebar>
  );
}
