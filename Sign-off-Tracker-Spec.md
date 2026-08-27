# SIGN-OFF TRACKER

Figma Widget — Design Specification

v1.0 — Draft for build handoff

Prepared by Sagnik Saha

A standalone widget for configurable, role-based sign-off tracking on flows and tasks — independent of the Timeline Estimator widget.


# 1. Overview & Purpose

The Sign-off Tracker is a Figma widget that lives directly on the canvas, letting teams track which roles or stakeholders need to approve a flow, screen, or task — without leaving Figma or maintaining a separate spreadsheet.

It is a standalone widget. It does not share state, storage, or code with the Figma Timeline Estimator widget, and the two are designed to be used independently or side by side on the same canvas.

Design tenets

- Role-first, not person-first. The row's identity is the role or team responsible for sign-off (e.g. "Design Lead", "Legal"), not the individual currently holding it. This lets an approval chain outlive any one person filling a seat.
- Scannable at a glance. No progress bars, no dense metadata — the widget should answer "who's blocking this?" in under two seconds of looking at it.
- Configurable rigor. Teams that just need a checklist get one. Teams that need a richer approval workflow (in review, blocked, N/A) can opt into it without changing tools.

# 2. Core Concepts


## 2.1 Row identity


| Field | Required? | Notes |
| --- | --- | --- |
| Role / Team | Required | The primary identity of the row. e.g. "Design Lead", "Legal", "Eng Manager". This is what's tracked — not who currently fills it. |
| Assignee name | Optional | Who currently holds the role. A row can exist with no name yet (e.g. "Legal — unassigned"). |
| Status | Required | Binary checkbox or multi-state pill, depending on widget mode (see §3). |
| Date | Auto + editable | Auto-stamped when a row reaches a sign-off state; always manually editable afterward. |
| Note | Optional | Short one-line free text, collapsed by default (see §5). |



## 2.2 Widget scope & independence

- Standalone Figma widget — own manifest, own code, own storage.
- No shared state or dependency with the Timeline Estimator widget.
- Multiple Sign-off Tracker instances can exist on one canvas, each independently configured.

# 3. Status Modes

Each widget instance is set to exactly one mode. Mode is a widget-level setting, not a per-row setting — every row in an instance uses the same mode, so the list stays visually consistent and scannable.


## 3.1 Binary mode (default)

Simplest mode. A single checkbox per row.


| State | Trigger | Date behavior |
| --- | --- | --- |
| Unchecked | Default state for a new row | No date shown |
| Checked | User clicks the checkbox | Auto-stamps today's date; editable afterward |


Blocked and N/A do not exist in Binary mode. If a project needs those concepts, it should use Multi-state mode instead.


## 3.2 Multi-state mode

A five-state pill replaces the checkbox. States, in their typical progression:

- Not started — default state for a new row. Grey pill.
- In review — someone is actively looking at it. Yellow pill.
- Signed off — approved. Auto-stamps the date. Green pill.
- Blocked — cannot proceed; flag state, not a step in the sequence. Red pill.
- N/A — role doesn't apply to this particular flow. Grey/muted pill.

| State | Auto-stamps date? | Notes |
| --- | --- | --- |
| Not started | No | Default |
| In review | No |  |
| Signed off | Yes | Date auto-fills on transition into this state |
| Blocked | No | Does not clear an existing date — see §4 |
| N/A | No | Date field remains present but is ignored / not required — see §4 |


The pill is a dropdown — clicking it reveals all five states as options, in the order listed above. There is no forced sequence; any row can jump to any state directly.


# 4. Date Field Behavior

- Auto-stamp: the date fills automatically the moment a row transitions to a sign-off state ("Checked" in Binary, "Signed off" in Multi-state).
- Manual override: the date is always editable by the user after auto-stamping — e.g. to backdate to when approval actually happened in a meeting, rather than when the box was ticked in Figma.
- Persistence on reopen: if a row is unchecked (Binary) or moved out of "Signed off" into an earlier or blocked state (Multi-state), the date is not cleared. It remains visible as a record of the last sign-off, until either a new auto-stamp overwrites it or the user manually edits/clears it.
- N/A rows: the date field remains present in the row but is ignored — not required, not validated, safe to leave blank.
Net effect: the date column behaves like a lightweight audit trail ("last signed off on"), not a live status timestamp.


# 5. Notes Field


| Property | Decision |
| --- | --- |
| Scope | One note per row — attached to the row overall, not to a specific state or transition |
| Length | Short one-liner (single line of free text, not multi-line/long-form) |
| Default visibility | Collapsed / hidden by default |
| Trigger | Small note icon in the row |
| Icon states | Outline / grey = no note yet (still clickable, to add one). Filled / blue = a note exists. |
| Expand behavior | Clicking the icon toggles an inline panel directly beneath that row, pushing subsequent rows down. No popup, no separate modal. |
| Position in row | Sits after the role/assignee block, before the date (Binary) or before the date+pill (Multi-state) — consistent position across both modes. |



