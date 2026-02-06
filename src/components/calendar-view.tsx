"use client"

import React, { useState } from "react"
import { useBudget } from "@/lib/store"
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    startOfWeek,
    endOfWeek
} from "date-fns"
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CalendarView() {
    const { transactions } = useBudget()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    const getDailyStats = (date: Date) => {
        const dailyTx = transactions.filter((t) => isSameDay(new Date(t.date), date))
        const income = dailyTx.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
        const expense = dailyTx.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
        return { income, expense, transactions: dailyTx }
    }

    // Determine expense intensity for heatmap
    const getMaxDailyExpense = () => {
        return Math.max(...days.map(d => getDailyStats(d).expense), 1) // Avoid div by 0
    }
    const maxExpense = getMaxDailyExpense()

    const getIntensityClass = (expense: number) => {
        if (expense === 0) return ""
        const ratio = expense / maxExpense
        if (ratio > 0.75) return "bg-red-500/20 border-red-500/50"
        if (ratio > 0.5) return "bg-orange-500/20 border-orange-500/50"
        if (ratio > 0.25) return "bg-yellow-500/20 border-yellow-500/50"
        return "bg-green-500/20 border-green-500/50"
    }

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            {/* Calendar Grid */}
            <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between glass-card p-4 rounded-2xl">
                    <h2 className="text-xl font-bold capitalize flex items-center gap-2">
                        {format(currentMonth, "MMMM yyyy")}
                    </h2>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-xl hover:bg-primary/10">
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-xl hover:bg-primary/10">
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="glass-card p-4 rounded-2xl">
                    <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                            <div key={day} className="font-bold text-muted-foreground p-2 text-xs uppercase tracking-wider">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day, dayIdx) => {
                            const stats = getDailyStats(day)
                            const isCurrentMonth = isSameMonth(day, currentMonth)
                            const isToday = isSameDay(day, new Date())
                            const isSelected = selectedDate && isSameDay(day, selectedDate)
                            const intensity = getIntensityClass(stats.expense)

                            return (
                                <div
                                    key={day.toString()}
                                    className={cn(
                                        "aspect-square p-1 border rounded-xl flex flex-col justify-between transition-all cursor-pointer active:scale-95 group relative overflow-hidden",
                                        !isCurrentMonth && "opacity-20 grayscale",
                                        isSelected
                                            ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-110 z-20"
                                            : cn("border-transparent hover:bg-primary/5 hover:border-primary/20", intensity || "bg-muted/30"),
                                        isToday && !isSelected && "ring-2 ring-primary/50 text-primary"
                                    )}
                                    onClick={() => setSelectedDate(day)}
                                >
                                    <div className="flex justify-between items-start z-10">
                                        <span className={cn(
                                            "text-[10px] font-bold p-1 rounded-full w-6 h-6 flex items-center justify-center transition-colors",
                                            isToday ? (isSelected ? "bg-white text-primary" : "bg-primary text-white") : (isSelected ? "text-white" : "text-foreground group-hover:text-primary")
                                        )}>
                                            {format(day, "d")}
                                        </span>
                                    </div>

                                    {/* Mini indicators */}
                                    <div className="flex gap-1 justify-end items-end z-10 p-1">
                                        {stats.income > 0 && <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isSelected ? "bg-white" : "bg-green-500")} />}
                                        {stats.expense > 0 && <div className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white/80" : "bg-red-500")} />}
                                    </div>

                                    {/* Stats overlay (Desktop only behavior or subtle) */}
                                    <div className={cn(
                                        "absolute inset-0 flex flex-col items-center justify-center opacity-0 md:group-hover:opacity-100 transition-opacity text-[9px] font-black backdrop-blur-[2px] pointer-events-none",
                                        isSelected ? "bg-white/10 text-white" : "bg-primary/90 text-white"
                                    )}>
                                        {stats.expense > 0 && <span>-{stats.expense}</span>}
                                        {stats.income > 0 && <span className="opacity-80">+{stats.income}</span>}
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-muted-foreground justify-center py-2 px-4 glass rounded-full w-fit mx-auto">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-green-500/20 border border-green-500/50" /> <span className="font-medium">Light</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-orange-500/20 border border-orange-500/50" /> <span className="font-medium">Mid</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-md bg-red-500/20 border border-red-500/50" /> <span className="font-medium">Heavy</span></div>
                    </div>
                </div>
            </div>

            {/* Side Panel: Selected Day Insights */}
            <div className="md:col-span-1 h-full flex flex-col gap-4">
                {selectedDate ? (
                    <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col animate-in slide-in-from-right-4 duration-300">
                        <div className="mb-6 border-b border-border/50 pb-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Daily Insights</h3>
                            <h2 className="text-2xl font-bold mt-1">{format(selectedDate, "EEE, MMM d")}</h2>
                        </div>

                        {getDailyStats(selectedDate).transactions.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground text-center space-y-3 opacity-60">
                                <DollarSign className="h-12 w-12 text-muted-foreground/30" />
                                <p>No transactions recorded <br />for this day.</p>
                                {/* Future idea: Quick add button here pre-filled with date */}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Daily Summary Cards */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/20">
                                        <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3" /> Income
                                        </div>
                                        <div className="text-lg font-bold text-green-700">
                                            +{getDailyStats(selectedDate).income.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                                        <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                                            <TrendingDown className="h-3 w-3" /> Expense
                                        </div>
                                        <div className="text-lg font-bold text-red-700">
                                            -{getDailyStats(selectedDate).expense.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar max-h-[400px]">
                                    <h4 className="text-xs font-bold text-muted-foreground uppercase">Activity</h4>
                                    {getDailyStats(selectedDate).transactions.map(t => (
                                        <div key={t.id} className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border hover:border-primary/30 transition-colors group">
                                            <div>
                                                <div className="font-bold text-sm">{t.category}</div>
                                                {t.note && <div className="text-[10px] text-muted-foreground truncate max-w-[120px]">{t.note}</div>}
                                            </div>
                                            <div className={cn("font-bold text-sm", t.type === 'income' ? "text-green-600" : "text-red-500")}>
                                                {t.type === 'income' ? "+" : "-"}{t.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="glass-card rounded-2xl p-6 h-full flex items-center justify-center text-muted-foreground">
                        <p>Select a date to view insights</p>
                    </div>
                )}
            </div>
        </div>
    )
}
