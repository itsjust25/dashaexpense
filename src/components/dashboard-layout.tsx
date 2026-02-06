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
import { cn } from "@/lib/utils"

export function DashboardLayout() {
    const [activeView, setActiveView] = useState("dashboard")

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground md:pl-0">
            <AppSidebar activeView={activeView} setActiveView={setActiveView} />

            <main className="flex-1 flex flex-col h-full relative w-full">
                {/* Mobile Header - Glassmorphic */}
                <header className="glass absolute top-0 left-0 right-0 h-16 z-40 flex items-center justify-center md:hidden px-4">
                    <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-800">
                        {activeView === "dashboard" && "Dashboard"}
                        {activeView === "calendar" && "Calendar"}
                        {activeView === "reports" && "Reports"}
                        {activeView === "categories" && "Settings"}
                    </h1>
                </header>

                {/* Desktop Header */}
                <header className="hidden md:flex flex-none h-20 items-center justify-between px-8 border-b bg-card/30 backdrop-blur-sm z-10">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            {activeView === "dashboard" && "Overview"}
                            {activeView === "calendar" && "Calendar"}
                            {activeView === "reports" && "Analytics"}
                            {activeView === "categories" && "Categories"}
                        </h2>
                        <p className="text-sm text-muted-foreground">Welcome back, Justin</p>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground bg-primary/5 px-4 py-2 rounded-full">
                        {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden pt-20 pb-24 md:pt-6 md:pb-6 px-4 md:px-8 scroll-smooth no-scrollbar">
                    <div className="max-w-7xl mx-auto h-full space-y-6">

                        {activeView === "dashboard" && (
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10">
                                {/* LEFT COLUMN */}
                                <div className="lg:col-span-8 flex flex-col gap-8">
                                    {/* Summary Cards with Hover Effects */}
                                    <div className="transform transition-all hover:scale-[1.01] duration-300">
                                        <BudgetSummary />
                                    </div>

                                    {/* Transactions */}
                                    <div className="flex flex-col gap-4">
                                        <div className="flex justify-between items-center px-1">
                                            <h3 className="text-lg font-bold">Recent Activity</h3>
                                            <button className="text-xs text-primary font-medium hover:underline">View All</button>
                                        </div>
                                        <div className="glass-card rounded-2xl p-1 overflow-hidden">
                                            <TransactionList />
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT COLUMN */}
                                <div className="lg:col-span-4 flex flex-col gap-8">
                                    <div className="glass-card rounded-2xl p-6 space-y-4">
                                        <h3 className="font-bold text-lg">Quick Add</h3>
                                        <AddTransactionForm />
                                    </div>

                                    <div className="glass-card rounded-2xl p-6 space-y-4">
                                        <h3 className="font-bold text-lg">Budgets</h3>
                                        <BudgetProgress />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeView === "calendar" && (
                            <div className="glass-card rounded-2xl p-6 min-h-[600px]">
                                <CalendarView />
                            </div>
                        )}

                        {activeView === "reports" && (
                            <div className="glass-card rounded-2xl p-1">
                                <ReportsView />
                            </div>
                        )}

                        {activeView === "categories" && (
                            <div className="glass-card rounded-2xl p-6">
                                <CategoryManager />
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}
