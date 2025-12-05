"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronRight, BarChart3, Users, CheckCircle, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-background to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                CC
              </div>
              <span className="text-xl font-bold text-primary">CivicConnect</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                Sign In
              </Link>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="space-y-8 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Transparent Governance, <span className="text-primary">Connected Citizens</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-foreground/80">
            Hold leaders accountable. Track development projects. Report issues directly. CivicConnect bridges the gap
            between citizens and governance with real-time transparency.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row justify-center items-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8">
              <Link href="/register">
                Join as Citizen
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/official-register">Register as Official</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
              <BarChart3 className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Performance Dashboards</h3>
            <p className="text-sm text-foreground/70">
              Real-time tracking of officials' actions, project progress, and budget utilization
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
              <CheckCircle className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Issue Tracking</h3>
            <p className="text-sm text-foreground/70">
              Report concerns and monitor resolution status with full transparency
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Verified Voting</h3>
            <p className="text-sm text-foreground/70">
              Secure identity verification prevents manipulation and ensures integrity
            </p>
          </div>

          <div className="rounded-lg border border-border bg-card p-6 hover:border-accent/50 transition-colors">
            <div className="mb-4 inline-flex rounded-lg bg-accent/10 p-3">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-card-foreground mb-2">Accountability</h3>
            <p className="text-sm text-foreground/70">
              Point-based evaluation system highlights leaders' competency and performance
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="rounded-xl border border-border bg-primary/5 p-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Be Part of the Change</h2>
          <p className="text-lg text-foreground/70 mb-6">
            Join thousands demanding transparency and accountability in governance
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link href="/register">Start Your Journey Today</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card text-card-foreground py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm">
            <p>CivicConnect - Connecting citizens to transparent governance</p>
            <p className="text-foreground/60 mt-2">&copy; 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
