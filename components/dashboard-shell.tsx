"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Menu, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CompaniesTab } from "@/components/companies-tab";
import { ContactsTab } from "@/components/contacts-tab";
import { DealsTab } from "@/components/deals-tab";
import { useSidebar } from "@/components/ui/sidebar";
import GlobalSearchTab from "@/components/global-search-tab";

export function DashboardShell() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(tabParam || "companies");
  const { toggleSidebar } = useSidebar();
  const isNotGlobalSearch = activeTab !== "search";

  // Update active tab when URL parameter changes
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col h-full gap-4 p-2 md:p-6">
      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight">
            Dashboard
          </h1>
        </div>
        {isNotGlobalSearch ? (
          <div className="relative w-full max-w-xs md:max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={`Search ${activeTab}...`}
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        ) : null}
      </div>

      <Tabs
        value={activeTab}
        className="flex-1"
        onValueChange={handleTabChange}
      >
        <TabsList className="w-full flex justify-between">
          <TabsTrigger
            value="companies"
            className="flex-1 hover:cursor-pointer"
          >
            Companies
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex-1 hover:cursor-pointer">
            Contacts
          </TabsTrigger>
          <TabsTrigger value="deals" className="flex-1 hover:cursor-pointer">
            Deals
          </TabsTrigger>
          <TabsTrigger value="search" className="flex-1 hover:cursor-pointer">
            Global Search
          </TabsTrigger>
        </TabsList>
        <TabsContent value="companies" className="flex-1 h-full mt-4">
          <CompaniesTab searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="contacts" className="flex-1 h-full mt-4">
          <ContactsTab searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="deals" className="flex-1 h-full mt-4">
          <DealsTab searchQuery={searchQuery} />
        </TabsContent>
        <TabsContent value="search" className="flex-1 h-full mt-4">
          <GlobalSearchTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
