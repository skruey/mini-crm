"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ContactsTable } from "@/components/contacts-table";
import { ContactForm } from "@/components/contact-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ContactsTabProps {
  searchQuery: string;
}

export function ContactsTab({ searchQuery }: ContactsTabProps) {
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [editingContact, setEditingContact] = useState<unknown | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setIsAddingContact(false);
    setEditingContact(null);
    // Increment the refresh trigger to cause a refetch
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contacts</h2>
        <Button onClick={() => setIsAddingContact(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </div>

      <ContactsTable
        searchQuery={searchQuery}
        onEdit={setEditingContact}
        refreshTrigger={refreshTrigger}
      />

      <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Contact</DialogTitle>
          </DialogHeader>
          <ContactForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingContact}
        onOpenChange={() => setEditingContact(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
          </DialogHeader>
          {editingContact && (
            <ContactForm contact={editingContact} onSuccess={handleSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
