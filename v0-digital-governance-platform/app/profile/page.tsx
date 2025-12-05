"use client"

import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"

const dummyUserProfile = {
  id: "USR-2025-001",
  name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  phone: "+1 (555) 123-4567",
  location: "Market District",
  joinDate: "2024-06-15",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  type: "citizen",
  bio: "Passionate about community development and transparent governance.",
  verified: true,
  statistics: {
    ticketsCreated: 12,
    votesParticipated: 28,
    reportsResolved: 9,
  },
  recentActivity: [
    { type: "ticket_created", description: "Created ticket about pothole on Main Street", date: "2025-01-20" },
    { type: "vote_submitted", description: "Voted in evaluation of Mayor Robert Chen", date: "2025-01-19" },
    { type: "comment_posted", description: "Added comment on Park Development project", date: "2025-01-18" },
    { type: "ticket_created", description: "Created ticket about street lighting", date: "2025-01-15" },
  ],
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Profile Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-6 items-start">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={dummyUserProfile.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{dummyUserProfile.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h1 className="text-3xl font-bold">{dummyUserProfile.name}</h1>
                      {dummyUserProfile.verified && <Badge className="bg-green-500">Verified</Badge>}
                    </div>
                    <p className="text-muted-foreground mb-4">{dummyUserProfile.bio}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {dummyUserProfile.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {dummyUserProfile.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        {dummyUserProfile.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        Member since {dummyUserProfile.joinDate}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Tickets Created</p>
                <p className="text-3xl font-bold text-primary">{dummyUserProfile.statistics.ticketsCreated}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Votes Participated</p>
                <p className="text-3xl font-bold text-primary">{dummyUserProfile.statistics.votesParticipated}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reports Resolved</p>
                <p className="text-3xl font-bold text-primary">{dummyUserProfile.statistics.reportsResolved}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Your recent interactions on CivicConnect</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dummyUserProfile.recentActivity.map((activity, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email Notifications</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-sm">Ticket updates</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-sm">New evaluations available</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm">Weekly digest</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="mr-2 bg-transparent">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
