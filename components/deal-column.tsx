"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { DealCard } from "@/components/deal-card";

interface Deal {
  id: string;
  title: string;
  amount: number;
  stage: string;
  company?: {
    name: string;
  };
  contact?: {
    firstName: string;
    lastName: string;
  };
}

interface DealColumnProps {
  title: string;
  deals: Deal[];
  stage: string;
  onEdit: (deal: Deal) => void;
}

export function DealColumn({ title, deals, stage, onEdit }: DealColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <span className="text-sm text-muted-foreground">{deals.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 p-2 overflow-y-auto rounded-md transition-colors ${
          isOver ? "bg-muted/70" : "bg-muted/40"
        }`}
      >
        <SortableContext
          items={deals.map((deal) => deal.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-2">
            {deals.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-sm text-muted-foreground">
                No deals
              </div>
            ) : (
              deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} onEdit={onEdit} />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
