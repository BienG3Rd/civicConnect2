"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OfficialRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    officialId: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Registration logic would go here
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Official Registration</CardTitle>
            <CardDescription>Register as a government official to access the CivicConnect platform</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="john@city.gov"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Position</label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData({ ...formData, position: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mayor">Mayor</SelectItem>
                    <SelectItem value="deputy-mayor">Deputy Mayor</SelectItem>
                    <SelectItem value="commissioner">Commissioner</SelectItem>
                    <SelectItem value="director">Director</SelectItem>
                    <SelectItem value="councilor">City Councilor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Department</label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city-hall">City Hall</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="parks-recreation">Parks & Recreation</SelectItem>
                    <SelectItem value="public-works">Public Works</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Official ID / Employee Number</label>
                <Input
                  type="text"
                  placeholder="e.g., OFF-2025-001"
                  value={formData.officialId}
                  onChange={(e) => setFormData({ ...formData, officialId: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium mb-1">Official Registration Notice</p>
                <p>
                  Your registration will be verified by the system administrator. Verification may take 24-48 hours.
                </p>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
                {isLoading ? "Registering..." : "Register as Official"}
              </Button>
            </form>

            <p className="text-sm text-foreground/60 text-center mt-4">
              Are you a citizen instead?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Register here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
