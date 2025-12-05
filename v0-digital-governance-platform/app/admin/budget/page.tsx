"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Header } from "@/components/header"

const budgetByDepartment = [
  { department: "Infrastructure", budget: 5000000, spent: 3200000 },
  { department: "Education", budget: 3200000, spent: 1900000 },
  { department: "Transportation", budget: 2800000, spent: 2100000 },
  { department: "Utilities", budget: 4500000, spent: 3100000 },
  { department: "Parks & Recreation", budget: 1800000, spent: 1200000 },
]

const budgetTrendData = [
  { month: "Jul", allocated: 2500, spent: 1800 },
  { month: "Aug", allocated: 2500, spent: 2100 },
  { month: "Sep", allocated: 2500, spent: 1900 },
  { month: "Oct", allocated: 2500, spent: 2400 },
  { month: "Nov", allocated: 2500, spent: 2200 },
  { month: "Dec", allocated: 2500, spent: 2300 },
]

const budgetByCategory = [
  { name: "Personnel", value: 4500000, fill: "#3b82f6" },
  { name: "Infrastructure", value: 7200000, fill: "#10b981" },
  { name: "Operations", value: 3800000, fill: "#f59e0b" },
  { name: "Other", value: 1500000, fill: "#8b5cf6" },
]

export default function AdminBudgetPage() {
  const totalBudget = budgetByDepartment.reduce((sum, dept) => sum + dept.budget, 0)
  const totalSpent = budgetByDepartment.reduce((sum, dept) => sum + dept.spent, 0)
  const overallUtilization = Math.round((totalSpent / totalBudget) * 100)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Budget Tracking</h1>
          <p className="text-lg text-muted-foreground">Monitor spending and budget allocation across departments</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
              <p className="text-3xl font-bold">${(totalBudget / 1000000).toFixed(1)}M</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Total Spent</p>
              <p className="text-3xl font-bold">${(totalSpent / 1000000).toFixed(1)}M</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className="text-3xl font-bold">${((totalBudget - totalSpent) / 1000000).toFixed(1)}M</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Utilization</p>
              <p className="text-3xl font-bold text-primary">{overallUtilization}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Budget Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Spending Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  allocated: { label: "Allocated", color: "hsl(var(--primary))" },
                  spent: { label: "Spent", color: "hsl(var(--accent))" },
                }}
                className="h-64"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={budgetTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="allocated" fill="hsl(var(--primary))" />
                    <Bar dataKey="spent" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Budget Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetByCategory}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: $${(value / 1000000).toFixed(1)}M`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {budgetByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Department Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Department Budget Breakdown</CardTitle>
            <CardDescription>Budget allocation and spending by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {budgetByDepartment.map((dept) => {
                const utilization = Math.round((dept.spent / dept.budget) * 100)
                const isOverBudget = utilization > 100

                return (
                  <div key={dept.department} className="border-b last:border-0 pb-6 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{dept.department}</h3>
                        <p className="text-sm text-muted-foreground">
                          ${(dept.spent / 1000000).toFixed(1)}M / ${(dept.budget / 1000000).toFixed(1)}M allocated
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isOverBudget ? (
                          <>
                            <TrendingDown className="w-4 h-4 text-red-600" />
                            <Badge variant="destructive">{utilization}%</Badge>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <Badge variant="outline">{utilization}%</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={isOverBudget ? "bg-red-600 h-2 rounded-full" : "bg-primary h-2 rounded-full"}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
