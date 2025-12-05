"use client"

import { Search, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"

const dummyTickets = [
  {
    id: "TCK-2025-001",
    title: "Pothole on Main Street causing vehicle damage",
    category: "Infrastructure",
    status: "in_progress",
    priority: "high",
    assignedTo: "Mayor Robert Chen",
    createdDate: "2025-01-15",
    dueDate: "2025-02-15",
    resolution: null,
  },
  {
    id: "TCK-2025-002",
    title: "Street lighting malfunction in North District",
    category: "Public Safety",
    status: "open",
    priority: "high",
    assignedTo: "Deputy Mayor Sarah Williams",
    createdDate: "2025-01-18",
    dueDate: "2025-02-05",
    resolution: null,
  },
  {
    id: "TCK-2025-003",
    title: "Noise complaint - construction near residential area",
    category: "Environment",
    status: "resolved",
    priority: "medium",
    assignedTo: "Transport Director Maria Garcia",
    createdDate: "2025-01-10",
    dueDate: "2025-01-25",
    resolution: "2025-01-22",
  },
  {
    id: "TCK-2025-004",
    title: "Water supply interruption in Central District",
    category: "Utilities",
    status: "resolved",
    priority: "high",
    assignedTo: "Public Utilities Director Ahmed Hassan",
    createdDate: "2025-01-12",
    dueDate: "2025-01-20",
    resolution: "2025-01-19",
  },
  {
    id: "TCK-2025-005",
    title: "Damaged playground equipment in South Park",
    category: "Recreation",
    status: "in_progress",
    priority: "medium",
    assignedTo: "Mayor Robert Chen",
    createdDate: "2025-01-16",
    dueDate: "2025-02-10",
    resolution: null,
  },
]

export default function AdminTicketsPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "in_progress":
        return "default"
      case "resolved":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-orange-600"
      default:
        return "text-blue-600"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Tickets Management</h1>
          <p className="text-lg text-muted-foreground">Monitor all citizen reports and complaints</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Tickets</p>
              <p className="text-3xl font-bold">145</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Open</p>
              <p className="text-3xl font-bold text-red-600">18</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">34</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Resolved</p>
              <p className="text-3xl font-bold text-green-600">93</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-64 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search tickets..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Tickets</CardTitle>
            <CardDescription>Citizen reports and complaints being tracked</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell className="max-w-xs">{ticket.title}</TableCell>
                      <TableCell>{ticket.category}</TableCell>
                      <TableCell>
                        <span className={`font-medium ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(ticket.status) as any}>
                          {ticket.status === "in_progress"
                            ? "In Progress"
                            : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{ticket.assignedTo}</TableCell>
                      <TableCell>{ticket.createdDate}</TableCell>
                      <TableCell>{ticket.dueDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
