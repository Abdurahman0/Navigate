"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi, type LeadRecord } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminDashboardPage({ params }: { params: { locale: string } }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ newLeadsLast7Days: 0, totalLeads: 0, enrollments: 0, conversionRate: 0 });
  const [recentLeads, setRecentLeads] = useState<LeadRecord[]>([]);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const data = await adminApi.dashboard();
        if (!active) return;
        setStats(data.stats);
        setRecentLeads(data.recentLeads);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardTitle>New Leads (7d)</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.newLeadsLast7Days}</CardContent></Card>
        <Card><CardHeader><CardTitle>Total Leads</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.totalLeads}</CardContent></Card>
        <Card><CardHeader><CardTitle>Enrollments</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.enrollments}</CardContent></Card>
        <Card><CardHeader><CardTitle>Conversion</CardTitle></CardHeader><CardContent className="text-2xl font-bold">{stats.conversionRate}%</CardContent></Card>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Leads</CardTitle>
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link href={`/${params.locale}/admin/courses`}>Add Course</Link></Button>
            <Button asChild><Link href={`/${params.locale}/admin/teachers`}>Add Teacher</Link></Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? <p className="text-sm text-muted-foreground">Loading...</p> : (
            <div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Created</TableHead><TableHead>Name</TableHead><TableHead>Phone</TableHead><TableHead>Exam</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{recentLeads.map((lead) => (<TableRow key={lead.id}><TableCell>{new Date(lead.createdAt).toLocaleString()}</TableCell><TableCell>{lead.fullName}</TableCell><TableCell>{lead.phoneNumber}</TableCell><TableCell>{lead.examInterest}</TableCell><TableCell>{lead.status}</TableCell></TableRow>))}</TableBody></Table></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
