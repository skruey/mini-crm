// prisma/seed.ts

import bcrypt from "bcrypt";
import prisma from "../lib/db/prisma";
import { DealStage } from "@prisma/client";

async function main() {
  // Create demo user
  const passwordHash = await bcrypt.hash("password123", 10);
  await prisma.user.create({
    data: {
      email: "demo@crm.com",
      password: passwordHash,
    },
  });

  // Companies
  const companiesData = [
    {
      name: "Stark Industries",
      domain: "starkindustries.com",
      industry: "Technology",
    },
    {
      name: "Acme Corporation",
      domain: "acmecorp.com",
      industry: "Manufacturing",
    },
    {
      name: "Wayne Enterprises",
      domain: "wayneenterprises.com",
      industry: "Finance",
    },
    {
      name: "Looney Logistics",
      domain: "looneylogistics.com",
      industry: "Logistics",
    },
    { name: "Pym Technologies", domain: "pymtech.com", industry: "Research" },
  ];

  const companies = [];
  for (const c of companiesData) {
    const company = await prisma.company.create({ data: c });
    companies.push(company);
  }

  // Contacts (Marvel & Looney Tunes)
  const contactsData = [
    {
      firstName: "Tony",
      lastName: "Stark",
      email: "tony.stark@starkindustries.com",
      phone: "555-1001",
      companyId: companies[0].id,
    },
    {
      firstName: "Bugs",
      lastName: "Bunny",
      email: "bugs.bunny@looneylogistics.com",
      phone: "555-1002",
      companyId: companies[3].id,
    },
    {
      firstName: "Bruce",
      lastName: "Wayne",
      email: "bruce.wayne@wayneenterprises.com",
      phone: "555-1003",
      companyId: companies[2].id,
    },
    {
      firstName: "Daffy",
      lastName: "Duck",
      email: "daffy.duck@looneylogistics.com",
      phone: "555-1004",
      companyId: companies[3].id,
    },
    {
      firstName: "Hope",
      lastName: "Van Dyne",
      email: "hope.vandyne@pymtech.com",
      phone: "555-1005",
      companyId: companies[4].id,
    },
  ];

  const contacts = [];
  for (const c of contactsData) {
    const contact = await prisma.contact.create({ data: c });
    contacts.push(contact);
  }

  // Deals
  const dealsData = [
    {
      title: "Arc Reactor Development",
      amount: 500000,
      stage: DealStage.QUALIFIED,
      companyId: companies[0].id,
      contactId: contacts[0].id,
    },
    {
      title: "Logistics Partnership",
      amount: 150000,
      stage: DealStage.LEAD,
      companyId: companies[3].id,
      contactId: contacts[1].id,
    },
    {
      title: "Financial Audit",
      amount: 75000,
      stage: DealStage.NEGOTIATION,
      companyId: companies[2].id,
      contactId: contacts[2].id,
    },
    {
      title: "Warehouse Expansion",
      amount: 120000,
      stage: DealStage.CLOSED_WON,
      companyId: companies[3].id,
      contactId: contacts[3].id,
    },
    {
      title: "Quantum Research Funding",
      amount: 300000,
      stage: DealStage.CLOSED_LOST,
      companyId: companies[4].id,
      contactId: contacts[4].id,
    },
  ];

  for (const d of dealsData) {
    await prisma.deal.create({ data: d });
  }

  console.log("Database seeded with Data.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
