"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DealBoard } from "@/components/deal-board";
import { DealForm } from "@/components/deal-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DealsTabProps {
  searchQuery: string;
}

export function DealsTab({ searchQuery }: DealsTabProps) {
  const [isAddingDeal, setIsAddingDeal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<unknown | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setIsAddingDeal(false);
    setEditingDeal(null);
    // Increment the refresh trigger to cause a refetch
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEdit = (deal: unknown) => {
    console.log("Editing deal:", deal);
    setEditingDeal(deal);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Deals</h2>
        <Button onClick={() => setIsAddingDeal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <DealBoard
        searchQuery={searchQuery}
        onEdit={handleEdit}
        refreshTrigger={refreshTrigger}
      />

      <Dialog open={isAddingDeal} onOpenChange={setIsAddingDeal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Deal</DialogTitle>
          </DialogHeader>
          <DealForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingDeal}
        onOpenChange={(open) => !open && setEditingDeal(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
          </DialogHeader>
          {editingDeal && (
            <DealForm deal={editingDeal} onSuccess={handleSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
