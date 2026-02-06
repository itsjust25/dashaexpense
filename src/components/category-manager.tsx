"use client"

import { useState } from "react"
import { useBudget } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Save, X, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const PRESET_COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
    "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
    "#ec4899", "#f43f5e", "#64748b", "#94a3b8"
]

export function CategoryManager() {
    const { categories, addCategory, updateCategory, removeCategory, transactions } = useBudget()
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form State
    const [name, setName] = useState("")
    const [limit, setLimit] = useState("")
    const [color, setColor] = useState(PRESET_COLORS[0])

    const resetForm = () => {
        setName("")
        setLimit("")
        setColor(PRESET_COLORS[0])
        setIsAdding(false)
        setEditingId(null)
    }

    const handleStartEdit = (cat: any) => {
        setEditingId(cat.id)
        setName(cat.name)
        setLimit(cat.budgetLimit.toString())
        setColor(cat.color || PRESET_COLORS[0])
        setIsAdding(true)
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return

        const budgetLimit = parseFloat(limit) || 0

        if (editingId) {
            updateCategory(editingId, { name, budgetLimit, color })
        } else {
            addCategory({ name, budgetLimit, color })
        }
        resetForm()
    }

    const handleDelete = (id: string) => {
        // Basic check for usage
        const hasUsage = transactions.some(t => t.category === categories.find(c => c.id === id)?.name)
        if (hasUsage) {
            alert("Cannot delete this category because it has existing transactions. Please delete the transactions first.")
            return
        }
        if (confirm("Are you sure you want to delete this category?")) {
            removeCategory(id)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Manage Categories</h2>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                )}
            </div>

            {isAdding && (
                <Card className="border-2 border-primary/20">
                    <CardHeader>
                        <CardTitle>{editingId ? "Edit Category" : "New Category"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Category Name</Label>
                                    <Input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Groceries"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Monthly Budget Limit</Label>
                                    <Input
                                        type="number"
                                        value={limit}
                                        onChange={e => setLimit(e.target.value)}
                                        placeholder="0 (No limit)"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Color Code</Label>
                                <div className="flex flex-wrap gap-2">
                                    {PRESET_COLORS.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            className={cn(
                                                "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110",
                                                color === c ? "border-primary scale-110" : "border-transparent"
                                            )}
                                            style={{ backgroundColor: c }}
                                            onClick={() => setColor(c)}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                                <Button type="submit">{editingId ? "Save Changes" : "Create Category"}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categories.map(cat => (
                    <Card key={cat.id} className="group hover:shadow-md transition-shadow">
                        <CardContent className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: cat.color }}
                                />
                                <div>
                                    <div className="font-semibold">{cat.name}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {cat.budgetLimit > 0 ? `Limit: ₱${cat.budgetLimit.toLocaleString()}` : "No Limit"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleStartEdit(cat)}>
                                    <Save className="h-4 w-4" /> {/* Reusing Save icon as Edit for now, actually Edit2 is better */}
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(cat.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
