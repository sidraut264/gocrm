"use client";

import useSWR from "swr";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Search,
  Users,
  Mail,
  Phone,
  Edit,
  Trash2,
  Briefcase,
} from "lucide-react";
import NewContact from "@/components/contacts/NewContact";
import NewDeal from "@/components/deals/NewDeal";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ContactsPage() {
  const { data: contacts, mutate } = useSWR("/api/contacts", fetcher);
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = useMemo(() => {
    if (!contacts || !searchTerm) return contacts || [];
    return contacts.filter((contact: any) =>
      contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phone?.includes(searchTerm)
    );
  }, [contacts, searchTerm]);

  if (!contacts) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Loading contacts...
      </div>
    );
  }

  async function deleteContact(id: string) {
    try {
      await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      mutate();
    } catch (error) {
      console.error("Failed to delete contact:", error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-6 w-6 text-muted-foreground" />
            Contacts
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your contact list ({contacts.length} total)
          </p>
        </div>
        <NewContact />
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              {searchTerm ? "No contacts found" : "No contacts yet"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by adding your first contact"}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold text-foreground">Name</TableHead>
                <TableHead className="font-semibold text-foreground">Contact Info</TableHead>
                <TableHead className="font-semibold text-foreground">Company / Notes</TableHead>
                <TableHead className="font-semibold text-foreground text-center">Deals</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact: any) => (
                <TableRow key={contact.id} className="hover:bg-muted/20">
                  <TableCell>
                    <div className="font-medium text-foreground">{contact.name}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {contact.email || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {contact.phone || "-"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div>{contact.company || "-"}</div>
                      <div>{contact.notes || "-"}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Briefcase className="h-3 w-3" />
                      {contact.deals?.length || 0}
                      <NewDeal contactId={contact.id} onDealCreated={mutate} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 hover:bg-muted/30"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 bg-card border-border"
                      >
                        <DropdownMenuItem
                          onClick={() => router.push(`/contacts/${contact.id}`)}
                          className="cursor-pointer"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-500 cursor-pointer focus:text-red-500"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-card border border-border">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground">
                                Delete {contact.name}?
                              </AlertDialogTitle>
                              <p className="text-sm text-muted-foreground">
                                This action cannot be undone. This will
                                permanently delete the contact.
                              </p>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteContact(contact.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
