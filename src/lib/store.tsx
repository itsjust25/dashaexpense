"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"

// Types
export type TransactionType = "income" | "expense"

export type Transaction = {
    id: string
    date: string // ISO date string
    amount: number
    type: TransactionType
    category: string // For expenses, links to Category.name. For income, just a label like 'Salary', 'Bonus'
    note: string
}

export type Category = {
    id: string
    name: string
    budgetLimit: number // 0 means no limit
    color: string // Hex code or tailwind class
    icon?: string // Optional icon identifier
}



type BudgetContextType = {
    transactions: Transaction[]
    categories: Category[]


    // Actions
    addTransaction: (tx: Omit<Transaction, "id">) => void
    removeTransaction: (id: string) => void

    addCategory: (cat: Omit<Category, "id">) => void
    updateCategory: (id: string, updates: Partial<Category>) => void
    removeCategory: (id: string) => void



    // Derived State
    currentBalance: number
    totalIncome: number
    totalExpenses: number
    getCategorySpent: (categoryName: string) => number

    resetData: () => void
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

const DEFAULT_CATEGORIES: Category[] = [
    { id: "1", name: "Food", budgetLimit: 5000, color: "#ef4444", icon: "Utensils" },
    { id: "2", name: "Transportation", budgetLimit: 3000, color: "#f97316", icon: "Car" },
    { id: "3", name: "Allowance", budgetLimit: 2000, color: "#eab308", icon: "GraduationCap" },
    { id: "4", name: "Bills", budgetLimit: 10000, color: "#3b82f6", icon: "Zap" },
    { id: "5", name: "Shopping", budgetLimit: 2000, color: "#a855f7", icon: "ShoppingBag" },
]

const STORAGE_KEY = "dasha-budget-v2"

export function BudgetProvider({ children }: { children: React.ReactNode }) {
    // State
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from LocalStorage
    useEffect(() => {
        // Try load v2 data first
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const data = JSON.parse(saved)
                setTransactions(data.transactions || [])
                setCategories(data.categories || DEFAULT_CATEGORIES)
            } catch (e) {
                console.error("Failed to load budget data", e)
            }
        } else {
            // Migrate v1 data if exists (optional, but good for continuity if we were releasing updates)
            // For this task, we can just start fresh or check v1 key
        }
        setIsLoaded(true)
    }, [])

    // Save to LocalStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ transactions, categories }))
        }
    }, [transactions, categories, isLoaded])

    // Actions
    const addTransaction = (tx: Omit<Transaction, "id">) => {
        setTransactions((prev) => [...prev, { ...tx, id: uuidv4() }])
    }

    const removeTransaction = (id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id))
    }

    const addCategory = (cat: Omit<Category, "id">) => {
        setCategories((prev) => [...prev, { ...cat, id: uuidv4() }])
    }

    const updateCategory = (id: string, updates: Partial<Category>) => {
        setCategories((prev) => prev.map(c => c.id === id ? { ...c, ...updates } : c))
    }

    const removeCategory = (id: string) => {
        setCategories((prev) => prev.filter((c) => c.id !== id))
    }





    const resetData = () => {
        setTransactions([]);
        setCategories(DEFAULT_CATEGORIES);
    }

    // Derived Calculations
    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)

    const currentBalance = totalIncome - totalExpenses

    const getCategorySpent = (categoryName: string) => {
        return transactions
            .filter(t => t.type === "expense" && t.category === categoryName)
            .reduce((sum, t) => sum + t.amount, 0)
    }

    return (
        <BudgetContext.Provider
            value={{
                transactions,
                categories,
                addTransaction,
                removeTransaction,
                addCategory,
                updateCategory,
                removeCategory,
                currentBalance,
                totalIncome,
                totalExpenses,
                getCategorySpent,
                resetData
            }}
        >
            {children}
        </BudgetContext.Provider>
    )
}

export const useBudget = () => {
    const context = useContext(BudgetContext)
    if (!context) throw new Error("useBudget must be used within a BudgetProvider")
    return context
}
