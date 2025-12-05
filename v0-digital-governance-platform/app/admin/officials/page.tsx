"use client"

import { Search, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"

const dummyOfficials = [
  {
    id: "OFF-001",
    name: "Mayor Robert Chen",
    position: "Mayor",
    email: "robert.chen@city.gov",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    department: "City Hall",
    score: 78,
    tickets: 142,
    resolved: 128,
    status: "active",
  },
  {
    id: "OFF-002",
    name: "Deputy Mayor Sarah Williams",
    position: "Deputy Mayor",
    email: "sarah.williams@city.gov",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    department: "City Hall",
    score: 82,
    tickets: 156,
    resolved: 145,
    status: "active",
  },
  {
    id: "OFF-003",
    name: "Education Commissioner James Mitchell",
    position: "Commissioner",
    email: "james.mitchell@city.gov",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    department: "Education",
    score: 71,
    tickets: 98,
    resolved: 82,
    status: "active",
  },
  {
    id: "OFF-004",
    name: "Transport Director Maria Garcia",
    position: "Director",
    email: "maria.garcia@city.gov",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    department: "Transportation",
    score: 75,
    tickets: 120,
    resolved: 105,
    status: "active",
  },
  {
    id: "OFF-005",
    name: "Public Utilities Director Ahmed Hassan",
    position: "Director",
    email: "ahmed.hassan@city.gov",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    department: "Utilities",
    score: 79,
    tickets: 134,
    resolved: 118,
    status: "inactive",
  },
]

export default function AdminOfficialsPage() {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-blue-600"
    return "text-orange-600"
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Officials Management</h1>
          <p className="text-lg text-muted-foreground">Monitor and manage all city officials</p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search officials..." className="pl-10" />
              </div>
              <Button>Export Report</Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Officials</CardTitle>
            <CardDescription>{dummyOfficials.length} officials in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Official</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Performance Score</TableHead>
                    <TableHead className="text-right">Tickets</TableHead>
                    <TableHead className="text-right">Resolved</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dummyOfficials.map((official) => (
                    <TableRow key={official.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={official.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{official.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{official.name}</p>
                            <p className="text-xs text-muted-foreground">{official.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{official.position}</TableCell>
                      <TableCell>{official.department}</TableCell>
                      <TableCell className={`text-right font-bold ${getScoreColor(official.score)}`}>
                        {official.score}
                      </TableCell>
                      <TableCell className="text-right">{official.tickets}</TableCell>
                      <TableCell className="text-right">{official.resolved}</TableCell>
                      <TableCell>
                        <Badge variant={official.status === "active" ? "default" : "secondary"}>
                          {official.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </TableCell>
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
