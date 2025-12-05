"use client"

import { useState } from "react"
import { Star, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Header } from "@/components/header"

export default function OfficialsPage() {
  const [sortBy, setSortBy] = useState("score")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock rankings data
  const rankings = [
    {
      rank: 1,
      name: "John Smith",
      position: "Department Head",
      score: 4.6,
      votes: 234,
      trend: "up",
      trendPercent: 12,
    },
    {
      rank: 2,
      name: "Sarah Johnson",
      position: "City Councilor",
      score: 4.2,
      votes: 198,
      trend: "up",
      trendPercent: 8,
    },
    {
      rank: 3,
      name: "Michael Chen",
      position: "Budget Director",
      score: 3.8,
      votes: 156,
      trend: "down",
      trendPercent: -3,
    },
  ]

  const performanceData = [
    { name: "Responsiveness", score: 82 },
    { name: "Project Delivery", score: 78 },
    { name: "Citizen Feedback", score: 80 },
    { name: "Budget Management", score: 72 },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Official Rankings</h1>
          <p className="text-foreground/60 mt-2">
            Transparent, verified rankings based on citizen evaluations and performance metrics
          </p>
        </div>

        <Tabs defaultValue="rankings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="insights">Performance Insights</TabsTrigger>
          </TabsList>

          {/* Rankings Tab */}
          <TabsContent value="rankings" className="space-y-6">
            <div className="space-y-4">
              {rankings.map((official) => (
                <Card key={official.rank} className="hover:border-primary/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                        {official.rank}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{official.name}</h3>
                        <p className="text-sm text-foreground/60">{official.position}</p>
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <div className="text-3xl font-bold text-primary">{official.score.toFixed(1)}</div>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Math.floor(official.score) ? "fill-primary text-primary" : "text-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-foreground/60 mt-2">{official.votes} verified votes</p>

                        {official.trend && (
                          <div
                            className={`flex items-center gap-1 justify-end mt-2 ${
                              official.trend === "up" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            <ArrowUpRight className={`h-4 w-4 ${official.trend === "down" ? "rotate-180" : ""}`} />
                            <span className="text-xs font-medium">{Math.abs(official.trendPercent)}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Evaluation Metrics Distribution</CardTitle>
                <CardDescription>Average scores across all officials</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    score: { label: "Score", color: "hsl(var(--chart-1))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="score" fill="var(--color-score)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Evaluations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground">1,847</div>
                  <p className="text-xs text-foreground/60 mt-1">Verified votes</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent">4.1</div>
                  <p className="text-xs text-foreground/60 mt-1">Out of 5.0</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Highest Rated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">4.8</div>
                  <p className="text-xs text-foreground/60 mt-1">John Smith</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
