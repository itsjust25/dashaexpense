"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Delete, Equal, X, Minus, Plus, Divide } from "lucide-react"
import { cn } from "@/lib/utils"

export function Calculator({ onDone }: { onDone?: (value: string) => void }) {
    const [display, setDisplay] = useState("0")
    const [formula, setFormula] = useState("")

    const handleNumber = (num: string) => {
        if (display === "0") {
            setDisplay(num)
        } else {
            setDisplay(display + num)
        }
    }

    const handleOperator = (op: string) => {
        setFormula(display + " " + op + " ")
        setDisplay("0")
    }

    const calculate = () => {
        try {
            const result = eval(formula + display)
            setDisplay(String(result))
            setFormula("")
        } catch {
            setDisplay("Error")
        }
    }

    const clear = () => {
        setDisplay("0")
        setFormula("")
    }

    const backspace = () => {
        if (display.length > 1) {
            setDisplay(display.slice(0, -1))
        } else {
            setDisplay("0")
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-sm mx-auto p-4 glass-card rounded-3xl">
            <div className="bg-muted/50 p-6 rounded-2xl flex flex-col items-end justify-center min-h-[100px] border shadow-inner">
                <div className="text-xs text-muted-foreground font-black uppercase tracking-widest h-4">
                    {formula}
                </div>
                <div className="text-4xl font-black tracking-tight text-primary">
                    {display}
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
                <Button variant="ghost" onClick={clear} className="h-14 rounded-2xl font-black text-red-500 hover:bg-red-50">C</Button>
                <Button variant="ghost" onClick={backspace} className="h-14 rounded-2xl"><Delete className="h-5 w-5" /></Button>
                <Button variant="ghost" onClick={() => handleOperator("/")} className="h-14 rounded-2xl text-primary font-black">/</Button>
                <Button variant="ghost" onClick={() => handleOperator("*")} className="h-14 rounded-2xl text-primary font-black">×</Button>

                {[7, 8, 9].map(n => (
                    <Button key={n} variant="secondary" onClick={() => handleNumber(String(n))} className="h-14 rounded-2xl font-black text-lg bg-card shadow-sm">{n}</Button>
                ))}
                <Button variant="ghost" onClick={() => handleOperator("-")} className="h-14 rounded-2xl text-primary font-black">-</Button>

                {[4, 5, 6].map(n => (
                    <Button key={n} variant="secondary" onClick={() => handleNumber(String(n))} className="h-14 rounded-2xl font-black text-lg bg-card shadow-sm">{n}</Button>
                ))}
                <Button variant="ghost" onClick={() => handleOperator("+")} className="h-14 rounded-2xl text-primary font-black">+</Button>

                {[1, 2, 3].map(n => (
                    <Button key={n} variant="secondary" onClick={() => handleNumber(String(n))} className="h-14 rounded-2xl font-black text-lg bg-card shadow-sm">{n}</Button>
                ))}
                <div className="row-span-2 grid h-full">
                    <Button variant="default" onClick={calculate} className="h-full rounded-2xl bg-gradient-primary shadow-lg shadow-primary/20">
                        <Equal className="h-6 w-6" />
                    </Button>
                </div>

                <Button variant="secondary" onClick={() => handleNumber("0")} className="col-span-2 h-14 rounded-2xl font-black text-lg bg-card shadow-sm">0</Button>
                <Button variant="secondary" onClick={() => handleNumber(".")} className="h-14 rounded-2xl font-black text-lg bg-card shadow-sm">.</Button>
            </div>

            <Button
                onClick={() => onDone?.(display)}
                className="w-full h-16 rounded-2xl text-lg font-black bg-gradient-primary shadow-xl shadow-primary/30"
            >
                DONE
            </Button>
        </div>
    )
}
