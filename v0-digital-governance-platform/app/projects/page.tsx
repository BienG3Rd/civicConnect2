"use client"

import { MapPin, Users, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"

const dummyProjects = [
  {
    id: "PRJ-001",
    name: "Main Street Renovation",
    description: "Complete renovation of Main Street including new sidewalks, street lighting, and landscaping.",
    status: "in_progress",
    budget: 2500000,
    spent: 1650000,
    startDate: "2024-06-01",
    endDate: "2025-06-01",
    completion: 66,
    location: "Main Street District",
    official: "Mayor Robert Chen",
    impact: "Improved infrastructure and community spaces",
  },
  {
    id: "PRJ-002",
    name: "Community Park Development",
    description: "Construction of a new 5-acre community park with playgrounds, sports facilities, and green spaces.",
    status: "completed",
    budget: 1800000,
    spent: 1800000,
    startDate: "2023-09-01",
    endDate: "2024-12-15",
    completion: 100,
    location: "North District",
    official: "Deputy Mayor Sarah Williams",
    impact: "Enhanced recreational facilities and community gathering space",
  },
  {
    id: "PRJ-003",
    name: "School Infrastructure Upgrade",
    description: "Upgrading computer labs, libraries, and classroom facilities in 5 public schools.",
    status: "in_progress",
    budget: 3200000,
    spent: 1350000,
    startDate: "2024-08-15",
    endDate: "2025-08-15",
    completion: 42,
    location: "Multiple Schools",
    official: "Education Commissioner James Mitchell",
    impact: "Better learning environment and digital access for students",
  },
  {
    id: "PRJ-004",
    name: "Public Transportation Initiative",
    description: "Expansion of bus routes and introduction of new electric buses for sustainable transport.",
    status: "planning",
    budget: 5000000,
    spent: 250000,
    startDate: "2025-03-01",
    endDate: "2026-12-31",
    completion: 5,
    location: "City-wide",
    official: "Transport Director Maria Garcia",
    impact: "Reduced traffic congestion and carbon emissions",
  },
  {
    id: "PRJ-005",
    name: "Water Supply Enhancement",
    description: "Upgrading water treatment facilities and pipe infrastructure for improved quality and reliability.",
    status: "in_progress",
    budget: 4500000,
    spent: 1890000,
    startDate: "2024-04-01",
    endDate: "2025-10-01",
    completion: 42,
    location: "City-wide Infrastructure",
    official: "Public Utilities Director Ahmed Hassan",
    impact: "Safe drinking water and improved water management",
  },
  {
    id: "PRJ-006",
    name: "Digital Government Services",
    description: "Launch of digital platforms for permit applications, bill payments, and citizen complaints.",
    status: "completed",
    budget: 800000,
    spent: 795000,
    startDate: "2024-01-15",
    endDate: "2024-09-30",
    completion: 100,
    location: "Online Platform",
    official: "IT Director Lisa Thompson",
    impact: "Improved accessibility and reduced bureaucracy",
  },
]

export default function ProjectsPage() {
  const statusConfig: Record<string, { text: string; variant: any }> = {
    planning: { text: "Planning", variant: "secondary" },
    in_progress: { text: "In Progress", variant: "default" },
    completed: { text: "Completed", variant: "outline" },
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Development Projects</h1>
          <p className="text-lg text-muted-foreground">
            Track progress on major development initiatives across the city
          </p>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {dummyProjects.map((project) => {
            const statusInfo = statusConfig[project.status as keyof typeof statusConfig]
            const budgetUtilization = Math.round((project.spent / project.budget) * 100)

            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex-1">
                      <CardTitle>{project.name}</CardTitle>
                      <CardDescription>{project.id}</CardDescription>
                    </div>
                    <Badge variant={statusInfo.variant as any}>{statusInfo.text}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Description */}
                  <p className="text-sm text-foreground">{project.description}</p>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Overall Progress</span>
                      <span className="text-sm text-muted-foreground">{project.completion}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${project.completion}%` }} />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium">{project.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Users className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Official</p>
                        <p className="text-sm font-medium">{project.official}</p>
                      </div>
                    </div>
                  </div>

                  {/* Budget Info */}
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Budget Utilization</span>
                      <span className="text-sm font-bold text-primary">{budgetUtilization}%</span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>Budget: ${(project.budget / 1000000).toFixed(1)}M</p>
                      <p>Spent: ${(project.spent / 1000000).toFixed(2)}M</p>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <p>
                      {project.startDate} to {project.endDate}
                    </p>
                  </div>

                  {/* Impact */}
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-primary mb-1">Expected Impact</p>
                    <p className="text-sm text-foreground">{project.impact}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
