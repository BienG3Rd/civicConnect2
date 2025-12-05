"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Send, Download, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const [status, setStatus] = useState("in-progress")
  const [comment, setComment] = useState("")

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link
              href="/official/dashboard?tab=tickets"
              className="flex items-center gap-2 text-foreground/70 hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tickets
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">Pothole on Main Street</CardTitle>
                    <CardDescription>Ticket #1001</CardDescription>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">in-progress</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-foreground/70">
                    Large pothole on Main Street between 5th and 6th Avenue causing hazards to vehicles and pedestrians.
                    Needs immediate repair.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Priority</p>
                    <Badge variant="destructive">High</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Category</p>
                    <Badge variant="outline">Infrastructure</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Submitted</p>
                    <p className="font-medium text-foreground">April 10, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60 mb-1">Days Open</p>
                    <p className="font-medium text-foreground">5 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Updates */}
            <Card>
              <CardHeader>
                <CardTitle>Updates & Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* System update */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Status updated to In Progress</p>
                    <p className="text-sm text-foreground/60">April 12, 2025 - 10:30 AM</p>
                  </div>
                </div>

                {/* Official comment */}
                <div className="flex gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                    <span className="text-xs font-semibold text-accent">JD</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">John Smith - Department Head</p>
                    <p className="text-sm text-foreground/70 mt-2">
                      We have assigned a crew to assess and repair the pothole. Expected completion within 3 days.
                    </p>
                    <p className="text-xs text-foreground/60 mt-2">April 12, 2025 - 9:15 AM</p>
                  </div>
                </div>

                {/* Add update */}
                <div className="border-t border-border pt-4 mt-4">
                  <label className="block text-sm font-medium mb-2">Add Update</label>
                  <textarea
                    placeholder="Post an update or response to the citizen..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full min-h-[100px] p-3 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button className="mt-3 bg-primary hover:bg-primary/90">
                    <Send className="h-4 w-4 mr-2" />
                    Post Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Citizen Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reported By</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-foreground">John Doe</p>
                <p className="text-sm text-foreground/60 mt-1">john.doe@email.com</p>
                <p className="text-sm text-foreground/60">+1 (555) 123-4567</p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium text-foreground">Main Street</p>
                <p className="text-sm text-foreground/60">Between 5th and 6th Avenue</p>
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Update Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="w-full mt-3 bg-primary hover:bg-primary/90">Save Status</Button>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 p-2 rounded hover:bg-muted transition-colors">
                    <Download className="h-4 w-4 text-primary" />
                    <span className="text-sm text-foreground">pothole_photo.jpg</span>
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
