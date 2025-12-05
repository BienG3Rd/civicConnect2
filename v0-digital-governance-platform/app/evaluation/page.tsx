"use client"

import { useState } from "react"
import { Star, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"

export default function EvaluationPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedOfficial, setSelectedOfficial] = useState<number | null>(null)

  // Mock officials data
  const officials = [
    {
      id: 1,
      name: "John Smith",
      position: "Department Head - Infrastructure",
      department: "Public Works",
      score: 4.6,
      votes: 234,
      responsiveness: 88,
      projectDelivery: 82,
      citizenFeedback: 85,
      budget: 75,
      transparency: 92,
      projects: 12,
      resolutionRate: 89,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      position: "City Councilor - District 3",
      department: "City Council",
      score: 4.2,
      votes: 198,
      responsiveness: 82,
      projectDelivery: 78,
      citizenFeedback: 80,
      budget: 70,
      transparency: 88,
      projects: 8,
      resolutionRate: 81,
    },
    {
      id: 3,
      name: "Michael Chen",
      position: "Budget Director",
      department: "Finance",
      score: 3.8,
      votes: 156,
      responsiveness: 75,
      projectDelivery: 72,
      citizenFeedback: 74,
      budget: 85,
      transparency: 80,
      projects: 6,
      resolutionRate: 72,
    },
  ]

  const filteredOfficials = officials.filter(
    (official) =>
      official.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      official.position.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Header />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Rate Your Officials</h1>
          <p className="text-foreground/60 mt-2">
            Help other citizens make informed decisions by evaluating official performance. Your verified vote counts!
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-foreground/40" />
            <Input
              placeholder="Search by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Officials List */}
        {selectedOfficial ? (
          // Detail View
          <div className="space-y-6">
            {filteredOfficials
              .filter((o) => o.id === selectedOfficial)
              .map((official) => (
                <div key={official.id} className="space-y-6">
                  <Button variant="outline" onClick={() => setSelectedOfficial(null)} className="mb-4">
                    Back to List
                  </Button>

                  {/* Header Card */}
                  <Card>
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <CardTitle className="text-2xl">{official.name}</CardTitle>
                          <CardDescription className="mt-2">{official.position}</CardDescription>
                          <p className="text-sm text-foreground/60 mt-1">{official.department}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-4xl font-bold text-primary">{official.score.toFixed(1)}</div>
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(official.score) ? "fill-primary text-primary" : "text-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-foreground/60 mt-1">{official.votes} verified votes</p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Responsiveness</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">{official.responsiveness}%</div>
                        <div className="h-2 rounded-full bg-muted mt-2">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${official.responsiveness}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Project Delivery</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">{official.projectDelivery}%</div>
                        <div className="h-2 rounded-full bg-muted mt-2">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${official.projectDelivery}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Citizen Feedback</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">{official.citizenFeedback}%</div>
                        <div className="h-2 rounded-full bg-muted mt-2">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${official.citizenFeedback}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Budget Management</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">{official.budget}%</div>
                        <div className="h-2 rounded-full bg-muted mt-2">
                          <div className="h-full rounded-full bg-accent" style={{ width: `${official.budget}%` }} />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Transparency</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">{official.transparency}%</div>
                        <div className="h-2 rounded-full bg-muted mt-2">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${official.transparency}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-accent">{official.resolutionRate}%</div>
                        <div className="h-2 rounded-full bg-muted mt-2">
                          <div
                            className="h-full rounded-full bg-accent"
                            style={{ width: `${official.resolutionRate}%` }}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Evaluation Form */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Leave Your Evaluation</CardTitle>
                      <CardDescription>Your verified vote helps hold officials accountable</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium mb-3">Your Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button key={rating} className="p-2 rounded-lg hover:bg-muted transition-colors">
                              <Star className="h-8 w-8 fill-primary text-primary" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Evaluation Category</label>
                        <select className="w-full p-2 border border-input rounded-md bg-background text-foreground">
                          <option>Overall Performance</option>
                          <option>Responsiveness</option>
                          <option>Project Delivery</option>
                          <option>Budget Management</option>
                          <option>Transparency</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Comments (Optional)</label>
                        <textarea
                          placeholder="Share your experience working with this official..."
                          className="w-full min-h-[100px] p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="flex gap-4 bg-blue-50 p-4 rounded-lg">
                        <div className="flex-shrink-0">
                          <Badge className="bg-blue-100 text-blue-800">Verified</Badge>
                        </div>
                        <p className="text-sm text-blue-800">
                          Your vote is verified and secure. Only verified citizens can vote to prevent manipulation.
                        </p>
                      </div>

                      <Button className="w-full bg-primary hover:bg-primary/90">Submit Evaluation</Button>
                    </CardContent>
                  </Card>

                  {/* Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div>
                          <p className="text-sm text-foreground/60">Active Projects</p>
                          <p className="text-2xl font-bold text-foreground">{official.projects}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Issues Resolved</p>
                          <p className="text-2xl font-bold text-accent">87</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/60">Avg Response Time</p>
                          <p className="text-2xl font-bold text-foreground">1.2 days</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
          </div>
        ) : (
          // List View
          <div className="grid grid-cols-1 gap-4">
            {filteredOfficials.map((official) => (
              <Card
                key={official.id}
                className="hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => setSelectedOfficial(official.id)}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{official.name}</h3>
                      <p className="text-sm text-foreground/60 mt-1">{official.position}</p>
                      <div className="flex gap-2 mt-3">
                        <Badge variant="outline">{official.department}</Badge>
                        <Badge variant="outline">{official.projects} projects</Badge>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="text-right">
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
                        <p className="text-xs text-foreground/60 mt-2">{official.votes} votes</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-5 text-center">
                    <div>
                      <p className="text-xs text-foreground/60">Responsiveness</p>
                      <p className="font-semibold text-foreground">{official.responsiveness}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60">Project Delivery</p>
                      <p className="font-semibold text-foreground">{official.projectDelivery}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60">Citizen Feedback</p>
                      <p className="font-semibold text-foreground">{official.citizenFeedback}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60">Budget Mgmt</p>
                      <p className="font-semibold text-foreground">{official.budget}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/60">Transparency</p>
                      <p className="font-semibold text-foreground">{official.transparency}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredOfficials.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-foreground/60">No officials found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
