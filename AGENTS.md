<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## AnnRakshak architecture
- Keep theme tokens in `src/styles.css` and reusable dashboard pieces in `src/components/annrakshak` so the existing Figma design can replace presentation without replacing domain data.
- Keep sample inventory and expiry helpers in `src/lib/inventory.ts`; inventory persists in browser localStorage (per device, no account) until a backend is added.
- Use the existing TanStack home route for the dashboard and in-app view controls for the inventory and journal workspace.
