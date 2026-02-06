"use client"

import { useBudget } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

export function BudgetSummary() {
    const { currentBalance, totalIncome, totalExpenses } = useBudget()

    return (
        <div className="grid gap-6 md:grid-cols-3">
            <Card className="relative overflow-hidden bg-gradient-to-br from-primary via-purple-700 to-indigo-800 text-white border-none shadow-2xl md:col-span-3 transition-all duration-500">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-20 -mb-20 blur-2xl" />

                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-bold uppercase tracking-wider opacity-80 text-white">
                        Current Balance
                    </CardTitle>
                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                </CardHeader>
                <CardContent className="relative z-10 py-6">
                    <div className="text-5xl font-black tracking-tighter drop-shadow-md">
                        ₱{currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                        <p className="text-xs font-medium opacity-80 uppercase tracking-widest">
                            Available to spend
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Income</CardTitle>
                    <div className="p-1.5 bg-green-500/10 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black text-green-600 tracking-tight">
                        +₱{totalIncome.toLocaleString()}
                    </div>
                </CardContent>
            </Card>

            <Card className="glass-card border-none shadow-lg transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Expenses</CardTitle>
                    <div className="p-1.5 bg-red-500/10 rounded-lg">
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-black text-red-600 tracking-tight">
                        -₱{totalExpenses.toLocaleString()}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
