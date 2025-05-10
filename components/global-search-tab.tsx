"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GlobalSearchTab() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{
    companies: unknown[];
    deals: unknown[];
    contacts: unknown[];
  } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setQuery(q);
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/global-search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Input
        type="search"
        placeholder="Search companies, deals, contacts..."
        value={query}
        onChange={handleSearch}
        className="mb-6"
      />

      {loading && (
        <div>
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full mb-2" />
          <Skeleton className="h-8 w-full" />
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Companies Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl underline">Companies</CardTitle>
            </CardHeader>
            <CardContent>
              {results.companies.length ? (
                <ul className="space-y-4">
                  {results.companies.map((c) => (
                    <li key={c.id} className="flex flex-col gap-1">
                      <div>
                        <span className="font-bold">Name:</span>{" "}
                        <span>{c.name}</span>
                      </div>
                      <div>
                        <span className="font-bold">Industry:</span>{" "}
                        <span>{c.industry}</span>
                      </div>
                      <div>
                        <span className="font-bold">Domain:</span>{" "}
                        <span>{c.domain}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted-foreground">
                  No companies found.
                </span>
              )}
            </CardContent>
          </Card>

          {/* Contacts Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl underline">Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {results.contacts.length ? (
                <ul className="space-y-4">
                  {results.contacts.map((c) => (
                    <li key={c.id} className="flex flex-col gap-1">
                      <div>
                        <span className="font-bold">Name:</span>{" "}
                        <span>
                          {c.firstName} {c.lastName}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold">Email:</span>{" "}
                        <span>{c.email}</span>
                      </div>
                      <div>
                        <span className="font-bold">Phone:</span>{" "}
                        <span>{c.phone}</span>
                      </div>
                      {c.company && (
                        <div>
                          <span className="font-bold">Company:</span>{" "}
                          <span>{c.company.name}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted-foreground">
                  No contacts found.
                </span>
              )}
            </CardContent>
          </Card>

          {/* Deals Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl underline">Deals</CardTitle>
            </CardHeader>
            <CardContent>
              {results.deals.length ? (
                <ul className="space-y-4">
                  {results.deals.map((d) => (
                    <li key={d.id} className="flex flex-col gap-1">
                      <div>
                        <span className="font-bold">Title:</span>{" "}
                        <span>{d.title}</span>
                      </div>
                      <div>
                        <span className="font-bold">Stage:</span>{" "}
                        <span>{d.stage}</span>
                      </div>
                      <div>
                        <span className="font-bold">Amount:</span>{" "}
                        <span>{d.amount}</span>
                      </div>
                      {d.company && (
                        <div>
                          <span className="font-bold">Company:</span>{" "}
                          <span>{d.company.name}</span>
                        </div>
                      )}
                      {d.contact && (
                        <div>
                          <span className="font-bold">Contact:</span>{" "}
                          <span>
                            {d.contact.firstName} {d.contact.lastName}
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted-foreground">No deals found.</span>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
