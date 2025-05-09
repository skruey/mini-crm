"use client";

import type React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Deal } from "@/lib/mock-data";

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
  isDragging?: boolean;
}

export function DealCard({ deal, onEdit, isDragging = false }: DealCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: deal.id,
    data: deal,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0 : 1,
    zIndex: isDragging || isSortableDragging ? 50 : "auto", // Ensure on top when dragging
    position: isDragging || isSortableDragging ? "relative" : "static", // Required for z-index to work
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onEdit(deal);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`cursor-default ${isDragging ? "z-50" : ""}`}
      {...attributes} // Keep attributes on the card for accessibility
    >
      <CardContent className="p-3">
        <div className="flex justify-between items-start">
          {/* Drag handle */}
          <div
            {...listeners}
            {...attributes} // Add attributes here as well for correct aria roles
            style={{ cursor: "grab", userSelect: "none" }}
            className="flex flex-col"
          >
            <h4 className="font-medium text-sm">{deal.title}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {formatCurrency(deal.amount)}
            </p>
          </div>

          {/* Edit button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:cursor-pointer"
            onClick={handleEdit}
          >
            <Edit className="h-3 w-3" />
            <span className="sr-only">Edit</span>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex-col items-start">
        {deal.company && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Company:</span> {deal.company.name}
          </p>
        )}
        {deal.contact && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Contact:</span>{" "}
            {deal.contact.firstName} {deal.contact.lastName}
          </p>
        )}
      </CardFooter>
    </Card>
  );
}
