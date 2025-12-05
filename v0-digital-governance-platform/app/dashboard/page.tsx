"use client"

import { useState } from "react"
import Link from "next/link"
import { Ticket, Plus, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Header } from "@/components/header"

export default function CitizenDashboard() {
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Mock data
  const tickets = [
    {
      id: 1,
      title: "Pothole on Main Street",
      status: "in-progress",
      priority: "high",
      assignedTo: "John Smith",
      daysOpen: 5,
    },
    {
      id: 2,
      title: "Street Light Not Working",
      status: "resolved",
      priority: "medium",
      assignedTo: "Sarah Johnson",
      daysOpen: 2,
    },
    {
      id: 3,
      title: "Park Maintenance Request",
      status: "open",
      priority: "low",
      assignedTo: "Pending",
      daysOpen: 1,
    },
  ]

  const resolutionData = [
    { month: "Jan", resolved: 24, open: 12 },
    { month: "Feb", resolved: 28, open: 15 },
    { month: "Mar", resolved: 32, open: 10 },
    { month: "Apr", resolved: 35, open: 8 },
  ]

  const statusBadge = (status: string) => {
    const styles = {
      open: "bg-yellow-100 text-yellow-800",
      "in-progress": "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
    }
    return styles[status as keyof typeof styles] || styles["open"]
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Citizen Dashboard</h1>
          <p className="text-foreground/60 mt-2">Track your concerns and hold officials accountable</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">My Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">12</div>
              <p className="text-xs text-foreground/60 mt-1">3 open, 4 in progress</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">Resolved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">5</div>
              <p className="text-xs text-foreground/60 mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-foreground/70">Avg Resolution Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">3.2</div>
              <p className="text-xs text-foreground/60 mt-1">Days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-foreground/70">Officials Tracked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">8</div>
              <p className="text-xs text-foreground/60 mt-1">Active monitoring</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Issue Resolution Trend</CardTitle>
              <CardDescription>30-day history</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  resolved: { label: "Resolved", color: "hsl(var(--chart-1))" },
                  open: { label: "Open", color: "hsl(var(--chart-2))" },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resolutionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="resolved" fill="var(--color-resolved)" />
                    <Bar dataKey="open" fill="var(--color-open)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates on your tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                      <Ticket className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">Ticket #{1000 + i} Updated</p>
                      <p className="text-xs text-foreground/60 mt-1">Status changed to in-progress</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Tickets</CardTitle>
                <CardDescription>Issues you've reported and their status</CardDescription>
              </div>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/dashboard/create-ticket">
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
                  <Input placeholder="Search tickets..." className="pl-10" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Ticket</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Priority</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Assigned To</th>
                    <th className="text-left py-3 px-4 font-medium text-foreground/70">Days Open</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{ticket.title}</td>
                      <td className="py-3 px-4">
                        <Badge className={statusBadge(ticket.status)}>{ticket.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={ticket.priority === "high" ? "destructive" : "outline"}>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-foreground/70">{ticket.assignedTo}</td>
                      <td className="py-3 px-4 text-foreground/70">{ticket.daysOpen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
