"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { createCompany, updateCompany } from "@/lib/db/company";

const companySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  domain: z
    .string()
    .min(3, "Domain must be at least 3 characters")
    .regex(
      /^((?!-))(xn--)?[a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.(xn--)?([a-z0-9-]{1,61}|[a-z0-9-]{1,30}\.[a-z]{2,})$/,
      "Please enter a valid domain (e.g., example.com)"
    ),
  industry: z.string().min(2, "Industry must be at least 2 characters"),
});

type CompanyFormValues = z.infer<typeof companySchema>;

interface CompanyFormProps {
  company?: {
    id: string;
    name: string;
    domain: string;
    industry: string;
  };
  onSuccess: () => void;
}

export function CompanyForm({ company, onSuccess }: CompanyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: company || {
      name: "",
      domain: "",
      industry: "",
    },
  });

  const onSubmit = async (data: CompanyFormValues) => {
    setIsSubmitting(true);
    try {
      if (company) {
        await updateCompany(company.id, data);
      } else {
        await createCompany(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to save company:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="domain"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Domain</FormLabel>
              <FormControl>
                <Input placeholder="acme.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="industry"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Industry</FormLabel>
              <FormControl>
                <Input placeholder="Technology" {...field} />
              </FormControl>
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
            {isSubmitting ? "Saving..." : company ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
