"use client";

import { useEffect, useState } from "react";
import { Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getContacts, deleteContact } from "@/lib/db/contact";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: {
    name: string;
  };
}

interface ContactsTableProps {
  searchQuery: string;
  onEdit: (contact: Contact) => void;
  refreshTrigger: number;
}

export function ContactsTable({
  searchQuery,
  onEdit,
  refreshTrigger,
}: ContactsTableProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        const data = await getContacts();
        setContacts(data);
        setFilteredContacts(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
        setLoading(false);
      }
    };

    fetchContacts();
  }, [refreshTrigger]); // Refetch when refreshTrigger changes

  useEffect(() => {
    if (searchQuery) {
      const filtered = contacts.filter(
        (contact) =>
          `${contact.firstName} ${contact.lastName}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.phone.includes(searchQuery)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteContact(deleteId);
      setContacts(contacts.filter((contact) => contact.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredContacts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No contacts found.
              </TableCell>
            </TableRow>
          ) : (
            filteredContacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">
                  {contact.firstName} {contact.lastName}
                </TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.phone}</TableCell>
                <TableCell>{contact.company?.name || "-"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(contact)}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(contact.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contact and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
