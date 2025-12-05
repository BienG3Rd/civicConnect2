"use client"

import Link from "next/link"
import { LayoutDashboard, Users, CheckSquare, BarChart3, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/officials", label: "Officials", icon: Users },
    { href: "/evaluation", label: "Evaluation", icon: CheckSquare },
    { href: "/projects", label: "Projects", icon: BarChart3 },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-primary">
            CivicConnect
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-1">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href}>
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  {label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/profile">
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </Link>
            <Button variant="destructive" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="block">
                <Button variant="ghost" className="w-full justify-start text-foreground">
                  {label}
                </Button>
              </Link>
            ))}
            <div className="pt-2 border-t border-border space-y-2">
              <Link href="/profile" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Profile
                </Button>
              </Link>
              <Button variant="destructive" className="w-full">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
