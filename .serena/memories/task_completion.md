Before marking a task complete:

1. Ensure new/updated copy lives in `public/content/*.json` and is wired through `src/services/content.ts` (no stray literals in components).
2. Run `npm run lint`, `npm run type-check`, and `npm run build` locally; fix any issues.
3. Re-run `npm run format` if files changed outside lint-staged patterns.
4. Update `docs/status.md` or related docs when scope/plan items shift.
5. Let Husky + lint-staged run on commit; verify the hook succeeds.
