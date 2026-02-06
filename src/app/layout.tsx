import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BudgetProvider } from "@/lib/store";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dasha Budget",
  description: "A simple, beautiful budget tracker",
  manifest: "/manifest.json", // in case we add PWA support later
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased bg-purple-50/50 dark:bg-zinc-950 min-h-screen text-foreground transition-colors duration-300")}>
        <ThemeProvider>
          <BudgetProvider>
            {children}
          </BudgetProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
