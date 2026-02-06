"use client"

import { useState, useMemo } from "react"
import { useBudget } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WealthChart } from "@/components/wealth-chart"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from "recharts"
import { format, startOfYear, endOfYear, eachMonthOfInterval, isSameMonth } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReportsView() {
    const { transactions } = useBudget()
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

    // --- Monthly Stats (Bar Chart Data) ---
    const monthlyData = useMemo(() => {
        const start = startOfYear(new Date(currentYear, 0, 1))
        const end = endOfYear(new Date(currentYear, 0, 1))
        const months = eachMonthOfInterval({ start, end })

        return months.map(month => {
            const monthTx = transactions.filter(t => isSameMonth(new Date(t.date), month))
            const income = monthTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
            const expense = monthTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)

            return {
                name: format(month, "MMM"),
                income,
                expense,
                net: income - expense
            }
        })
    }, [transactions, currentYear])

    // --- Summary Cards ---
    const yearSummary = useMemo(() => {
        const yearTx = transactions.filter(t => new Date(t.date).getFullYear() === currentYear)
        const income = yearTx.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0)
        const expense = yearTx.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0)
        return { income, expense, net: income - expense }
    }, [transactions, currentYear])

    return (
        <div className="space-y-6 animate-in fade-in pb-20 md:pb-0">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Analytics & Reports</h2>
                <div className="flex items-center gap-4 bg-card p-1 rounded-lg border">
                    <Button variant="ghost" size="icon" onClick={() => setCurrentYear(y => y - 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="font-bold w-16 text-center">{currentYear}</div>
                    <Button variant="ghost" size="icon" onClick={() => setCurrentYear(y => y + 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Year Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Total Income ({currentYear})</div>
                        <div className="text-2xl font-bold text-green-600">+₱{yearSummary.income.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Total Expenses ({currentYear})</div>
                        <div className="text-2xl font-bold text-red-600">-₱{yearSummary.expense.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-sm text-muted-foreground">Net Savings ({currentYear})</div>
                        <div className={cn("text-2xl font-bold", yearSummary.net >= 0 ? "text-primary" : "text-destructive")}>
                            {yearSummary.net >= 0 ? "+" : ""}₱{yearSummary.net.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Monthly Trend */}
                <Card className="col-span-1 lg:col-span-2 shadow-md border-none">
                    <CardHeader>
                        <CardTitle>Monthly Cashflow</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₱${value}`}
                                />
                                <Tooltip
                                    // @ts-ignore
                                    formatter={(value: number) => `₱${value.toLocaleString()}`}
                                    cursor={{ fill: 'transparent' }}
                                />
                                <Legend />
                                <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Expense Breakdown */}
                <Card className="shadow-md border-none">
                    <CardHeader>
                        <CardTitle>Expense By Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <WealthChart />
                    </CardContent>
                </Card>

                {/* Net Trend Line */}
                <Card className="shadow-md border-none">
                    <CardHeader>
                        <CardTitle>Net Savings Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `₱${value}`}
                                />
                                <Tooltip
                                    // @ts-ignore
                                    formatter={(value: number) => `₱${value.toLocaleString()}`}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="net"
                                    stroke="#8b5cf6"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
