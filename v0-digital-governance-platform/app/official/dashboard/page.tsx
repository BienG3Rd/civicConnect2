"use client"

import { useState } from "react"
import Link from "next/link"
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
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Header } from "@/components/header"

export default function OfficialDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const performanceScore = 78
  const performanceData = [
    { month: "Jan", score: 65 },
    { month: "Feb", score: 70 },
    { month: "Mar", score: 72 },
    { month: "Apr", score: 78 },
  ]

  const competencyData = [
    { category: "Responsiveness", value: 85 },
    { category: "Project Delivery", value: 78 },
    { category: "Budget Mgmt", value: 72 },
    { category: "Citizen Feedback", value: 80 },
    { category: "Transparency", value: 88 },
    { category: "Initiative", value: 75 },
  ]

  const pendingTickets = [
    {
      id: 1,
      title: "Pothole on Main Street",
      submitter: "John Doe",
      priority: "high",
      daysOpen: 5,
      status: "pending-response",
    },
    {
      id: 2,
      title: "Street Light Not Working",
      submitter: "Jane Smith",
      priority: "medium",
      daysOpen: 3,
      status: "assigned",
    },
  ]

  const activeProjects = [
    {
      id: 1,
      name: "Main Street Renovation",
      progress: 65,
      budget: "$500,000",
      spent: "$325,000",
      endDate: "2025-06-30",
      status: "on-track",
    },
    {
      id: 2,
      name: "Park Upgrade Initiative",
      progress: 40,
      budget: "$200,000",
      spent: "$80,000",
      endDate: "2025-08-15",
      status: "on-track",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Official Dashboard</h1>
          <p className="text-foreground/60 mt-2">Department Head - Infrastructure & Development</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tickets">Citizen Tickets</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Performance Score Card */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/70">Performance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">{performanceScore}</div>
                  <p className="text-xs text-foreground/60 mt-1">Excellent</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/70">Tickets Resolved</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">24</div>
                  <p className="text-xs text-foreground/60 mt-1">This quarter</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/70">Avg Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">1.8</div>
                  <p className="text-xs text-foreground/60 mt-1">Days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-foreground/70">Citizen Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary">4.2</div>
                  <p className="text-xs text-foreground/60 mt-1">Out of 5.0</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trend</CardTitle>
                  <CardDescription>Last 4 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      score: { label: "Score", color: "hsl(var(--chart-1))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-score)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-score)" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis domain={[60, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="var(--color-score)"
                          fillOpacity={1}
                          fill="url(#colorScore)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Competency Assessment</CardTitle>
                  <CardDescription>Multi-factor evaluation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "Score", color: "hsl(var(--chart-2))" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={competencyData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="Score"
                          dataKey="value"
                          stroke="var(--color-value)"
                          fill="var(--color-value)"
                          fillOpacity={0.6}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription>Current fiscal year allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Infrastructure", allocated: "$2.5M", spent: "$1.8M", percentage: 72 },
                    { category: "Maintenance", allocated: "$1.2M", spent: "$0.8M", percentage: 67 },
                    { category: "Safety", allocated: "$0.8M", spent: "$0.5M", percentage: 62 },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{item.category}</span>
                        <span className="text-foreground/60">
                          {item.spent} / {item.allocated}
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

          {/* Citizen Tickets Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Citizen Tickets</h2>
              <Badge variant="outline">12 Pending</Badge>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {pendingTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{ticket.title}</h3>
                        <p className="text-sm text-foreground/60 mt-1">From {ticket.submitter}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={ticket.priority === "high" ? "destructive" : "outline"}>
                            {ticket.priority}
                          </Badge>
                          <Badge variant="outline">{ticket.daysOpen} days open</Badge>
                        </div>
                      </div>
                      <Button asChild className="mt-4 sm:mt-0 sm:ml-4 bg-primary hover:bg-primary/90">
                        <Link href={`/official/tickets/${ticket.id}`}>View & Respond</Link>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-foreground">Active Projects</h2>
              <Button className="bg-primary hover:bg-primary/90">New Project</Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {activeProjects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.name}</CardTitle>
                        <CardDescription>Budget: {project.budget}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        {project.status === "on-track" ? "On Track" : "At Risk"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-foreground">Progress</span>
                        <span className="text-foreground/60">{project.progress}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">Spent</p>
                        <p className="font-semibold text-foreground">{project.spent}</p>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/60 mb-1">End Date</p>
                        <p className="font-semibold text-foreground">{project.endDate}</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full mt-2 bg-transparent">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
