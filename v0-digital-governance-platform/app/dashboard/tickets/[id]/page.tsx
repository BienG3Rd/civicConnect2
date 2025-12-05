"use client"

import { useState } from "react"
import { ArrowLeft, CheckCircle2, Clock, AlertCircle, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const dummyTicket = {
  id: "TCK-2025-001",
  title: "Pothole on Main Street causing vehicle damage",
  description:
    "There are several potholes on Main Street near the market that have caused damage to multiple vehicles. This needs urgent repair.",
  status: "in_progress",
  priority: "high",
  category: "Infrastructure",
  location: "Main Street, Market District",
  createdAt: "2025-01-15",
  updatedAt: "2025-01-18",
  dueDate: "2025-02-15",
  citizen: {
    name: "Sarah Johnson",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  assignedOfficial: {
    name: "Mayor Robert Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
  },
  updates: [
    {
      id: 1,
      author: "Mayor Robert Chen",
      role: "Assigned Official",
      message: "We have assigned a team to assess the damage and create a repair plan.",
      timestamp: "2025-01-17",
      type: "status",
    },
    {
      id: 2,
      author: "Sarah Johnson",
      role: "Citizen",
      message: "Thank you! This is really affecting people's safety on that street.",
      timestamp: "2025-01-16",
      type: "comment",
    },
    {
      id: 3,
      author: "Mayor Robert Chen",
      role: "Assigned Official",
      message: "Ticket has been received and logged in our system for processing.",
      timestamp: "2025-01-15",
      type: "status",
    },
  ],
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const [comment, setComment] = useState("")

  const statusConfig: Record<string, { icon: any; color: string; text: string }> = {
    open: { icon: AlertCircle, color: "text-red-500", text: "Open" },
    in_progress: { icon: Clock, color: "text-yellow-500", text: "In Progress" },
    resolved: { icon: CheckCircle2, color: "text-green-500", text: "Resolved" },
  }

  const currentStatus = statusConfig[dummyTicket.status as keyof typeof statusConfig]

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{dummyTicket.title}</h1>
              <p className="text-muted-foreground">Ticket ID: {dummyTicket.id}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant={dummyTicket.priority === "high" ? "destructive" : "secondary"}>
                {dummyTicket.priority.toUpperCase()}
              </Badge>
              <Badge className="bg-primary text-primary-foreground flex items-center gap-2">
                <currentStatus.icon className="w-3 h-3" />
                {currentStatus.text}
              </Badge>
            </div>
          </div>

          {/* Key Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{dummyTicket.category}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-medium">{dummyTicket.location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">{dummyTicket.createdAt}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Due Date</p>
              <p className="font-medium">{dummyTicket.dueDate}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="updates">Updates ({dummyTicket.updates.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground leading-relaxed">{dummyTicket.description}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {dummyTicket.updates.map((update) => (
                        <div key={update.id} className="flex gap-4">
                          <Avatar>
                            <AvatarFallback>{update.author[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium">{update.author}</p>
                              <Badge variant="outline" className="text-xs">
                                {update.role}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{update.timestamp}</p>
                            <p className="text-foreground">{update.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Comment Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Add Comment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Share your thoughts or provide an update..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-24"
                  />
                  <Button>Post Comment</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Citizen Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Reported By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={dummyTicket.citizen.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{dummyTicket.citizen.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{dummyTicket.citizen.name}</p>
                    <p className="text-xs text-muted-foreground">Citizen</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Official */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assigned To</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={dummyTicket.assignedOfficial.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{dummyTicket.assignedOfficial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{dummyTicket.assignedOfficial.name}</p>
                    <p className="text-xs text-muted-foreground">Mayor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
