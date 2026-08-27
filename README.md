# Sign-off Tracker (Figma & FigJam Widget)

A standalone Figma widget for configurable, role-based sign-off tracking on flows, screens, and tasks directly on the canvas.

Built strictly according to the design specification:
- **Role-first identity**: Tracks roles/teams (e.g. Design Lead, Legal) rather than individuals.
- **Two Rigor Modes**:
  - **Binary Mode**: Clean single-checkbox sign-off with auto-date stamping.
  - **Multi-state Mode**: 5-state colored pill dropdown (*Not started*, *In review*, *Signed off*, *Blocked*, *N/A*).
- **Lightweight Audit Trail**: Auto-stamps approval date on sign-off, remains manually editable, and persists when reopened/moved out of signed-off state.
- **Collapsible Notes**: Inline expandable one-line notes per row without separate modals.
- **Presets & Customization**: Hardcoded presets (*Design Sign-off*, *Legal / Compliance Review*, *Launch Checklist*) and custom role reordering/deletion.

---

## Getting Started

### 1. Build the Widget
```bash
# Install dependencies
npm install

# Build distribution bundle
npm run build

# Or run in watch mode during development
npm run watch
```

### 2. Load into Figma / FigJam
1. Open the **Figma Desktop App**.
2. Open any Figma design file or FigJam board.
3. Right-click on the canvas and go to **Plugins** > **Development** > **Import widget from manifest...**.
4. Select the `manifest.json` file in this directory.
5. Place the **Sign-off Tracker** widget onto the canvas.

---

## File Structure

```
├── manifest.json            # Figma Widget manifest
├── package.json             # NPM dependencies & scripts
├── tsconfig.json            # TypeScript & JSX config for Figma
├── build.js                 # esbuild bundling script
├── dist/
│   └── code.js              # Bundled widget distribution
└── src/
    ├── code.tsx             # Main widget component & state management
    ├── types.ts             # TypeScript interfaces
    ├── constants/
    │   ├── presets.ts       # Hardcoded role list presets
    │   └── theme.ts         # Color palette, spacing, and status styles
    ├── utils/
    │   └── date.ts          # Auto-stamp formatting helpers
    └── components/
        ├── EmptyState.tsx    # Onboarding empty state
        ├── Footer.tsx        # Add role button & mode badge
        ├── Header.tsx        # Title & dynamic status dot
        ├── Icons.tsx         # Figma Declarative SVG icons
        ├── InlineNote.tsx    # Collapsible row note input
        ├── RowItem.tsx       # Row component (Binary & Multi-state)
        ├── SettingsPanel.tsx # Mode switcher, presets, reordering
        └── StatusDropdown.tsx# 5-state popover selector
```
