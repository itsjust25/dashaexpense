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
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, CalendarDays, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CalendarView() {
    const { transactions, getCalendarNote, addCalendarNote } = useBudget()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date())
    const [noteInput, setNoteInput] = useState("")

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

    // Sync note input when selected date changes
    React.useEffect(() => {
        if (selectedDate) {
            const existingNote = getCalendarNote(format(selectedDate, "yyyy-MM-dd"))
            setNoteInput(existingNote?.note || "")
        }
    }, [selectedDate, getCalendarNote])

    const handleSaveNote = () => {
        if (selectedDate) {
            addCalendarNote({
                date: format(selectedDate, "yyyy-MM-dd"),
                note: noteInput
            })
        }
    }

    return (
        <div className="flex flex-col gap-6 h-full overflow-y-auto">
            {/* Calendar Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-6 rounded-2xl border-none shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                        <CalendarDays className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight capitalize">
                            {format(currentMonth, "MMMM yyyy")}
                        </h2>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                            Budget Outlook
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 bg-muted/50 p-2 rounded-2xl">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-xl hover:bg-background shadow-none">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" className="px-4 font-bold text-sm hover:bg-background" onClick={() => setCurrentMonth(new Date())}>
                        Today
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-xl hover:bg-background shadow-none">
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
                {/* Main Calendar Grid */}
                <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
                    <div className="grid grid-cols-7 gap-2 md:gap-4 text-center">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div key={day} className="font-black text-muted-foreground text-[10px] uppercase tracking-[0.2em]">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 md:gap-3 flex-1">
                        {days.map((day, dayIdx) => {
                            const stats = getDailyStats(day)
                            const isCurrentMonth = isSameMonth(day, currentMonth)
                            const isToday = isSameDay(day, new Date())
                            const isSelected = selectedDate && isSameDay(day, selectedDate)
                            const intensity = getIntensityClass(stats.expense)
                            const hasNote = getCalendarNote(format(day, "yyyy-MM-dd"))?.note

                            return (
                                <div
                                    key={day.toString()}
                                    className={cn(
                                        "min-h-[100px] md:min-h-[110px] p-2 md:p-3 border rounded-xl md:rounded-2xl flex flex-col gap-1 transition-all cursor-pointer relative group",
                                        !isCurrentMonth && "opacity-10 grayscale",
                                        isSelected
                                            ? "bg-primary/5 border-primary shadow-inner scale-[1.02] z-10"
                                            : cn("border-border/40 hover:border-primary/30", intensity || "bg-muted/10"),
                                        isToday && "ring-2 ring-primary/20"
                                    )}
                                    onClick={() => setSelectedDate(day)}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={cn(
                                            "text-base md:text-lg font-black w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg transition-all",
                                            isToday ? "bg-primary text-white shadow-lg shadow-primary/30" : (isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground")
                                        )}>
                                            {format(day, "d")}
                                        </span>
                                        {stats.expense > 0 && (
                                            <span className="text-[10px] font-bold text-red-500/80">
                                                ₱{stats.expense > 999 ? (stats.expense / 1000).toFixed(1) + 'k' : stats.expense}
                                            </span>
                                        )}
                                    </div>

                                    {/* Note Display - Full Width */}
                                    {hasNote && (
                                        <div className="mb-1">
                                            <p className="text-[9px] md:text-[10px] font-bold text-purple-600 truncate w-full" title={hasNote}>
                                                {hasNote}
                                            </p>
                                        </div>
                                    )}

                                    {/* Transaction Labels - Limited to 1 on mobile, 2 on desktop */}
                                    <div className="flex flex-col gap-1 overflow-hidden flex-1">
                                        {stats.transactions.slice(0, 1).map(t => (
                                            <div
                                                key={t.id}
                                                className={cn(
                                                    "text-[8px] md:text-[9px] px-1.5 md:px-2 py-0.5 md:py-1 rounded-md truncate font-bold uppercase tracking-tight",
                                                    t.type === 'income' ? "bg-green-500/10 text-green-600" : "bg-primary/10 text-primary"
                                                )}
                                            >
                                                {t.note || t.category}
                                            </div>
                                        ))}
                                        {stats.transactions.length > 1 && (
                                            <div className="text-[7px] md:text-[8px] font-black text-muted-foreground text-center">
                                                +{stats.transactions.length - 1}
                                            </div>
                                        )}
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Daily Insights Sidebar */}
                <div className="lg:col-span-1 h-full">
                    {selectedDate ? (
                        <div className="glass-card rounded-3xl p-6 pb-24 h-full flex flex-col border-none shadow-2xl overflow-y-auto">
                            <div className="mb-6 relative">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-1 block">Daily Insights</span>
                                <h2 className="text-3xl font-black tracking-tight">{format(selectedDate, "EEE, MMM d")}</h2>
                            </div>

                            {/* Income/Expense Summary */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-green-500/5 p-4 rounded-2xl border border-green-500/10">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black uppercase text-green-600/70 tracking-widest">Income</span>
                                        <TrendingUp className="h-4 w-4 text-green-500" />
                                    </div>
                                    <div className="text-xl font-black text-green-700">
                                        +{getDailyStats(selectedDate).income}
                                    </div>
                                </div>
                                <div className="bg-red-500/5 p-4 rounded-2xl border border-red-500/10">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[10px] font-black uppercase text-red-600/70 tracking-widest">Expense</span>
                                        <TrendingDown className="h-4 w-4 text-red-500" />
                                    </div>
                                    <div className="text-xl font-black text-red-700">
                                        -{getDailyStats(selectedDate).expense.toFixed(1)}
                                    </div>
                                </div>
                            </div>

                            {/* Activity List */}
                            {getDailyStats(selectedDate).transactions.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-3">Activity</h4>
                                    <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar">
                                        {getDailyStats(selectedDate).transactions.map(t => (
                                            <div key={t.id} className="flex flex-col gap-1 p-3 rounded-xl bg-muted/40">
                                                <div className="flex justify-between items-start">
                                                    <span className="text-xs font-black uppercase text-muted-foreground/80">{t.category}</span>
                                                    <span className={cn("text-sm font-black", t.type === 'income' ? "text-green-600" : "text-red-600")}>
                                                        {t.type === 'income' ? "+" : "-"}₱{t.amount.toLocaleString()}
                                                    </span>
                                                </div>
                                                {t.note && <p className="text-xs font-medium leading-tight">{t.note}</p>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Calendar Note */}
                            <div className="mt-auto">
                                <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Notes</h4>
                                <div className="space-y-2">
                                    <textarea
                                        className="w-full p-3 rounded-xl bg-muted/40 border border-border/40 focus:border-primary/50 focus:outline-none resize-none text-sm"
                                        rows={3}
                                        placeholder="Add a note for this day..."
                                        value={noteInput}
                                        onChange={(e) => setNoteInput(e.target.value)}
                                    />
                                    <Button
                                        onClick={handleSaveNote}
                                        className="w-full bg-gradient-primary text-white font-bold"
                                        size="sm"
                                    >
                                        Save Note
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="glass-card rounded-3xl p-6 h-full flex flex-col items-center justify-center text-muted-foreground border-none shadow-xl opacity-50">
                            <CalendarDays className="h-10 w-10 mb-4 opacity-20" />
                            <p className="font-bold">Select a date</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
