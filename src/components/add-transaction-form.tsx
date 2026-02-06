"use client"

import { useState } from "react"
import { useBudget } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Minus, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function AddTransactionForm({ onSuccess }: { onSuccess?: () => void }) {
    const { addTransaction, categories, addCategory } = useBudget()
    const [type, setType] = useState<"expense" | "income">("expense")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState(categories[0]?.name || "Food")
    const [note, setNote] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]) // YYYY-MM-DD format
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!amount) return

        addTransaction({
            type,
            amount: parseFloat(amount),
            category: type === "expense" ? category : "Income Source",
            note: note || (type === "income" ? "Salary/Deposit" : ""),
            date: new Date(date).toISOString(),
        })
        setAmount("")
        setNote("")
        setDate(new Date().toISOString().split('T')[0]) // Reset to today
        if (onSuccess) onSuccess()
    }

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            addCategory({ name: newCategoryName.trim(), budgetLimit: 0, color: "#a855f7" })
            setCategory(newCategoryName.trim())
            setNewCategoryName("")
            setIsAddingCategory(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Custom Toggle Switch */}
            <div className="flex bg-muted p-1 rounded-xl">
                <button
                    type="button"
                    className={cn(
                        "flex-1 py-3 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2",
                        type === "expense" ? "bg-white text-destructive shadow-md" : "text-muted-foreground hover:bg-white/50"
                    )}
                    onClick={() => setType("expense")}
                >
                    <Minus className="h-4 w-4" /> Expense
                </button>
                <button
                    type="button"
                    className={cn(
                        "flex-1 py-3 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2",
                        type === "income" ? "bg-white text-green-600 shadow-md" : "text-muted-foreground hover:bg-white/50"
                    )}
                    onClick={() => setType("income")}
                >
                    <Plus className="h-4 w-4" /> Income
                </button>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-lg">₱</span>
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="pl-10 h-14 text-2xl font-bold rounded-xl bg-muted/50 border-none focus-visible:ring-primary/20 transition-all focus-visible:bg-background"
                    />
                </div>

                {/* Date Input */}
                <div className="space-y-2">
                    <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</Label>
                    <div className="relative">
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            max={new Date().toISOString().split('T')[0]}
                            required
                            className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary/20 focus-visible:bg-background transition-all [color-scheme:dark]"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>
                </div>

                {type === "expense" && (
                    <div className="space-y-2">
                        {isAddingCategory ? (
                            <div className="flex gap-2">
                                <Input
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="New Category Name"
                                    className="h-12 rounded-xl bg-muted/50 border-none"
                                />
                                <Button type="button" onClick={handleAddCategory} size="icon" className="h-12 w-12 rounded-xl">
                                    <Check className="h-5 w-5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    className="flex h-12 w-full items-center justify-between rounded-xl bg-muted/50 px-4 py-2 text-sm font-medium border-none focus:ring-2 focus:ring-primary/20 outline-none appearance-none text-foreground"
                                    style={{
                                        backgroundImage: 'none',
                                        WebkitAppearance: 'none',
                                        MozAppearance: 'none'
                                    }}
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.name} className="bg-background text-foreground">{c.name}</option>
                                    ))}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                    ▼
                                </div>
                            </div>
                        )}
                        {!isAddingCategory && (
                            <button type="button" onClick={() => setIsAddingCategory(true)} className="text-xs text-primary font-medium hover:underline px-1">
                                + Create new category
                            </button>
                        )}
                    </div>
                )}

                <Input
                    placeholder={type === "income" ? "Source (e.g. Salary)" : "Note (e.g. Lunch)"}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="h-12 rounded-xl bg-muted/50 border-none focus-visible:ring-primary/20 focus-visible:bg-background transition-all"
                />
            </div>

            <Button
                type="submit"
                className={cn(
                    "w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95",
                    type === "income"
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:to-emerald-700"
                        : "bg-gradient-to-r from-primary to-purple-700 hover:to-purple-800"
                )}
            >
                <Check className="mr-2 h-5 w-5" /> Save Transaction
            </Button>
        </form>
    )
}
