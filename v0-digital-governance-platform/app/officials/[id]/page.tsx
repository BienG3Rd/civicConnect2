"use client"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const dummyOfficial = {
  id: "OFF-001",
  name: "Mayor Robert Chen",
  position: "Mayor",
  department: "City Hall",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
  bio: "Dedicated public servant with 15 years of experience in urban development and community engagement.",
  startDate: "2022-01-15",
  performanceScore: 78,
  scoreChange: 5,
  competencies: [
    { name: "Responsiveness", score: 82 },
    { name: "Project Delivery", score: 75 },
    { name: "Budget Management", score: 76 },
    { name: "Transparency", score: 77 },
    { name: "Innovation", score: 70 },
  ],
  scoreHistory: [
    { month: "Jan", score: 68 },
    { month: "Feb", score: 71 },
    { month: "Mar", score: 74 },
    { month: "Apr", score: 75 },
    { month: "May", score: 76 },
    { month: "Jun", score: 78 },
  ],
  statistics: {
    totalTickets: 142,
    resolvedTickets: 128,
    avgResolutionTime: "8 days",
    citizenSatisfaction: 78,
  },
  recentProjects: [
    { name: "Main Street Renovation", status: "In Progress", completion: 65 },
    { name: "Community Park Development", status: "Completed", completion: 100 },
    { name: "School Infrastructure Upgrade", status: "In Progress", completion: 42 },
  ],
  recentVotes: [
    { citizen: "Sarah Johnson", score: 85, date: "2025-01-20" },
    { citizen: "Mike Davis", score: 78, date: "2025-01-19" },
    { citizen: "Emma Wilson", score: 72, date: "2025-01-18" },
    { citizen: "John Smith", score: 80, date: "2025-01-17" },
  ],
}

export default function OfficialDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/officials">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Officials
          </Button>
        </Link>

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <div className="flex gap-6 items-start">
              <Avatar className="w-24 h-24">
                <AvatarImage src={dummyOfficial.avatar || "/placeholder.svg"} />
                <AvatarFallback>{dummyOfficial.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{dummyOfficial.name}</h1>
                <p className="text-lg text-primary font-medium mb-2">{dummyOfficial.position}</p>
                <p className="text-muted-foreground mb-4">{dummyOfficial.bio}</p>
                <div className="flex gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{dummyOfficial.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Office Since</p>
                    <p className="font-medium">{dummyOfficial.startDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Score Card */}
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">Overall Score</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">{dummyOfficial.performanceScore}</div>
              <p className="text-sm text-muted-foreground mb-4">Out of 100</p>
              <Badge className="bg-green-500 text-white">↑ {dummyOfficial.scoreChange} this month</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Tickets</p>
              <p className="text-2xl font-bold">{dummyOfficial.statistics.totalTickets}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Resolved</p>
              <p className="text-2xl font-bold">{dummyOfficial.statistics.resolvedTickets}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Avg Resolution</p>
              <p className="text-2xl font-bold">{dummyOfficial.statistics.avgResolutionTime}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Citizen Satisfaction</p>
              <p className="text-2xl font-bold">{dummyOfficial.statistics.citizenSatisfaction}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="votes">Recent Votes</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Score History */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Score Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      score: { label: "Score", color: "hsl(var(--primary))" },
                    }}
                    className="h-64"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={dummyOfficial.scoreHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Competencies */}
              <Card>
                <CardHeader>
                  <CardTitle>Competency Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dummyOfficial.competencies.map((comp) => (
                      <div key={comp.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">{comp.name}</span>
                          <span className="text-sm text-muted-foreground">{comp.score}/100</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${comp.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-4">
              {dummyOfficial.recentProjects.map((project) => (
                <Card key={project.name}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted-foreground">{project.status}</p>
                      </div>
                      <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                        {project.completion}%
                      </Badge>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${project.completion}%` }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="votes">
            <div className="space-y-4">
              {dummyOfficial.recentVotes.map((vote) => (
                <Card key={vote.date}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{vote.citizen}</p>
                        <p className="text-sm text-muted-foreground">{vote.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{vote.score}</p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
