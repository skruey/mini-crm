"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CompaniesTable } from "@/components/companies-table";
import { CompanyForm } from "@/components/company-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CompaniesTabProps {
  searchQuery: string;
}

export function CompaniesTab({ searchQuery }: CompaniesTabProps) {
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [editingCompany, setEditingCompany] = useState<unknown | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setIsAddingCompany(false);
    setEditingCompany(null);
    // Increment the refresh trigger to cause a refetch
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Companies</h2>
        <Button onClick={() => setIsAddingCompany(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      <CompaniesTable
        searchQuery={searchQuery}
        onEdit={setEditingCompany}
        refreshTrigger={refreshTrigger}
      />

      <Dialog open={isAddingCompany} onOpenChange={setIsAddingCompany}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
          </DialogHeader>
          <CompanyForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingCompany}
        onOpenChange={() => setEditingCompany(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {editingCompany && (
            <CompanyForm company={editingCompany} onSuccess={handleSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
