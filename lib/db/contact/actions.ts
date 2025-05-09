"use server";

import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getContacts() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        company: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { firstName: "asc" },
    });
    return contacts;
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
    throw new Error("Failed to fetch contacts");
  }
}

export async function getContactById(id: string) {
  try {
    const contact = await prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
        deals: true,
      },
    });

    if (!contact) {
      throw new Error("Contact not found");
    }

    return contact;
  } catch (error) {
    console.error(`Failed to fetch contact with ID ${id}:`, error);
    throw new Error("Failed to fetch contact");
  }
}

export async function createContact(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId?: string;
}) {
  try {
    // Handle the "none" value from the form
    const companyId = data.companyId === "none" ? null : data.companyId || null;

    const contact = await prisma.contact.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        companyId: companyId,
      },
    });
    revalidatePath("/dashboard");
    return contact;
  } catch (error) {
    console.error("Failed to create contact:", error);
    throw new Error("Failed to create contact");
  }
}

export async function updateContact(
  id: string,
  data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyId?: string;
  }
) {
  try {
    // Handle the "none" value from the form
    const companyId = data.companyId === "none" ? null : data.companyId || null;

    const contact = await prisma.contact.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        companyId: companyId,
      },
    });
    revalidatePath("/dashboard");
    return contact;
  } catch (error) {
    console.error("Failed to update contact:", error);
    throw new Error("Failed to update contact");
  }
}

export async function deleteContact(id: string) {
  try {
    await prisma.contact.delete({
      where: { id },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete contact:", error);
    throw new Error("Failed to delete contact");
  }
}

export async function getContactsByCompany(companyId: string) {
  try {
    const contacts = await prisma.contact.findMany({
      where: {
        companyId: companyId,
      },
      orderBy: { firstName: "asc" },
    });
    return contacts;
  } catch (error) {
    console.error(`Failed to fetch contacts for company ${companyId}:`, error);
    throw new Error("Failed to fetch contacts for company");
  }
}

export async function getContactStats() {
  try {
    const totalContacts = await prisma.contact.count();
    const contactsWithCompany = await prisma.contact.count({
      where: {
        companyId: { not: null },
      },
    });
    const contactsWithoutCompany = await prisma.contact.count({
      where: {
        companyId: null,
      },
    });

    return {
      totalContacts,
      contactsWithCompany,
      contactsWithoutCompany,
      percentageAssociated:
        totalContacts > 0
          ? Math.round((contactsWithCompany / totalContacts) * 100)
          : 0,
    };
  } catch (error) {
    console.error("Failed to fetch contact stats:", error);
    throw new Error("Failed to fetch contact statistics");
  }
}
