"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search, MoreHorizontal, Mail, Phone, Edit, Trash2, UserPlus
} from "lucide-react";
import NewLead from "@/components/leads/NewLead";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogContent, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function LeadsPage() {
  const { data: leads, mutate } = useSWR("/api/leads", fetcher);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const filteredLeads = useMemo(() => {
    const list = Array.isArray(leads) ? leads : [];

    if (!searchTerm) return list;

    return list.filter((lead: any) =>
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.includes(searchTerm)
    );
  }, [leads, searchTerm]);

  if (!leads) {
    return <div className="text-center py-10">Loading leads...</div>;
  }

  async function deleteLead(id: string) {
    await fetch(`/api/leads/${id}`, { method: "DELETE" });
    mutate();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-muted-foreground" />
            Leads
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your lead list ({leads.length} total)
          </p>
        </div>
        <NewLead onAdded={mutate} />
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {searchTerm ? "No leads found" : "No leads yet. Add one!"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Source / Status</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead: any) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" /> {lead.email || "-"}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3" /> {lead.phone || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div>{lead.source || "-"}</div>
                    <div>Status: {lead.status}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {lead.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/leads/${lead.id}`)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={async () => {
                            const res = await fetch(`/api/leads/${lead.id}/convert`, {
                              method: "POST",
                            });
                            if (res.ok) {
                              alert("Lead converted to contact!");
                              mutate(); // refresh leads
                            } else {
                              const err = await res.json();
                              alert("Error: " + err.error);
                            }
                          }}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Convert to Contact
                        </DropdownMenuItem>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-red-500"
                              onSelect={(e) => e.preventDefault()}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete {lead.name}?
                              </AlertDialogTitle>
                              <p className="text-sm text-muted-foreground">
                                This action cannot be undone.
                              </p>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button
                                variant="destructive"
                                onClick={() => deleteLead(lead.id)}
                              >
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
