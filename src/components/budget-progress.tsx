"use client"

import { useState } from "react"
import { useBudget } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Edit2, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function BudgetProgress() {
    const { categories, getCategorySpent, updateCategory } = useBudget()
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editLimit, setEditLimit] = useState("")

    const startEditing = (id: string, currentLimit: number) => {
        setEditingId(id)
        setEditLimit(currentLimit.toString())
    }

    const saveLimit = (id: string) => {
        const limit = parseFloat(editLimit)
        if (!isNaN(limit)) {
            updateCategory(id, { budgetLimit: limit })
        }
        setEditingId(null)
    }

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold">Category Budgets</h3>
            <div className="grid gap-6">
                {categories.map((cat) => {
                    const spent = getCategorySpent(cat.name)
                    const limit = cat.budgetLimit
                    const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
                    const isOverBudget = limit > 0 && spent > limit

                    return (
                        <div key={cat.id} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{cat.name}</span>
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: cat.color || "#ccc" }}
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    {editingId === cat.id ? (
                                        <div className="flex items-center gap-1">
                                            <Input
                                                type="number"
                                                value={editLimit}
                                                onChange={(e) => setEditLimit(e.target.value)}
                                                className="h-6 w-20 text-xs px-1"
                                                autoFocus
                                            />
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-green-500" onClick={() => saveLimit(cat.id)}>
                                                <Check className="h-3 w-3" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500" onClick={() => setEditingId(null)}>
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <span>
                                                ₱{spent.toLocaleString()} <span className="text-[10px]">/ ₱{limit.toLocaleString()}</span>
                                            </span>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="h-4 w-4 opacity-50 hover:opacity-100"
                                                onClick={() => startEditing(cat.id, cat.budgetLimit)}
                                            >
                                                <Edit2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                    className={cn("h-full flex-1 transition-all duration-500 ease-in-out", isOverBudget ? "bg-red-500" : "bg-primary")}
                                    style={{ width: `${percent}%`, backgroundColor: isOverBudget ? undefined : cat.color }}
                                />
                            </div>
                            {isOverBudget && (
                                <p className="text-[10px] text-red-500 font-medium text-right">
                                    Over budget by ₱{(spent - limit).toLocaleString()}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
