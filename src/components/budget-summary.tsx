"use client"

import { useBudget } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Wallet } from "lucide-react"

export function BudgetSummary() {
    const { currentBalance, totalIncome, totalExpenses } = useBudget()

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-primary to-purple-700 text-white border-none shadow-lg md:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium opacity-90 text-white">
                        Total Balance
                    </CardTitle>
                    <Wallet className="h-4 w-4 text-white opacity-75" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">
                        ₱{currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs opacity-70 mt-1">
                        Available to spend
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        +₱{totalIncome.toLocaleString()}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                    <TrendingDown className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                        -₱{totalExpenses.toLocaleString()}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
