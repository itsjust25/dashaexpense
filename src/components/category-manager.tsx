"use client"

import { useState } from "react"
import { useBudget } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Save, X, Circle, AlertTriangle, RefreshCcw, Edit2, Utensils, Car, GraduationCap, Zap, ShoppingBag, Home, Heart, Coffee, Smartphone, Gift, Briefcase } from "lucide-react"
import { cn } from "@/lib/utils"

const PRESET_COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
    "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
    "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
    "#ec4899", "#f43f5e", "#64748b", "#94a3b8"
]

const PRESET_ICONS = [
    { id: "Utensils", icon: Utensils },
    { id: "Car", icon: Car },
    { id: "GraduationCap", icon: GraduationCap },
    { id: "Zap", icon: Zap },
    { id: "ShoppingBag", icon: ShoppingBag },
    { id: "Home", icon: Home },
    { id: "Heart", icon: Heart },
    { id: "Coffee", icon: Coffee },
    { id: "Smartphone", icon: Smartphone },
    { id: "Gift", icon: Gift },
    { id: "Briefcase", icon: Briefcase },
]

export function CategoryManager() {
    const { categories, addCategory, updateCategory, removeCategory, transactions, resetData } = useBudget()
    const [isAdding, setIsAdding] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form State
    const [name, setName] = useState("")
    const [limit, setLimit] = useState("")
    const [color, setColor] = useState(PRESET_COLORS[0])
    const [icon, setIcon] = useState("Utensils")

    const resetForm = () => {
        setName("")
        setLimit("")
        setColor(PRESET_COLORS[0])
        setIcon("Utensils")
        setIsAdding(false)
        setEditingId(null)
    }

    const handleStartEdit = (cat: any) => {
        setEditingId(cat.id)
        setName(cat.name)
        setLimit(cat.budgetLimit.toString())
        setColor(cat.color || PRESET_COLORS[0])
        setIcon(cat.icon || "Utensils")
        setIsAdding(true)
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        if (!name) return

        const budgetLimit = parseFloat(limit) || 0

        if (editingId) {
            updateCategory(editingId, { name, budgetLimit, color, icon })
        } else {
            addCategory({ name, budgetLimit, color, icon })
        }
        resetForm()
    }

    const handleDelete = (id: string) => {
        const hasUsage = transactions.some(t => t.category === categories.find(c => c.id === id)?.name)
        if (hasUsage) {
            alert("Cannot delete this category because it has existing transactions. Please delete the transactions first.")
            return
        }
        if (confirm("Are you sure you want to delete this category?")) {
            removeCategory(id)
        }
    }

    const handleReset = () => {
        const confirm1 = confirm("⚠️ DANGER: This will delete ALL transactions and reset categories to default. This action cannot be undone.")
        if (confirm1) {
            const confirm2 = confirm("Are you ABSOLUTELY sure you want to wipe all your data?")
            if (confirm2) {
                resetData()
                alert("System has been reset.")
            }
        }
    }

    return (
        <div className="glass-card rounded-2xl p-6 h-full flex flex-col no-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Category Settings</h2>
                {!isAdding && (
                    <Button onClick={() => setIsAdding(true)} size="sm" className="rounded-xl">
                        <Plus className="mr-1 h-4 w-4" /> Add
                    </Button>
                )}
            </div>

            {isAdding && (
                <Card className="border-2 border-primary/20 mb-6">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{editingId ? "Edit Category" : "New Category"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs">Category Name</Label>
                                    <Input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Groceries"
                                        required
                                        className="h-10 rounded-lg"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs">Monthly Limit</Label>
                                    <Input
                                        type="number"
                                        value={limit}
                                        onChange={e => setLimit(e.target.value)}
                                        placeholder="0 (No limit)"
                                        className="h-10 rounded-lg"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Icon</Label>
                                <div className="flex flex-wrap gap-1.5 p-2 bg-muted/30 rounded-xl">
                                    {PRESET_ICONS.map(item => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            className={cn(
                                                "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                                                icon === item.id ? "bg-primary text-white scale-105 shadow-md" : "hover:bg-primary/10 text-muted-foreground"
                                            )}
                                            onClick={() => setIcon(item.id)}
                                        >
                                            <item.icon className="h-4.5 w-4.5" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <Label className="text-xs">Color</Label>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {PRESET_COLORS.map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            className={cn(
                                                "w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                                                color === c ? "border-primary scale-110 shadow-sm" : "border-transparent"
                                            )}
                                            style={{ backgroundColor: c }}
                                            onClick={() => setColor(c)}
                                        >
                                            {color === c && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t border-border/50">
                                <Button type="button" variant="ghost" onClick={resetForm} className="rounded-xl h-9 text-xs">Cancel</Button>
                                <Button type="submit" className="rounded-xl h-9 text-xs shadow-md">
                                    {editingId ? "Save Changes" : "Create Category"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="flex-1 overflow-y-auto pr-1 no-scrollbar space-y-3 mb-8">
                {categories.map(cat => {
                    const IconComp = PRESET_ICONS.find(i => i.id === cat.icon)?.icon || Utensils
                    return (
                        <div key={cat.id} className="glass border flex items-center justify-between p-3 rounded-2xl group hover:border-primary/30 transition-all">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                                    style={{ backgroundColor: cat.color }}
                                >
                                    <IconComp className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">{cat.name}</div>
                                    <div className="text-[10px] text-muted-foreground">
                                        {cat.budgetLimit > 0 ? `Limit: ₱${cat.budgetLimit.toLocaleString()}` : "No Limit"}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg" onClick={() => handleStartEdit(cat)}>
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-lg" onClick={() => handleDelete(cat.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>

            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-4 mt-auto">
                <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-destructive font-bold text-sm">
                            <AlertTriangle className="h-4 w-4" />
                            Danger Zone
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                            Delete all data and restore defaults.
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-xl font-bold gap-1 shadow-sm h-9 text-xs"
                        onClick={handleReset}
                    >
                        <RefreshCcw className="h-3 w-3" /> Reset
                    </Button>
                </div>
            </div>
        </div>
    )
}
