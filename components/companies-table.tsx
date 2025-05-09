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
import { getCompanies, deleteCompany } from "@/lib/db/company";

interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
}

interface CompaniesTableProps {
  searchQuery: string;
  onEdit: (company: Company) => void;
  refreshTrigger: number;
}

export function CompaniesTable({
  searchQuery,
  onEdit,
  refreshTrigger,
}: CompaniesTableProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await getCompanies();
        setCompanies(data);
        setFilteredCompanies(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [refreshTrigger]); // Refetch when refreshTrigger changes

  useEffect(() => {
    if (searchQuery) {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchQuery, companies]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCompany(deleteId);
      setCompanies(companies.filter((company) => company.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.error("Failed to delete company:", error);
    }
  };

  if (loading && companies.length === 0) {
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
            <TableHead>Domain</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompanies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No companies found.
              </TableCell>
            </TableRow>
          ) : (
            filteredCompanies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.domain}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(company)}
                    >
                      <Edit className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteId(company.id)}
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
              company and all associated data.
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
