"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CalendarDays, PieChart, Settings, Calculator } from "lucide-react"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    activeView: string
    setActiveView: (view: string) => void
}

export function AppSidebar({ className, activeView, setActiveView, onQuickAdd }: SidebarProps & { onQuickAdd?: () => void }) {

    const navItems = [
        { id: "dashboard", label: "Home", icon: LayoutDashboard },
        { id: "calendar", label: "Calendar", icon: CalendarDays },
        { id: "add", label: "Calc", icon: Calculator, isAction: true }, // Calculator button
        { id: "reports", label: "Reports", icon: PieChart },
        { id: "categories", label: "Settings", icon: Settings },
    ]

    return (
        <>
            {/* DESKTOP: Sidebar Container */}
            <div className={cn(
                "hidden md:block w-64 bg-card/50 backdrop-blur-xl border-r z-50 relative flex-shrink-0",
                className
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-8 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/20">D</div>
                        <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-800">Dasha Budget</h1>
                    </div>

                    <div className="flex-1 px-4 py-2 space-y-2">
                        {navItems.filter(item => !item.isAction).map((item) => (
                            <Button
                                key={item.id}
                                variant={activeView === item.id ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-4 h-12 text-base font-medium transition-all duration-200",
                                    activeView === item.id && "bg-primary/10 text-primary hover:bg-primary/15 shadow-sm"
                                )}
                                onClick={() => setActiveView(item.id)}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Button>
                        ))}
                    </div>

                    <div className="p-6 border-t border-border/50">
                        <p className="text-xs text-center text-muted-foreground">
                            v3.0 • Premium
                        </p>
                    </div>
                </div>
            </div>

            {/* MOBILE: Bottom Navigation Bar */}
            <div className="glass-nav fixed bottom-0 left-0 right-0 z-[100] md:hidden pb-safe pointer-events-auto">
                <div className="flex items-center justify-around p-2 h-16">
                    {navItems.map((item) => {
                        const isActive = activeView === item.id;

                        if (item.isAction) {
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onQuickAdd ? onQuickAdd() : setActiveView("dashboard")}
                                    className="relative -top-5 bg-gradient-primary rounded-full p-4 shadow-xl shadow-primary/30 text-white transition-transform active:scale-95"
                                >
                                    <Calculator className="h-6 w-6" />
                                </button>
                            )
                        }

                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveView(item.id)}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors",
                                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn("h-6 w-6 transition-transform", isActive ? "scale-110" : "")} />
                                <span className="text-[10px] font-medium">{item.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </>
    )
}
