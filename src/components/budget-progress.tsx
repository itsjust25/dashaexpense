"use client"

import { useState } from "react"
import { useBudget } from "@/lib/store"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Edit2, Check, X, Utensils, Car, GraduationCap, Zap, ShoppingBag, Home, Heart, Coffee, Smartphone, Gift, Briefcase, TrendingUp, AlertCircle } from "lucide-react"

const ICON_MAP: Record<string, any> = {
    Utensils, Car, GraduationCap, Zap, ShoppingBag, Home, Heart, Coffee, Smartphone, Gift, Briefcase
}
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
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {categories.map((cat) => {
                    const spent = getCategorySpent(cat.name)
                    const limit = cat.budgetLimit
                    const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0
                    const isOverBudget = limit > 0 && spent > limit
                    const IconComp = ICON_MAP[cat.icon || "Utensils"] || Utensils

                    return (
                        <div key={cat.id} className="group relative overflow-hidden bg-card/50 border border-border/50 transition-all duration-300 rounded-2xl p-4 shadow-sm">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform"
                                        style={{ backgroundColor: cat.color }}
                                    >
                                        <IconComp className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">{cat.name}</h4>
                                        <p className="text-[10px] text-muted-foreground font-medium">
                                            {percent.toFixed(0)}% used
                                        </p>
                                    </div>
                                </div>

                                {editingId === cat.id ? (
                                    <div className="flex items-center gap-1 bg-background/80 backdrop-blur rounded-lg p-1 border shadow-sm absolute right-2 top-2 z-10 animate-in fade-in zoom-in">
                                        <Input
                                            type="number"
                                            value={editLimit}
                                            onChange={(e) => setEditLimit(e.target.value)}
                                            className="h-7 w-16 text-xs px-1 border-none focus-visible:ring-0 bg-transparent"
                                            placeholder="Limit"
                                            autoFocus
                                        />
                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-green-500 rounded-full hover:bg-green-100" onClick={() => saveLimit(cat.id)}>
                                            <Check className="h-3 w-3" />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 rounded-full hover:bg-red-100" onClick={() => setEditingId(null)}>
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary/50 rounded-lg absolute right-2 top-2"
                                        onClick={() => startEditing(cat.id, cat.budgetLimit)}
                                    >
                                        <Edit2 className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-1.5 mt-3">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className={cn(isOverBudget ? "text-red-500" : "text-foreground")}>
                                        ₱{spent.toLocaleString()}
                                    </span>
                                    <span className="text-muted-foreground">
                                        ₱{limit.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-2.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]",
                                            isOverBudget ? "bg-red-500" : "bg-primary"
                                        )}
                                        style={{
                                            width: `${percent}%`,
                                            backgroundColor: isOverBudget ? undefined : cat.color
                                        }}
                                    />
                                </div>
                            </div>

                            {isOverBudget && (
                                <div className="mt-2 text-[10px] text-red-500 flex items-center gap-1 font-bold animate-pulse">
                                    <AlertCircle className="h-3 w-3" />
                                    Over budget by ₱{(spent - limit).toLocaleString()}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
