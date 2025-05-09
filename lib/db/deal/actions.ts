"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient, type DealStage } from "@prisma/client";

const prisma = new PrismaClient();

export async function getDeals() {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        company: {
          select: {
            name: true,
          },
        },
        contact: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return deals;
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    throw new Error("Failed to fetch deals");
  }
}

export async function getDealById(id: string) {
  try {
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        company: true,
        contact: true,
      },
    });

    if (!deal) {
      throw new Error("Deal not found");
    }

    return deal;
  } catch (error) {
    console.error(`Failed to fetch deal with ID ${id}:`, error);
    throw new Error("Failed to fetch deal");
  }
}

export async function createDeal(data: {
  title: string;
  amount: number;
  stage: string;
  companyId?: string;
  contactId?: string;
}) {
  try {
    // Handle the "none" value from the form
    const companyId = data.companyId === "none" ? null : data.companyId || null;
    const contactId = data.contactId === "none" ? null : data.contactId || null;

    const deal = await prisma.deal.create({
      data: {
        title: data.title,
        amount: data.amount,
        stage: data.stage as DealStage,
        companyId: companyId,
        contactId: contactId,
      },
    });
    revalidatePath("/dashboard");
    return deal;
  } catch (error) {
    console.error("Failed to create deal:", error);
    throw new Error("Failed to create deal");
  }
}

export async function updateDeal(
  id: string,
  data: {
    title: string;
    amount: number;
    stage: string;
    companyId?: string;
    contactId?: string;
  }
) {
  try {
    // Handle the "none" value from the form
    const companyId = data.companyId === "none" ? null : data.companyId || null;
    const contactId = data.contactId === "none" ? null : data.contactId || null;

    const deal = await prisma.deal.update({
      where: { id },
      data: {
        title: data.title,
        amount: data.amount,
        stage: data.stage as DealStage,
        companyId: companyId,
        contactId: contactId,
      },
    });
    revalidatePath("/dashboard");
    return deal;
  } catch (error) {
    console.error("Failed to update deal:", error);
    throw new Error("Failed to update deal");
  }
}

export async function updateDealStage(id: string, stage: string) {
  try {
    const deal = await prisma.deal.update({
      where: { id },
      data: {
        stage: stage as DealStage,
      },
    });
    revalidatePath("/dashboard");
    return deal;
  } catch (error) {
    console.error("Failed to update deal stage:", error);
    throw new Error("Failed to update deal stage");
  }
}

export async function deleteDeal(id: string) {
  try {
    await prisma.deal.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete deal:", error);
    throw new Error("Failed to delete deal");
  }
}

export async function getDealsByCompany(companyId: string) {
  try {
    const deals = await prisma.deal.findMany({
      where: {
        companyId: companyId,
      },
      include: {
        contact: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return deals;
  } catch (error) {
    console.error(`Failed to fetch deals for company ${companyId}:`, error);
    throw new Error("Failed to fetch deals for company");
  }
}

export async function getDealsByContact(contactId: string) {
  try {
    const deals = await prisma.deal.findMany({
      where: {
        contactId: contactId,
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return deals;
  } catch (error) {
    console.error(`Failed to fetch deals for contact ${contactId}:`, error);
    throw new Error("Failed to fetch deals for contact");
  }
}

export async function getDealStats() {
  try {
    const totalDeals = await prisma.deal.count();
    const totalValue = await prisma.deal.aggregate({
      _sum: {
        amount: true,
      },
    });

    const dealsByStage = await prisma.deal.groupBy({
      by: ["stage"],
      _count: {
        id: true,
      },
      _sum: {
        amount: true,
      },
    });

    const closedWonValue =
      dealsByStage.find((d) => d.stage === "CLOSED_WON")?._sum.amount || 0;
    const pipelineValue = dealsByStage
      .filter((d) => d.stage !== "CLOSED_WON" && d.stage !== "CLOSED_LOST")
      .reduce((sum, stage) => sum + (stage._sum.amount || 0), 0);

    return {
      totalDeals,
      totalValue: totalValue._sum.amount || 0,
      dealsByStage: dealsByStage.map((stage) => ({
        stage: stage.stage,
        count: stage._count.id,
        value: stage._sum.amount || 0,
      })),
      closedWonValue,
      pipelineValue,
    };
  } catch (error) {
    console.error("Failed to fetch deal stats:", error);
    throw new Error("Failed to fetch deal statistics");
  }
}
