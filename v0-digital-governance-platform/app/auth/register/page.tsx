"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  const [step, setStep] = useState<"type" | "form">("type")
  const [userType, setUserType] = useState<"citizen" | "official" | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Registration logic would go here
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
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join CivicConnect to participate in transparent governance</CardDescription>
          </CardHeader>
          <CardContent>
            {step === "type" ? (
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setUserType("citizen")
                    setStep("form")
                  }}
                  className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <h3 className="font-semibold text-foreground">I'm a Citizen</h3>
                  <p className="text-sm text-foreground/60 mt-1">Report issues and track official performance</p>
                </button>
                <button
                  onClick={() => {
                    setUserType("official")
                    setStep("form")
                  }}
                  className="w-full p-4 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all text-left"
                >
                  <h3 className="font-semibold text-foreground">I'm an Official</h3>
                  <p className="text-sm text-foreground/60 mt-1">Manage projects and respond to citizen concerns</p>
                </button>
              </div>
            ) : (
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
                    placeholder="your@email.com"
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Create Account
                </Button>
                <Button type="button" variant="outline" onClick={() => setStep("type")} className="w-full">
                  Back
                </Button>
              </form>
            )}
            <p className="text-sm text-foreground/60 text-center mt-4">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
