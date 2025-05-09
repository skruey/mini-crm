"use client";

import { useEffect, useState } from "react";
import {
  DndContext,
  type DragEndEvent,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";

import { DealColumn } from "@/components/deal-column";
import { DealCard } from "@/components/deal-card";
import { getDeals, updateDealStage } from "@/lib/db/deal";

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

interface DealsGroupedByStage {
  LEAD: Deal[];
  QUALIFIED: Deal[];
  NEGOTIATION: Deal[];
  CLOSED_WON: Deal[];
  CLOSED_LOST: Deal[];
}

interface DealBoardProps {
  searchQuery: string;
  onEdit: (deal: Deal) => void;
  refreshTrigger: number;
}

export function DealBoard({
  searchQuery,
  onEdit,
  refreshTrigger,
}: DealBoardProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [groupedDeals, setGroupedDeals] = useState<DealsGroupedByStage>({
    LEAD: [],
    QUALIFIED: [],
    NEGOTIATION: [],
    CLOSED_WON: [],
    CLOSED_LOST: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeDeal, setActiveDeal] = useState<Deal | null>(null);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const data = await getDeals();
        setDeals(data);
        groupDealsByStage(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch deals:", error);
        setLoading(false);
      }
    };

    fetchDeals();
  }, [refreshTrigger]); // Refetch when refreshTrigger changes

  useEffect(() => {
    if (searchQuery) {
      const filtered = deals.filter(
        (deal) =>
          deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (deal.company?.name &&
            deal.company.name
              .toLowerCase()
              .includes(searchQuery.toLowerCase())) ||
          (deal.contact &&
            `${deal.contact.firstName} ${deal.contact.lastName}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
      groupDealsByStage(filtered);
    } else {
      groupDealsByStage(deals);
    }
  }, [searchQuery, deals]);

  const groupDealsByStage = (dealsToGroup: Deal[]) => {
    const grouped = {
      LEAD: [],
      QUALIFIED: [],
      NEGOTIATION: [],
      CLOSED_WON: [],
      CLOSED_LOST: [],
    } as DealsGroupedByStage;

    dealsToGroup.forEach((deal) => {
      if (grouped[deal.stage as keyof DealsGroupedByStage]) {
        grouped[deal.stage as keyof DealsGroupedByStage].push(deal);
      }
    });

    setGroupedDeals(grouped);
  };

  const handleDragStart = (event: unknown) => {
    const { active } = event;
    const dealId = active.id as string;
    const deal = deals.find((d) => d.id === dealId);
    if (deal) {
      setActiveDeal(deal);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveDeal(null);
    const { active, over } = event;
    if (!over) return;

    const dealId = active.id as string;

    // Determine the target stage
    let newStage: keyof DealsGroupedByStage | undefined;
    // If over.id is a column id, use it directly
    if (
      [
        "LEAD",
        "QUALIFIED",
        "NEGOTIATION",
        "CLOSED_WON",
        "CLOSED_LOST",
      ].includes(over.id as string)
    ) {
      newStage = over.id as keyof DealsGroupedByStage;
    } else {
      // Otherwise, over.id is a card id-find that card and get its stage
      const overDeal = deals.find((d) => d.id === over.id);
      newStage = overDeal?.stage as keyof DealsGroupedByStage;
    }
    if (!newStage) return;

    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stage === newStage) return;

    const updatedDeal = { ...deal, stage: newStage };
    const updatedDeals = deals.map((d) => (d.id === dealId ? updatedDeal : d));
    setDeals(updatedDeals);
    groupDealsByStage(updatedDeals);

    try {
      await updateDealStage(dealId, newStage);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setDeals(deals);
      groupDealsByStage(deals);
    }
  };

  if (loading && deals.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 h-[calc(100vh-200px)] overflow-auto">
        <DealColumn
          title="Lead"
          deals={groupedDeals.LEAD}
          stage="LEAD"
          onEdit={onEdit}
        />
        <DealColumn
          title="Qualified"
          deals={groupedDeals.QUALIFIED}
          stage="QUALIFIED"
          onEdit={onEdit}
        />
        <DealColumn
          title="Negotiation"
          deals={groupedDeals.NEGOTIATION}
          stage="NEGOTIATION"
          onEdit={onEdit}
        />
        <DealColumn
          title="Closed Won"
          deals={groupedDeals.CLOSED_WON}
          stage="CLOSED_WON"
          onEdit={onEdit}
        />
        <DealColumn
          title="Closed Lost"
          deals={groupedDeals.CLOSED_LOST}
          stage="CLOSED_LOST"
          onEdit={onEdit}
        />
      </div>
      <DragOverlay>
        {activeDeal ? (
          <div className="w-full opacity-80">
            <DealCard deal={activeDeal} onEdit={onEdit} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
