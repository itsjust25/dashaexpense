"use client"

import { useBudget } from "@/lib/store"
import { format } from "date-fns"
import { Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function TransactionList() {
    const { transactions, removeTransaction } = useBudget()

    // Sort by date desc
    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    if (transactions.length === 0) {
        return <div className="text-center text-muted-foreground py-8">No transactions yet.</div>
    }

    return (
        <div className="space-y-3">
            {sortedTransactions.map((tx) => (
                <div
                    key={tx.id}
                    className="flex items-center justify-between rounded-lg border p-3 shadow-sm bg-card hover:bg-accent/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-full bg-opacity-10", tx.type === 'income' ? "bg-green-500 text-green-600" : "bg-red-500 text-red-600")}>
                            {tx.type === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-medium">{tx.category}</span>
                            <span className="text-xs text-muted-foreground">
                                {format(new Date(tx.date), "MMM d • h:mm a")}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className={cn("font-bold", tx.type === 'income' ? "text-green-600" : "text-red-600")}>
                                {tx.type === 'income' ? "+" : "-"} {tx.amount.toFixed(2)}
                            </div>
                            {tx.note && (
                                <div className="text-[10px] text-muted-foreground max-w-[100px] truncate text-right">
                                    {tx.note}
                                </div>
                            )}
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-50 hover:opacity-100"
                            onClick={() => removeTransaction(tx.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}
