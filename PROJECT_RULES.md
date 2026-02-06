# Project Rules - Dasha Budget

To maintain the premium look and feel of the application and prevent recurring UI issues, follow these rules:

## 1. CSS & Styling Stability
- **CRITICAL**: Never remove `import "./globals.css"` from `src/app/layout.tsx`. This is the core of the Tailwind styling.
- **Tailwind JIT**: If the UI looks unstyled after a large code change, restart the dev server immediately.
- **Glassmorphism**: Always use the `.glass` or `.glass-card` utility classes for containers to maintain the "Premium" aesthetic.

## 2. Feature Implementation Workflow
- **State Management**: Always use the `ThemeProvider` for theme-related logic and `BudgetProvider` for data.
- **Branding**: The application name is **Dasha Budget**. Ensure all new headers and labels reflect this.
- **Mobile-First**: Always test new components on small screen widths.
- **Clickability**: Ensure the sidebar and navigation have `relative` or `fixed` positioning and high `z-index` (at least 50) to prevent `main` content from overlapping and blocking clicks. Never use `w-full` on a flex sibling of the sidebar.

## 3. Deployment Safety
- Before finalizing any major phase, run `/safe-build-verification` to ensure the production build doesn't break the CSS environment.
- Use `/check-code-quality` to catch missing imports (like the one that caused the unstyled UI).