# 6. Role List Presets

Three presets ship hardcoded in the widget. They are not user-saved or stored — this was deliberately descoped to avoid building a storage/template-library layer for v1.


| Preset | Roles included |
| --- | --- |
| Design Sign-off | Design · Eng · PM · QA |
| Legal / Compliance Review | Legal · Compliance · Security |
| Launch Checklist | Design · Eng · PM · Marketing · Support |


- Applying a preset always replaces the current row list — whether applied at widget creation or later from Settings. This is a destructive action and should carry an inline warning in the UI (see §8.2).
- Presets carry role names only — no mode, no assignees, no statuses, no dates. Mode is a separate, independent widget setting.

# 7. Empty State

Shown when a new widget instance is created with zero rows.


| Element | Behavior |
| --- | --- |
| Primary action | "Choose a preset" button — opens the preset picker (see §6) |
| Secondary action | "Add role manually" button — seeds **one blank row** immediately, ready to edit (not zero rows requiring a separate + click) |
| Copy | Short explanatory line, e.g. "Start from a preset or build your own list of roles that need to sign off." |



# 8. Layout & Visual Specification

Visual language follows Figma's own UI: Inter typeface, Figma neutral greys, Figma blue (#0D99FF) as the accent, 6–8px corner radii, 1px hairline borders. This keeps the widget feeling native to the canvas rather than like a foreign embed.


## 8.1 Row anatomy

Binary mode row (left → right)

- Drag handle (appears on hover only)
- Checkbox — 16×16px, rounded 4px, unchecked = white fill / grey border, checked = solid blue fill with white check icon
- Role name (bold, 12.5px) stacked above assignee name (regular, 11px, grey; italic + lighter grey placeholder "Unassigned" when empty)
- Note icon — 20×20px, outline/grey by default, filled/blue when a note exists
- Date — right-aligned, tabular figures, grey when unset ("—"), darker grey once set
Multi-state mode row (left → right)

- Drag handle (appears on hover only)
- Role name / assignee name stack — same as Binary
- Note icon — same position and behavior as Binary
- Date — same styling as Binary
- Status pill — rounded 20px pill, right-aligned, color-coded per §3.2, with a small dropdown caret
Fixed vs. flexible columns

Checkbox/pill and date columns stay fixed-width regardless of widget size — they are the scannable anchor points of the row. The role/assignee column is the only flexible column: it truncates with an ellipsis at minimum widget width, and simply gains breathing room at maximum width rather than enlarging type size or row height.


## 8.2 Settings popup

Anchored to the right of the ⚙ icon in the widget header (Figma's standard property-panel convention). Contains three sections, top to bottom:


| Section | Contents |
| --- | --- |
| Status mode | Segmented control: Binary / Multi-state (Figma's native pattern for a binary choice) |
| Apply a preset | Three preset cards (name + role list preview). Inline warning below: "Applying a preset replaces the current list." |
| Reorder roles | Drag-handle + role name + remove (✕) per row, reusing the same drag affordance as the main row list |



## 8.3 Widget header

- Left: small colored dot (status indicator, optional/decorative) + widget title (editable text, e.g. "Design Sign-off")
- Right: ⚙ settings icon, opens the Settings popup described in §8.2

## 8.4 Widget footer

- Left: "+ Add role" text button, blue, adds a new blank row to the list
- Right: small mode tag ("Binary" / "Multi-state") as a passive label — not interactive, just a reminder of current mode

## 8.5 Resize behavior


| Constraint | Behavior |
| --- | --- |
| Minimum width (~260px) | Assignee name is the first thing to truncate/hide; role name truncates next if needed |
| Maximum width (~500px) | Extra horizontal space is absorbed by the role/assignee column only — checkbox/pill and date columns do not stretch, row height does not change |



# 9. Explicitly Out of Scope (v1)

The following were discussed and deliberately descoped during spec discussions — noted here so they aren't accidentally reintroduced without a conscious decision:

- Progress summary header (e.g. "3/5 signed off") — decided not needed
- RACI-style states beyond the five listed in §3.2
- Per-row state history log beyond the single persisted date
- User-saved / stored templates — presets are hardcoded only, no save/library UI, no `window.storage` template persistence
- Cross-file or shared team roster sync — each widget instance is self-contained
- Coupling of any kind with the Timeline Estimator widget

# 10. Open Items for Next Session

Not yet specified — flag these before implementation begins:

- Widget title editing behavior (inline rename vs. settings-only)
- Maximum row count, if any, and behavior when a list grows very long (scroll vs. widget height growth)
- Whether the note character limit (mocked as ~60 chars) is a hard cap or a soft guideline
- Manifest/config details, storage schema, and any Figma widget API constraints — deferred until spec is finalized and build begins