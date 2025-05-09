"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getCompanies() {
  try {
    const companies = await prisma.company.findMany({
      orderBy: { name: "asc" },
    });
    return companies;
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    throw new Error("Failed to fetch companies");
  }
}

export async function getCompanyById(id: string) {
  try {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: true,
        deals: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  } catch (error) {
    console.error(`Failed to fetch company with ID ${id}:`, error);
    throw new Error("Failed to fetch company");
  }
}

export async function createCompany(data: {
  name: string;
  domain: string;
  industry: string;
}) {
  try {
    const company = await prisma.company.create({
      data,
    });
    revalidatePath("/dashboard");
    return company;
  } catch (error) {
    console.error("Failed to create company:", error);
    throw new Error("Failed to create company");
  }
}

export async function updateCompany(
  id: string,
  data: {
    name: string;
    domain: string;
    industry: string;
  }
) {
  try {
    const company = await prisma.company.update({
      where: { id },
      data,
    });
    revalidatePath("/dashboard");
    return company;
  } catch (error) {
    console.error("Failed to update company:", error);
    throw new Error("Failed to update company");
  }
}

export async function deleteCompany(id: string) {
  try {
    await prisma.company.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete company:", error);
    throw new Error("Failed to delete company");
  }
}

export async function getCompanyStats() {
  try {
    const totalCompanies = await prisma.company.count();
    const companiesByIndustry = await prisma.company.groupBy({
      by: ["industry"],
      _count: {
        industry: true,
      },
    });

    return {
      totalCompanies,
      companiesByIndustry: companiesByIndustry.map((item) => ({
        industry: item.industry,
        count: item._count.industry,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch company stats:", error);
    throw new Error("Failed to fetch company statistics");
  }
}
