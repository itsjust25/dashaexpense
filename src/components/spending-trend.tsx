"use client"

import { useMemo } from "react"
import { useBudget } from "@/lib/store"
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from "recharts"
import { subDays, format, isSameDay } from "date-fns"

export function SpendingTrend() {
    const { transactions } = useBudget()

    const data = useMemo(() => {
        const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i))

        return last7Days.map(day => {
            const dailyEx = transactions
                .filter(t => t.type === "expense" && isSameDay(new Date(t.date), day))
                .reduce((sum, t) => sum + t.amount, 0)

            return {
                day: format(day, "EEE"),
                amount: dailyEx
            }
        })
    }, [transactions])

    return (
        <div className="h-[120px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <XAxis
                        dataKey="day"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: 'currentColor', opacity: 0.5 }}
                    />
                    <Tooltip
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div className="bg-background/90 backdrop-blur-sm border shadow-xl rounded-lg p-2 text-[10px] font-bold">
                                        ₱{payload[0].value?.toLocaleString()}
                                    </div>
                                )
                            }
                            return null
                        }}
                        cursor={{ fill: 'rgba(139, 92, 246, 0.1)' }}
                    />
                    <Bar
                        dataKey="amount"
                        fill="currentColor"
                        className="text-primary/40 hover:text-primary transition-colors cursor-pointer"
                        radius={[4, 4, 0, 0]}
                        barSize={24}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
