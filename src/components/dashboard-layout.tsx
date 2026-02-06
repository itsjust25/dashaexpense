"use client"

import { useState } from "react"
import { AppSidebar } from "./app-sidebar"
import { BudgetSummary } from "./budget-summary"
import { AddTransactionForm } from "./add-transaction-form"
import { TransactionList } from "./transaction-list"
import { CalendarView } from "./calendar-view"
import { BudgetProgress } from "./budget-progress"
import { ReportsView } from "./reports-view"
import { CategoryManager } from "./category-manager"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { ScrollArea } from "@/components/ui/scroll-area" // Need to create basic scroll area or use div overflow
import { cn } from "@/lib/utils"

export function DashboardLayout() {
    const [activeView, setActiveView] = useState("dashboard")

    return (
        <div className="flex h-screen overflow-hidden bg-purple-50/50 dark:bg-zinc-950">
            <AppSidebar activeView={activeView} setActiveView={setActiveView} />

            <main className="flex-1 h-full flex flex-col overflow-hidden">
                <header className="flex-none p-4 md:px-8 md:py-4 border-b bg-card z-10">
                    <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
                                {activeView === "dashboard" && "Dashboard"}
                                {activeView === "calendar" && "Calendar"}
                                {activeView === "reports" && "Reports & Analytics"}
                                {activeView === "categories" && "Manage Categories"}
                            </h2>
                        </div>
                        <div className="hidden md:block text-sm text-muted-foreground">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    <div className="max-w-7xl mx-auto h-full">

                        {/* ONE FRAME DASHBOARD */}
                        {activeView === "dashboard" && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                                {/* LEFT COLUMN: Summary & Transactions (Flexible) */}
                                <div className="lg:col-span-8 flex flex-col gap-6 h-full">
                                    {/* Summary Cards */}
                                    <div className="flex-none">
                                        <BudgetSummary />
                                    </div>

                                    {/* Transactions List - Scrollable */}
                                    <Card className="flex-1 border-none shadow-md flex flex-col min-h-0">
                                        <CardHeader className="flex-none pb-2 border-b">
                                            <div className="flex justify-between items-center">
                                                <CardTitle>Recent Transactions</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="flex-1 overflow-y-auto p-0">
                                            <div className="p-6 pt-4">
                                                <TransactionList />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* RIGHT COLUMN: Quick Add & Budget Limits (Fixed Side) */}
                                <div className="lg:col-span-4 flex flex-col gap-6 h-full overflow-y-auto pb-20 lg:pb-0">
                                    <Card className="flex-none border-none shadow-md bg-white/80 backdrop-blur">
                                        <CardHeader>
                                            <CardTitle>Quick Add</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <AddTransactionForm />
                                        </CardContent>
                                    </Card>

                                    <Card className="flex-1 border-none shadow-md min-h-0 bg-transparent shadow-none lg:bg-card lg:shadow-md">
                                        <CardHeader>
                                            <CardTitle>Budget Limits</CardTitle>
                                        </CardHeader>
                                        <CardContent className="overflow-y-auto max-h-[400px] lg:max-h-full">
                                            <BudgetProgress />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}

                        {activeView === "calendar" && (
                            <Card className="border-none shadow-md min-h-[600px] h-full overflow-y-auto">
                                <CardContent className="pt-6">
                                    <CalendarView />
                                </CardContent>
                            </Card>
                        )}

                        {activeView === "reports" && (
                            <ReportsView />
                        )}

                        {activeView === "categories" && (
                            <CategoryManager />
                        )}

                    </div>
                </div>
            </main>
        </div>
    )
}
