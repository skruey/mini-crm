"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDeal, updateDeal } from "@/lib/db/deal";
import { getCompanies } from "@/lib/db/company";
import { getContacts } from "@/lib/db/contact";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CompanyForm } from "@/components/company-form";
import { ContactForm } from "@/components/contact-form";

const dealSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  amount: z.coerce.number().min(0, "Amount must be a positive number"),
  stage: z.enum([
    "LEAD",
    "QUALIFIED",
    "NEGOTIATION",
    "CLOSED_WON",
    "CLOSED_LOST",
  ]),
  companyId: z.string().nullable().optional(),
  contactId: z.string().nullable().optional(),
});

type DealFormValues = z.infer<typeof dealSchema>;

interface DealFormProps {
  deal?: {
    id: string;
    title: string;
    amount: number;
    stage: string;
    companyId?: string;
    contactId?: string;
  };
  onSuccess: () => void;
}

export function DealForm({ deal, onSuccess }: DealFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  );
  const [contacts, setContacts] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [isAddingCompany, setIsAddingCompany] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);

  const form = useForm<DealFormValues>({
    resolver: zodResolver(dealSchema),
    defaultValues: deal
      ? {
          ...deal,
          amount: deal.amount,
        }
      : {
          title: "",
          amount: 0,
          stage: "LEAD",
          companyId: "",
          contactId: "",
        },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, contactsData] = await Promise.all([
          getCompanies(),
          getContacts(),
        ]);
        setCompanies(companiesData);
        setContacts(contactsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, [isAddingCompany, isAddingContact]);

  const onSubmit = async (data: DealFormValues) => {
    setIsSubmitting(true);
    try {
      if (deal) {
        await updateDeal(deal.id, data);
      } else {
        await createDeal(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save deal:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompanySuccess = () => {
    setIsAddingCompany(false);
  };

  const handleContactSuccess = () => {
    setIsAddingContact(false);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deal Title</FormLabel>
                <FormControl>
                  <Input placeholder="New Software License" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stage</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="LEAD">Lead</SelectItem>
                    <SelectItem value="QUALIFIED">Qualified</SelectItem>
                    <SelectItem value="NEGOTIATION">Negotiation</SelectItem>
                    <SelectItem value="CLOSED_WON">Closed Won</SelectItem>
                    <SelectItem value="CLOSED_LOST">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <div className="flex gap-2">
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? null : value)
                    }
                    value={field.value ?? "none"}
                    className="flex-1"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a company" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsAddingCompany(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add Company</span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <div className="flex gap-2">
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === "none" ? null : value)
                    }
                    value={field.value ?? "none"}
                    className="flex-1"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a contact" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {contacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.firstName} {contact.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsAddingContact(true)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add Contact</span>
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onSuccess}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : deal ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={isAddingCompany} onOpenChange={setIsAddingCompany}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Company</DialogTitle>
          </DialogHeader>
          <CompanyForm onSuccess={handleCompanySuccess} />
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
          </DialogHeader>
          <ContactForm onSuccess={handleContactSuccess} />
        </DialogContent>
      </Dialog>
    </>
  );
}
