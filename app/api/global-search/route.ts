import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q")?.trim();

  if (!query) {
    return NextResponse.json({ companies: [], deals: [], contacts: [] });
  }

  // Split query into words for multi-word search
  const words = query.split(/\s+/).filter(Boolean);

  // Companies: name contains all words (case-insensitive)
  const companies = await prisma.company.findMany({
    where: {
      AND: words.map((word) => ({
        name: { contains: word, mode: "insensitive" },
      })),
    },
    take: 10,
  });

  // Deals: title OR company.name contains all words (case-insensitive)
  const deals = await prisma.deal.findMany({
    where: {
      OR: [
        {
          AND: words.map((word) => ({
            title: { contains: word, mode: "insensitive" },
          })),
        },
        {
          company: {
            AND: words.map((word) => ({
              name: { contains: word, mode: "insensitive" },
            })),
          },
        },
      ],
    },
    include: { company: true, contact: true },
    take: 10,
  });

  // Contacts: firstName, lastName, or email contains all words (case-insensitive)
  const contacts = await prisma.contact.findMany({
    where: {
      OR: [
        {
          AND: words.map((word) => ({
            firstName: { contains: word, mode: "insensitive" },
          })),
        },
        {
          AND: words.map((word) => ({
            lastName: { contains: word, mode: "insensitive" },
          })),
        },
        {
          AND: words.map((word) => ({
            email: { contains: word, mode: "insensitive" },
          })),
        },
      ],
    },
    include: { company: true },
    take: 10,
  });

  return NextResponse.json({ companies, deals, contacts });
}
