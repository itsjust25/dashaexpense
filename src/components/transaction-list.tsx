"use client"

import { useBudget, Transaction } from "@/lib/store"
import { format } from "date-fns"
import { ArrowUpCircle, ArrowDownCircle, Utensils, Car, GraduationCap, Zap, ShoppingBag, Home, Heart, Coffee, Smartphone, Gift, Briefcase, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ICON_MAP: Record<string, any> = {
    Utensils, Car, GraduationCap, Zap, ShoppingBag, Home, Heart, Coffee, Smartphone, Gift, Briefcase
}

export function TransactionList() {
    const { transactions, removeTransaction, categories } = useBudget()

    // Sort by date desc
    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Group by date
    const groups = sortedTransactions.reduce((acc, tx) => {
        const date = new Date(tx.date)
        let groupTitle = format(date, "MMMM d, yyyy")

        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        if (format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd")) groupTitle = "Today"
        else if (format(date, "yyyy-MM-dd") === format(yesterday, "yyyy-MM-dd")) groupTitle = "Yesterday"

        if (!acc[groupTitle]) acc[groupTitle] = []
        acc[groupTitle].push(tx)
        return acc
    }, {} as Record<string, Transaction[]>)

    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground opacity-50">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Briefcase className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium">No transactions yet.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {Object.entries(groups).map(([groupTitle, txs]) => (
                <div key={groupTitle} className="space-y-3">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-2 flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary/40" />
                        {groupTitle}
                    </h4>
                    <div className="space-y-2">
                        {txs.map((tx) => {
                            const isIncome = tx.type === "income"
                            const category = categories.find(c => c.name === tx.category)
                            const IconComp = !isIncome ? (ICON_MAP[category?.icon || "Utensils"] || Utensils) : ArrowUpCircle

                            return (
                                <div key={tx.id} className="group flex items-center justify-between p-3 bg-muted/20 hover:bg-muted/40 rounded-2xl transition-all duration-300 border border-transparent hover:border-border/40">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110",
                                            isIncome ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                        )}
                                            style={!isIncome && category ? { backgroundColor: `${category.color}15`, color: category.color } : {}}
                                        >
                                            <IconComp className="h-5 w-5" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm tracking-tight">{tx.category}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium">
                                                {format(new Date(tx.date), "h:mm a")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <div className={cn("font-bold text-sm tracking-tighter", isIncome ? "text-green-600" : "text-red-500")}>
                                                {isIncome ? "+" : "-"}₱{tx.amount.toLocaleString()}
                                            </div>
                                            {tx.note && (
                                                <div className="text-[10px] text-muted-foreground max-w-[100px] truncate text-right italic opacity-70">
                                                    {tx.note}
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 rounded-lg transition-all"
                                            onClick={() => removeTransaction(tx.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}
