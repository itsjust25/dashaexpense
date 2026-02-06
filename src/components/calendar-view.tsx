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
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function CalendarView() {
    const { transactions } = useBudget()
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const days = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    // Filter only expenses for the calendar visual, or show both?
    // Usually expenses are what we track daily.
    const getDailyStats = (date: Date) => {
        const dailyTx = transactions.filter((t) => isSameDay(new Date(t.date), date))
        const income = dailyTx.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
        const expense = dailyTx.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)
        return { income, expense, transactions: dailyTx }
    }

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold capitalize">
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={prevMonth}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={nextMonth}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="font-medium text-muted-foreground p-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {days.map((day, dayIdx) => {
                    const stats = getDailyStats(day)
                    const isCurrentMonth = isSameMonth(day, currentMonth)
                    const isToday = isSameDay(day, new Date())
                    const isSelected = selectedDate && isSameDay(day, selectedDate)

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[80px] p-1 border rounded-md flex flex-col justify-between transition-colors cursor-pointer hover:bg-accent/50",
                                !isCurrentMonth && "text-muted-foreground bg-muted/20",
                                isToday && "border-primary bg-primary/5",
                                isSelected && "ring-2 ring-primary"
                            )}
                            onClick={() => setSelectedDate(day)}
                        >
                            <div className="flex justify-between items-start">
                                <span className={cn("text-xs font-medium p-1 rounded-full w-6 h-6 flex items-center justify-center", isToday && "bg-primary text-primary-foreground")}>
                                    {format(day, "d")}
                                </span>
                            </div>

                            <div className="flex flex-col gap-0.5 text-[10px] items-end">
                                {stats.income > 0 && <span className="text-green-600 font-bold">+{stats.income}</span>}
                                {stats.expense > 0 && <span className="text-red-500 font-bold">-{stats.expense}</span>}
                            </div>
                        </div>
                    )
                })}
            </div>

            {selectedDate && (
                <div className="mt-4 p-4 border rounded-lg bg-card animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-semibold mb-2">Transactions for {format(selectedDate, "MMM d, yyyy")}</h3>
                    {getDailyStats(selectedDate).transactions.length === 0 ? (
                        <p className="text-muted-foreground text-sm">No transactions for this day.</p>
                    ) : (
                        <div className="space-y-2">
                            {getDailyStats(selectedDate).transactions.map(t => (
                                <div key={t.id} className="flex justify-between text-sm border-b last:border-0 pb-2">
                                    <div>
                                        <span className="font-medium">{t.category}</span>
                                        {t.note && <span className="text-muted-foreground ml-2">({t.note})</span>}
                                    </div>
                                    <span className={cn("font-bold", t.type === 'income' ? "text-green-600" : "text-red-500")}>
                                        {t.type === 'income' ? "+" : "-"}{t.amount.toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
