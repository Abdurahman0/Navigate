"use client";
import { useEffect, useMemo, useState } from "react";
import { adminApi, type LeadRecord, type LeadStatus } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const statuses: LeadStatus[] = ["New", "Contacted", "Enrolled", "Rejected"];

export default function AdminLeadsPage() {
  const [items, setItems] = useState<LeadRecord[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "10");
    if (status !== "all") params.set("status", status);
    if (search.trim()) params.set("search", search.trim());
    return params.toString();
  }, [page, search, status]);

  async function fetchLeads() {
    const data = await adminApi.leads(query);
    setItems(data.items);
    setTotalPages(data.totalPages);
  }

  useEffect(() => { void fetchLeads(); }, [query]);

  async function updateStatus(id: string, nextStatus: LeadStatus) { await adminApi.updateLeadStatus(id, nextStatus); await fetchLeads(); }
  async function removeLead(id: string) { if (!confirm("Delete this lead?")) return; await adminApi.deleteLead(id); await fetchLeads(); }

  return (
    <Card>
      <CardHeader><CardTitle>Leads</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or phone" />
          <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">All</SelectItem>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select>
          <Button variant="outline" onClick={() => { setPage(1); void fetchLeads(); }}>Apply</Button>
        </div>
        <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Created</TableHead><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Exam</TableHead><TableHead>Source</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader><TableBody>{items.map((lead) => (<TableRow key={lead.id}><TableCell>{new Date(lead.createdAt).toLocaleString()}</TableCell><TableCell>{lead.fullName}</TableCell><TableCell>{lead.phoneNumber}</TableCell><TableCell>{lead.examInterest}</TableCell><TableCell>{lead.source}</TableCell><TableCell>{lead.status}</TableCell><TableCell className="text-right"><div className="flex justify-end gap-2"><Select value={lead.status} onValueChange={(value) => { void updateStatus(lead.id, value as LeadStatus); }}><SelectTrigger className="w-36"><SelectValue /></SelectTrigger><SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><Button variant="outline" className="text-red-600" onClick={() => { void removeLead(lead.id); }}>Delete</Button></div></TableCell></TableRow>))}</TableBody></Table></div>
        <div className="flex items-center justify-end gap-2"><Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</Button><span className="text-sm text-muted-foreground">{page} / {totalPages}</span><Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button></div>
      </CardContent>
    </Card>
  );
}
