---
description: How to safely verify a production build without breaking the development environment
---

// turbo-all
1. Stop all existing Node.js processes to clear file locks
```bash
taskkill /F /IM node.exe
```

2. Run the production build to verify types and linting
```bash
npm run build
```

3. Relaunch the development server to restore the styled environment
```bash
npm run dev
```

> [!IMPORTANT]
> Always run `npm run dev` after a build. The build process clears the `.next` cache, which causes the unstyled "white screen" effect if the old dev server is still running.
