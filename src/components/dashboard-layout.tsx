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
import { WealthChart } from "./wealth-chart"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SpendingTrend } from "./spending-trend"
import { cn } from "@/lib/utils"

export function DashboardLayout() {
    const [activeView, setActiveView] = useState("dashboard")
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false)

    return (
        <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground md:pl-0">
            <AppSidebar activeView={activeView} setActiveView={setActiveView} onQuickAdd={() => setIsQuickAddOpen(true)} />

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
                                {/* Financial Overview Section */}
                                <div className="lg:col-span-8 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-6">
                                            <BudgetSummary />
                                            <Card className="glass-card border-none shadow-xl overflow-hidden group">
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                        Last 7 Days Spending
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <SpendingTrend />
                                                </CardContent>
                                            </Card>
                                        </div>
                                        <div className="space-y-6">
                                            <Card className="glass-card border-none shadow-xl">
                                                <CardHeader>
                                                    <CardTitle className="text-sm font-bold">Category Distribution</CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <WealthChart />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>

                                    <Card className="glass-card border-none shadow-xl">
                                        <CardHeader className="flex flex-row items-center justify-between">
                                            <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                                            <Button variant="ghost" size="sm" className="text-xs font-bold text-primary" onClick={() => setActiveView("calendar")}>
                                                View All
                                            </Button>
                                        </CardHeader>
                                        <CardContent>
                                            <TransactionList />
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Sidebar Section */}
                                <div className="lg:col-span-4 space-y-6">
                                    <Card className="glass-card border-none shadow-xl sticky top-8">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-bold">Budgets</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <BudgetProgress />
                                        </CardContent>
                                    </Card>
                                    {/* Quick Add is now a dialog, removed from here */}
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

            <Dialog open={isQuickAddOpen} onOpenChange={setIsQuickAddOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Quick Add Transaction</DialogTitle>
                    </DialogHeader>
                    <AddTransactionForm onSuccess={() => setIsQuickAddOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
