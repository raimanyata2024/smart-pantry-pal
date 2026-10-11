# AnnRakshak design handoff

This scaffold follows the supplied visual brief, not an imported Figma file. Sample inventory and journal entries are session-only and reset on refresh. Rupee amounts are illustrative sample values.

## Connect the existing Figma design
1. Install Lovable Desktop from https://lovable.dev/download.
2. Open your design in Figma Desktop and switch to Dev Mode (Shift+D).
3. Enable the desktop MCP server in Figma's inspect panel.
4. Connect it in Lovable under Settings → Connectors → Local MCP servers.
5. Share the frame you want implemented. Screenshots or exported design assets also work.

The connector reads Figma; it cannot write changes back. No Figma account or connection is required to run this scaffold.

## Replace presentation without replacing inventory logic
- `src/styles.css`: semantic colors, type, spacing, and layout styles.
- `src/components/annrakshak/`: ingredient cards and forms.
- `src/routes/index.tsx`: dashboard workspace composition and navigation.
- `src/lib/inventory.ts`: typed sample inventory and confirmed-expiry helpers.
- `src/assets/`: ingredient photography; replace with the design's assets when provided.

The existing Figma design is the source of truth when available. Adapt these tokens and components to its measurements, imagery, and typography rather than redesigning it.