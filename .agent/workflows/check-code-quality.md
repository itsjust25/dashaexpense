---
description: How to ensure code quality and avoid missing imports/types
---

1. Run the Next.js lint tool to check for common errors
```bash
npx next lint
```

2. Run the TypeScript compiler to verify all imports and type definitions
```bash
npx tsc --noEmit
```

> [!TIP]
> Run these commands before every production build to catch errors like missing `Transaction` imports or undeclared variables early.
