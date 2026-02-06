"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, CalendarDays, PieChart, Settings, Menu } from "lucide-react"
import { useState } from "react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    activeView: string
    setActiveView: (view: string) => void
}

export function AppSidebar({ className, activeView, setActiveView }: SidebarProps) {
    const [isMobileOpen, setIsMobileOpen] = useState(false)

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "calendar", label: "Calendar", icon: CalendarDays },
        { id: "reports", label: "Reports", icon: PieChart },
        { id: "categories", label: "Categories", icon: Settings },
    ]

    return (
        <>
            {/* Mobile Header Trigger */}
            <div className="md:hidden p-4 flex items-center justify-between bg-card border-b sticky top-0 z-50">
                <div className="font-bold text-primary flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold">D</div>
                    Dasha Budget
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:block",
                isMobileOpen ? "translate-x-0" : "-translate-x-full",
                className
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-6 hidden md:flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20">D</div>
                        <h1 className="text-xl font-bold tracking-tight">Dasha Budget</h1>
                    </div>

                    <div className="flex-1 px-4 py-2 space-y-1">
                        {navItems.map((item) => (
                            <Button
                                key={item.id}
                                variant={activeView === item.id ? "secondary" : "ghost"}
                                className={cn("w-full justify-start gap-3", activeView === item.id && "bg-primary/10 text-primary hover:bg-primary/20")}
                                onClick={() => {
                                    setActiveView(item.id)
                                    setIsMobileOpen(false)
                                }}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Button>
                        ))}
                    </div>

                    <div className="p-4 border-t">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                            <Settings className="h-4 w-4" />
                            Settings
                        </Button>
                        <p className="text-[10px] text-center text-muted-foreground mt-4">
                            v2.0 • Local Storage
                        </p>
                    </div>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    )
}
