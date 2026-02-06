"use client"

import { useBudget } from "@/lib/store"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export function WealthChart() {
    const { categories, getCategorySpent } = useBudget()

    const data = categories
        .map((cat) => ({
            name: cat.name,
            value: getCategorySpent(cat.name),
            color: cat.color || "#8884d8",
        }))
        .filter((d) => d.value > 0)

    if (data.length === 0) {
        return (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground text-sm">
                Add expenses to see the breakdown.
            </div>
        )
    }

    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => `₱${value.toLocaleString()}`}
                        contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    )
}
