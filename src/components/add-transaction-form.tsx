"use client"

import { useState } from "react"
import { useBudget } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, ArrowDownCircle, ArrowUpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function AddTransactionForm() {
    const { addTransaction, categories, addCategory } = useBudget()
    const [type, setType] = useState<"expense" | "income">("expense")
    const [amount, setAmount] = useState("")
    const [category, setCategory] = useState(categories[0]?.name || "Food")
    const [note, setNote] = useState("")
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
            date: new Date().toISOString(),
        })

        // Reset
        setAmount("")
        setNote("")
    }

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            // Default color and limit for quick add
            addCategory({
                name: newCategoryName.trim(),
                budgetLimit: 0,
                color: "#a855f7"
            })
            setCategory(newCategoryName.trim())
            setNewCategoryName("")
            setIsAddingCategory(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2 mb-4">
                <Button
                    type="button"
                    variant={type === "expense" ? "default" : "outline"}
                    className={cn("flex-1", type === "expense" && "bg-red-500 hover:bg-red-600")}
                    onClick={() => setType("expense")}
                >
                    <ArrowDownCircle className="mr-2 h-4 w-4" /> Expense
                </Button>
                <Button
                    type="button"
                    variant={type === "income" ? "default" : "outline"}
                    className={cn("flex-1", type === "income" && "bg-green-500 hover:bg-green-600")}
                    onClick={() => setType("income")}
                >
                    <ArrowUpCircle className="mr-2 h-4 w-4" /> Income
                </Button>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="text-lg font-semibold"
                />
            </div>

            {type === "expense" && (
                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="category">Category</Label>
                        <Button type="button" variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setIsAddingCategory(!isAddingCategory)}>
                            {isAddingCategory ? "Cancel" : "+ New Category"}
                        </Button>
                    </div>

                    {isAddingCategory ? (
                        <div className="flex gap-2">
                            <Input
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="New Category Name"
                            />
                            <Button type="button" onClick={handleAddCategory} size="sm">Add</Button>
                        </div>
                    ) : (
                        <div className="relative">
                            <select
                                id="category"
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.name}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            )}

            <div className="grid gap-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input
                    id="note"
                    placeholder={type === "income" ? "e.g. Salary, Gift" : "e.g. Lunch, Taxi"}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </div>

            <Button type="submit" className={cn("w-full", type === "income" ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90")}>
                <Plus className="mr-2 h-4 w-4" /> Add {type === "income" ? "Income" : "Expense"}
            </Button>
        </form>
    )
}
