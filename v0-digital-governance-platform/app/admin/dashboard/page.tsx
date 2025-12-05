"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertTriangle, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState("30d")

  // Mock data
  const systemStats = {
    totalUsers: 12847,
    citizens: 11200,
    officials: 847,
    activeTickets: 234,
    resolvedTickets: 1892,
    averageResolution: 2.4,
    systemUptime: 99.8,
  }

  const ticketTrendData = [
    { month: "Jan", open: 45, resolved: 120, pending: 30 },
    { month: "Feb", open: 52, resolved: 145, pending: 25 },
    { month: "Mar", open: 48, resolved: 165, pending: 20 },
    { month: "Apr", open: 38, resolved: 180, pending: 15 },
  ]

  const budgetData = [
    { official: "John Smith", allocated: 2500, spent: 1800, percentage: 72 },
    { official: "Sarah Johnson", allocated: 2000, spent: 1400, percentage: 70 },
    { official: "Michael Chen", allocated: 1500, spent: 950, percentage: 63 },
  ]

  const flaggedActivities = [
    {
      id: 1,
      type: "budget-anomaly",
      description: "Unusual spending pattern detected for official #234",
      severity: "medium",
      date: "2025-04-15",
    },
    {
      id: 2,
      type: "duplicate-vote",
      description: "Potential duplicate votes detected on official rankings",
      severity: "high",
      date: "2025-04-14",
    },
    {
      id: 3,
      type: "delayed-response",
      description: "45 tickets without official response exceeding SLA",
      severity: "medium",
      date: "2025-04-13",
    },
  ]

  const categoryDistribution = [
    { name: "Infrastructure", value: 342, color: "hsl(var(--chart-1))" },
    { name: "Sanitation", value: 287, color: "hsl(var(--chart-2))" },
    { name: "Safety", value: 234, color: "hsl(var(--chart-3))" },
    { name: "Utilities", value: 156, color: "hsl(var(--chart-4))" },
    { name: "Other", value: 123, color: "hsl(var(--chart-5))" },
  ]

  const severityBadge = (severity: string) => {
    const styles = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    }
    return styles[severity as keyof typeof styles] || styles["low"]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                CC
              </div>
              <span className="text-xl font-bold text-primary hidden sm:inline">CivicConnect Admin</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-foreground/70">Admin Portal</span>
              <Button variant="ghost" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-foreground/60 mt-2">System oversight, analytics, and compliance monitoring</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{systemStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-foreground/60 mt-1">
                {systemStats.citizens.toLocaleString()} citizens, {systemStats.officials} officials
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">Active Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{systemStats.activeTickets}</div>
              <p className="text-xs text-foreground/60 mt-1">{systemStats.resolvedTickets.toLocaleString()} resolved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">Avg Resolution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{systemStats.averageResolution}</div>
              <p className="text-xs text-foreground/60 mt-1">Days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">System Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary">{systemStats.systemUptime}%</div>
              <p className="text-xs text-foreground/60 mt-1">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="analytics" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="audit">Audit Logs</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Trends</CardTitle>
                  <CardDescription>Open, Resolved, and Pending tickets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      open: { label: "Open", color: "hsl(var(--chart-1))" },
                      resolved: { label: "Resolved", color: "hsl(var(--chart-2))" },
                      pending: { label: "Pending", color: "hsl(var(--chart-3))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ticketTrendData}>
                        <defs>
                          <linearGradient id="colorOpen" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-open)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-open)" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-resolved)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-resolved)" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="open"
                          stackId="1"
                          stroke="var(--color-open)"
                          fill="url(#colorOpen)"
                        />
                        <Area
                          type="monotone"
                          dataKey="resolved"
                          stackId="1"
                          stroke="var(--color-resolved)"
                          fill="url(#colorResolved)"
                        />
                        <Area
                          type="monotone"
                          dataKey="pending"
                          stackId="1"
                          stroke="var(--color-pending)"
                          fill="var(--color-pending)"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ticket Category Distribution</CardTitle>
                  <CardDescription>Breakdown by issue type</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "Count", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
                <CardDescription>Spending vs. allocation by official</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetData.map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-foreground">{item.official}</span>
                        <span className="text-foreground/60">
                          ${item.spent.toLocaleString()}K / ${item.allocated.toLocaleString()}K ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${item.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">94.2%</div>
                  <p className="text-xs text-foreground/60 mt-1">Response time target met</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Data Integrity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">99.9%</div>
                  <p className="text-xs text-foreground/60 mt-1">Audit log completeness</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">98.5%</div>
                  <p className="text-xs text-foreground/60 mt-1">Last scan</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-red-100 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Flagged Activities
                </CardTitle>
                <CardDescription>Items requiring investigation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {flaggedActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start justify-between p-3 bg-background rounded-lg border border-border"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{activity.description}</p>
                        <p className="text-xs text-foreground/60 mt-1">{activity.date}</p>
                      </div>
                      <Badge className={severityBadge(activity.severity)}>{activity.severity}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Logs Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>System Audit Log</CardTitle>
                    <CardDescription>All system activities tracked for transparency</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-foreground/70">Timestamp</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground/70">User</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground/70">Action</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground/70">Resource</th>
                        <th className="text-left py-3 px-4 font-medium text-foreground/70">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          time: "2025-04-15 14:32",
                          user: "john_smith",
                          action: "Updated ticket",
                          resource: "Ticket #1045",
                          status: "Success",
                        },
                        {
                          time: "2025-04-15 14:28",
                          user: "admin_user",
                          action: "Generated report",
                          resource: "April Report",
                          status: "Success",
                        },
                        {
                          time: "2025-04-15 13:45",
                          user: "sarah_j",
                          action: "Submitted evaluation",
                          resource: "Official #234",
                          status: "Success",
                        },
                      ].map((log, i) => (
                        <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
                          <td className="py-3 px-4 text-foreground/70">{log.time}</td>
                          <td className="py-3 px-4 text-foreground">{log.user}</td>
                          <td className="py-3 px-4 text-foreground">{log.action}</td>
                          <td className="py-3 px-4 text-foreground">{log.resource}</td>
                          <td className="py-3 px-4">
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              {log.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportable Reports</CardTitle>
                <CardDescription>Generate and download comprehensive system reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Monthly Performance Report", date: "2025-04-15", type: "PDF" },
                    { name: "Budget Utilization Analysis", date: "2025-04-15", type: "Excel" },
                    { name: "Citizen Satisfaction Summary", date: "2025-04-14", type: "PDF" },
                    { name: "System Compliance Report", date: "2025-04-13", type: "PDF" },
                  ].map((report, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-foreground">{report.name}</p>
                        <p className="text-xs text-foreground/60 mt-1">Generated {report.date}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{report.type}</Badge>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
