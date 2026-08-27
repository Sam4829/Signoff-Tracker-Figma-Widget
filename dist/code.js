"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };

  // src/figma.ts
  var { widget } = figma;
  var {
    AutoLayout,
    Text,
    Input,
    SVG,
    Line,
    Rectangle,
    Frame,
    Span,
    Fragment,
    useSyncedState,
    useSyncedMap,
    usePropertyMenu,
    useEffect,
    useWidgetId,
    useWidgetNodeId,
    waitForTask
  } = widget;
  var figma_default = widget;

  // src/constants/theme.ts
  var COLORS = {
    // Brand / Accent
    figmaBlue: "#0D99FF",
    figmaBlueHover: "#007BE5",
    figmaBlueLight: "#E8F4FE",
    // Neutrals
    white: "#FFFFFF",
    cardBg: "#FFFFFF",
    canvasBorder: "#E6E6E6",
    hairline: "#F0F0F0",
    subtleBg: "#F7F7F7",
    hoverBg: "#F2F2F2",
    // Text
    textPrimary: "#1E1E1E",
    textSecondary: "#666666",
    textTertiary: "#8C8C8C",
    textMuted: "#B3B3B3",
    // Row selection / highlight
    rowHover: "#FBFBFB",
    dangerBg: "#FDF2F2",
    dangerText: "#E02424",
    dangerBorder: "#F8B4B4",
    warningBg: "#FFFBEB",
    warningText: "#92400E",
    warningBorder: "#FDE68A"
  };
  var STATUS_CONFIG = {
    not_started: {
      label: "Not started",
      bg: "#F2F2F2",
      text: "#555555",
      dotColor: "#999999",
      borderColor: "#E0E0E0"
    },
    in_review: {
      label: "In review",
      bg: "#FFF8E1",
      text: "#B78103",
      dotColor: "#F59E0B",
      borderColor: "#FFE082"
    },
    signed_off: {
      label: "Signed off",
      bg: "#E8F5E9",
      text: "#1B5E20",
      dotColor: "#10B981",
      borderColor: "#A5D6A7"
    },
    blocked: {
      label: "Blocked",
      bg: "#FFEBEE",
      text: "#C62828",
      dotColor: "#EF4444",
      borderColor: "#EF9A9A"
    },
    na: {
      label: "N/A",
      bg: "#EEEEEE",
      text: "#757575",
      dotColor: "#9E9E9E",
      borderColor: "#E0E0E0"
    }
  };

  // src/constants/presets.ts
  var ROLE_PRESETS = [
    {
      id: "design-signoff",
      name: "Design Sign-off",
      roles: ["Design", "Eng", "PM", "QA"]
    },
    {
      id: "legal-compliance",
      name: "Legal / Compliance Review",
      roles: ["Legal", "Compliance", "Security"]
    },
    {
      id: "launch-checklist",
      name: "Launch Checklist",
      roles: ["Design", "Eng", "PM", "Marketing", "Support"]
    }
  ];

  // src/components/Icons.tsx
  var DragHandleIcon = ({ size = 14, color = "#B3B3B3" }) => {
    return /* @__PURE__ */ figma.widget.h(
      SVG,
      {
        src: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="6" cy="4" r="1.25" fill="${color}" />
        <circle cx="10" cy="4" r="1.25" fill="${color}" />
        <circle cx="6" cy="8" r="1.25" fill="${color}" />
        <circle cx="10" cy="8" r="1.25" fill="${color}" />
        <circle cx="6" cy="12" r="1.25" fill="${color}" />
        <circle cx="10" cy="12" r="1.25" fill="${color}" />
      </svg>`
      }
    );
  };
  var CheckboxIcon = ({ checked = false, onClick }) => {
    if (checked) {
      return /* @__PURE__ */ figma.widget.h(
        SVG,
        {
          onClick,
          src: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="16" height="16" rx="4" fill="#0D99FF" />
          <path d="M4.5 8.2L6.8 10.5L11.5 5.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`
        }
      );
    }
    return /* @__PURE__ */ figma.widget.h(
      SVG,
      {
        onClick,
        src: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.75" y="0.75" width="14.5" height="14.5" rx="3.25" fill="white" stroke="#CCCCCC" stroke-width="1.5" />
      </svg>`
      }
    );
  };
  var NoteIcon = ({ hasNote = false, isOpen = false, onClick }) => {
    if (hasNote || isOpen) {
      return /* @__PURE__ */ figma.widget.h(
        SVG,
        {
          onClick,
          src: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="2.5" width="14" height="15" rx="3" fill="#0D99FF" />
          <path d="M6.5 6.5H13.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          <path d="M6.5 10H13.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
          <path d="M6.5 13.5H10.5" stroke="white" stroke-width="1.5" stroke-linecap="round" />
        </svg>`
        }
      );
    }
    return /* @__PURE__ */ figma.widget.h(
      SVG,
      {
        onClick,
        src: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.75" y="3.25" width="12.5" height="13.5" rx="2.25" fill="none" stroke="#A0A0A0" stroke-width="1.5" />
        <path d="M6.5 7H13.5" stroke="#A0A0A0" stroke-width="1.3" stroke-linecap="round" />
        <path d="M6.5 10H13.5" stroke="#A0A0A0" stroke-width="1.3" stroke-linecap="round" />
        <path d="M6.5 13H10" stroke="#A0A0A0" stroke-width="1.3" stroke-linecap="round" />
      </svg>`
      }
    );
  };
  var GearIcon = ({ size = 16, color = "#666666", onClick }) => {
    return /* @__PURE__ */ figma.widget.h(
      SVG,
      {
        onClick,
        src: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.5 1.5H9.5V3.1A4.5 4.5 0 0 1 10.8 3.8L12.3 2.3L14.4 4.4L12.9 5.9A4.5 4.5 0 0 1 13.6 7.2H15.2V10.2H13.6A4.5 4.5 0 0 1 12.9 11.5L14.4 13L12.3 15.1L10.8 13.6A4.5 4.5 0 0 1 9.5 14.3V15.9H6.5V14.3A4.5 4.5 0 0 1 5.2 13.6L3.7 15.1L1.6 13L3.1 11.5A4.5 4.5 0 0 1 2.4 10.2H0.8V7.2H2.4A4.5 4.5 0 0 1 3.1 5.9L1.6 4.4L3.7 2.3L5.2 3.8A4.5 4.5 0 0 1 6.5 3.1V1.5ZM8 5.5A2.5 2.5 0 1 0 8 10.5A2.5 2.5 0 0 0 8 5.5Z" fill="${color}"/>
      </svg>`
      }
    );
  };
  var ChevronDownIcon = ({ size = 12, color = "#666666" }) => {
    return /* @__PURE__ */ figma.widget.h(
      SVG,
      {
        src: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 6L8 10L12 6" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      </svg>`
      }
    );
  };
  var PlusIcon = ({ size = 14, color = "#0D99FF", onClick }) => {
    return /* @__PURE__ */ figma.widget.h(
      SVG,
      {
        onClick,
        src: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 3V13M3 8H13" stroke="${color}" stroke-width="1.8" stroke-linecap="round" />
      </svg>`
      }
    );
  };
  var CloseIcon = ({ size = 14, color = "#8C8C8C", onClick }) => {
    return /* @__PURE__ */ figma.widget.h(
      SVG,
      {
        onClick,
        src: `<svg width="${size}" height="${size}" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4L12 12M12 4L4 12" stroke="${color}" stroke-width="1.6" stroke-linecap="round" />
      </svg>`
      }
    );
  };

  // src/components/Header.tsx
  var Header = ({
    title,
    onTitleChange,
    rows,
    mode,
    onOpenSettings
  }) => {
    let dotColor = "#BDBDBD";
    if (rows.length > 0) {
      if (mode === "binary") {
        const allChecked = rows.every((r) => r.checked);
        const someChecked = rows.some((r) => r.checked);
        if (allChecked) {
          dotColor = "#10B981";
        } else if (someChecked) {
          dotColor = "#0D99FF";
        }
      } else {
        const hasBlocked = rows.some((r) => r.status === "blocked");
        const allDone = rows.every((r) => r.status === "signed_off" || r.status === "na");
        const hasInReview = rows.some((r) => r.status === "in_review");
        const hasSignedOff = rows.some((r) => r.status === "signed_off");
        if (hasBlocked) {
          dotColor = "#EF4444";
        } else if (allDone) {
          dotColor = "#10B981";
        } else if (hasInReview || hasSignedOff) {
          dotColor = "#F59E0B";
        }
      }
    }
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "vertical",
        width: "fill-parent",
        fill: COLORS.white
      },
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          direction: "horizontal",
          spacing: "auto",
          verticalAlignItems: "center",
          width: "fill-parent",
          padding: { top: 12, bottom: 12, left: 14, right: 14 },
          fill: COLORS.white
        },
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            direction: "horizontal",
            verticalAlignItems: "center",
            spacing: 8,
            width: "fill-parent"
          },
          /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              width: 8,
              height: 8,
              cornerRadius: 4,
              fill: dotColor
            }
          ),
          /* @__PURE__ */ figma.widget.h(
            Input,
            {
              value: title,
              placeholder: "Sign-off Tracker",
              onTextEditEnd: (e) => onTitleChange(e.characters.trim() || "Sign-off Tracker"),
              fontSize: 13,
              fontWeight: 600,
              fill: COLORS.textPrimary,
              width: "fill-parent"
            }
          )
        ),
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            padding: 4,
            cornerRadius: 4,
            fill: COLORS.white,
            hoverStyle: {
              fill: COLORS.hoverBg
            },
            onClick: onOpenSettings
          },
          /* @__PURE__ */ figma.widget.h(
            GearIcon,
            {
              size: 16,
              color: COLORS.textSecondary
            }
          )
        )
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          width: "fill-parent",
          height: 1,
          fill: COLORS.hairline
        }
      )
    );
  };

  // src/utils/date.ts
  var MONTH_NAMES = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  function getFormattedCurrentDate() {
    const now = /* @__PURE__ */ new Date();
    const day = now.getDate();
    const month = MONTH_NAMES[now.getMonth()];
    const year = now.getFullYear();
    return `${day} ${month} ${year}`;
  }

  // src/components/InlineNote.tsx
  var InlineNote = ({
    note,
    onNoteChange,
    onClose
  }) => {
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "horizontal",
        verticalAlignItems: "center",
        spacing: "auto",
        width: "fill-parent",
        padding: { top: 6, bottom: 6, left: 28, right: 12 },
        fill: COLORS.subtleBg
      },
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          direction: "horizontal",
          verticalAlignItems: "center",
          spacing: 6,
          width: "fill-parent"
        },
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            fontSize: 11,
            fill: COLORS.figmaBlue,
            fontWeight: 500
          },
          "Note:"
        ),
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            width: "fill-parent",
            padding: { top: 2, bottom: 2, left: 4, right: 4 },
            fill: COLORS.white,
            stroke: COLORS.hairline,
            strokeWidth: 1,
            cornerRadius: 4
          },
          /* @__PURE__ */ figma.widget.h(
            Input,
            {
              value: note,
              placeholder: "Add a one-line note (e.g. Approved with caveats)...",
              onTextEditEnd: (e) => onNoteChange(e.characters),
              fontSize: 11,
              fill: COLORS.textPrimary,
              width: "fill-parent"
            }
          )
        )
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          padding: 3,
          cornerRadius: 4,
          hoverStyle: {
            fill: COLORS.hoverBg
          },
          onClick: onClose
        },
        /* @__PURE__ */ figma.widget.h(CloseIcon, { size: 12, color: COLORS.textTertiary })
      )
    );
  };

  // src/components/StatusDropdown.tsx
  var ALL_STATUSES = [
    "not_started",
    "in_review",
    "signed_off",
    "blocked",
    "na"
  ];
  var StatusDropdown = ({
    currentStatus,
    onSelectStatus,
    onClose
  }) => {
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "vertical",
        width: "fill-parent",
        padding: { top: 4, bottom: 4, left: 4, right: 4 },
        fill: COLORS.white,
        stroke: COLORS.hairline,
        strokeWidth: 1,
        cornerRadius: 6,
        spacing: 2
      },
      ALL_STATUSES.map((st) => {
        const config = STATUS_CONFIG[st];
        const isSelected = st === currentStatus;
        return /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            key: st,
            direction: "horizontal",
            verticalAlignItems: "center",
            spacing: "auto",
            width: "fill-parent",
            padding: { top: 6, bottom: 6, left: 8, right: 8 },
            cornerRadius: 4,
            fill: isSelected ? COLORS.figmaBlueLight : COLORS.white,
            hoverStyle: {
              fill: isSelected ? COLORS.figmaBlueLight : COLORS.hoverBg
            },
            onClick: () => {
              onSelectStatus(st);
              onClose();
            }
          },
          /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              direction: "horizontal",
              verticalAlignItems: "center",
              spacing: 8
            },
            /* @__PURE__ */ figma.widget.h(
              AutoLayout,
              {
                width: 8,
                height: 8,
                cornerRadius: 4,
                fill: config.dotColor
              }
            ),
            /* @__PURE__ */ figma.widget.h(
              Text,
              {
                fontSize: 12,
                fontWeight: isSelected ? 600 : 400,
                fill: isSelected ? COLORS.figmaBlue : COLORS.textPrimary
              },
              config.label
            )
          ),
          isSelected && /* @__PURE__ */ figma.widget.h(
            Text,
            {
              fontSize: 11,
              fill: COLORS.figmaBlue,
              fontWeight: 600
            },
            "\u2713"
          )
        );
      })
    );
  };

  // src/components/RowItem.tsx
  var RowItem = ({
    row,
    mode,
    isNoteOpen,
    isDropdownOpen,
    onToggleNote,
    onToggleDropdown,
    onUpdateRow
  }) => {
    const handleCheckboxToggle = () => {
      const nextChecked = !row.checked;
      const updates = { checked: nextChecked };
      if (nextChecked) {
        updates.date = getFormattedCurrentDate();
      }
      onUpdateRow(updates);
    };
    const handleSelectStatus = (status) => {
      const updates = { status };
      if (status === "signed_off") {
        updates.date = getFormattedCurrentDate();
      }
      onUpdateRow(updates);
    };
    const hasNote = Boolean(row.note && row.note.trim().length > 0);
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "vertical",
        width: "fill-parent",
        fill: COLORS.white
      },
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          direction: "horizontal",
          verticalAlignItems: "center",
          spacing: "auto",
          width: "fill-parent",
          padding: { top: 8, bottom: 8, left: 10, right: 12 },
          fill: COLORS.white,
          hoverStyle: {
            fill: COLORS.rowHover
          }
        },
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            direction: "horizontal",
            verticalAlignItems: "center",
            spacing: 8,
            width: "fill-parent"
          },
          /* @__PURE__ */ figma.widget.h(AutoLayout, { padding: 2 }, /* @__PURE__ */ figma.widget.h(DragHandleIcon, { size: 12, color: COLORS.hairline })),
          mode === "binary" && /* @__PURE__ */ figma.widget.h(AutoLayout, { padding: 2 }, /* @__PURE__ */ figma.widget.h(
            CheckboxIcon,
            {
              checked: row.checked,
              onClick: handleCheckboxToggle
            }
          )),
          /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              direction: "vertical",
              spacing: 1,
              width: "fill-parent"
            },
            /* @__PURE__ */ figma.widget.h(
              Input,
              {
                value: row.role,
                placeholder: "Role / Team",
                onTextEditEnd: (e) => onUpdateRow({ role: e.characters.trim() || "Role" }),
                fontSize: 13,
                fontWeight: 600,
                fill: COLORS.textPrimary,
                width: "fill-parent"
              }
            ),
            /* @__PURE__ */ figma.widget.h(
              Input,
              {
                value: row.assignee,
                placeholder: "Unassigned",
                onTextEditEnd: (e) => onUpdateRow({ assignee: e.characters.trim() }),
                fontSize: 11,
                fontWeight: 400,
                italic: !row.assignee,
                fill: row.assignee ? COLORS.textSecondary : COLORS.textMuted,
                width: "fill-parent"
              }
            )
          )
        ),
        /* @__PURE__ */ figma.widget.h(
          AutoLayout,
          {
            direction: "horizontal",
            verticalAlignItems: "center",
            spacing: 8
          },
          /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              padding: 3,
              cornerRadius: 4,
              hoverStyle: {
                fill: COLORS.hoverBg
              },
              onClick: onToggleNote
            },
            /* @__PURE__ */ figma.widget.h(NoteIcon, { hasNote, isOpen: isNoteOpen })
          ),
          /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              verticalAlignItems: "center",
              padding: { top: 2, bottom: 2, left: 4, right: 4 },
              cornerRadius: 4,
              fill: COLORS.white,
              hoverStyle: {
                fill: COLORS.subtleBg
              }
            },
            /* @__PURE__ */ figma.widget.h(
              Input,
              {
                value: row.date,
                placeholder: "\u2014",
                onTextEditEnd: (e) => onUpdateRow({ date: e.characters.trim() }),
                fontSize: 11,
                fontWeight: 400,
                fill: row.date ? COLORS.textSecondary : COLORS.textMuted,
                width: 76
              }
            )
          ),
          mode === "multistate" && /* @__PURE__ */ figma.widget.h(
            AutoLayout,
            {
              direction: "horizontal",
              verticalAlignItems: "center",
              spacing: 5,
              padding: { top: 4, bottom: 4, left: 8, right: 8 },
              cornerRadius: 20,
              fill: STATUS_CONFIG[row.status].bg,
              stroke: STATUS_CONFIG[row.status].borderColor,
              strokeWidth: 1,
              hoverStyle: {
                fill: STATUS_CONFIG[row.status].bg
              },
              onClick: onToggleDropdown
            },
            /* @__PURE__ */ figma.widget.h(
              AutoLayout,
              {
                width: 6,
                height: 6,
                cornerRadius: 3,
                fill: STATUS_CONFIG[row.status].dotColor
              }
            ),
            /* @__PURE__ */ figma.widget.h(
              Text,
              {
                fontSize: 11,
                fontWeight: 500,
                fill: STATUS_CONFIG[row.status].text
              },
              STATUS_CONFIG[row.status].label
            ),
            /* @__PURE__ */ figma.widget.h(ChevronDownIcon, { size: 10, color: STATUS_CONFIG[row.status].text })
          )
        )
      ),
      isNoteOpen && /* @__PURE__ */ figma.widget.h(
        InlineNote,
        {
          note: row.note,
          onNoteChange: (newNote) => onUpdateRow({ note: newNote }),
          onClose: onToggleNote
        }
      ),
      mode === "multistate" && isDropdownOpen && /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          width: "fill-parent",
          padding: { top: 2, bottom: 6, left: 32, right: 12 }
        },
        /* @__PURE__ */ figma.widget.h(
          StatusDropdown,
          {
            currentStatus: row.status,
            onSelectStatus: handleSelectStatus,
            onClose: onToggleDropdown
          }
        )
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          width: "fill-parent",
          height: 1,
          fill: COLORS.hairline
        }
      )
    );
  };

  // src/components/EmptyState.tsx
  var EmptyState = ({ onChoosePreset }) => {
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "vertical",
        horizontalAlignItems: "center",
        verticalAlignItems: "center",
        width: "fill-parent",
        padding: { top: 24, bottom: 24, left: 16, right: 16 },
        spacing: 12,
        fill: COLORS.white
      },
      /* @__PURE__ */ figma.widget.h(
        Text,
        {
          fontSize: 12,
          fill: COLORS.textSecondary,
          horizontalAlignText: "center",
          width: "fill-parent"
        },
        "Start from a preset or build your own list of roles that need to sign off."
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          direction: "horizontal",
          verticalAlignItems: "center",
          padding: { top: 7, bottom: 7, left: 12, right: 12 },
          cornerRadius: 6,
          fill: COLORS.figmaBlue,
          hoverStyle: {
            fill: COLORS.figmaBlueHover
          },
          onClick: onChoosePreset
        },
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            fontSize: 12,
            fontWeight: 600,
            fill: COLORS.white
          },
          "Choose a preset"
        )
      )
    );
  };

  // src/components/Footer.tsx
  var Footer = ({ mode, onAddRole }) => {
    const modeLabel = mode === "binary" ? "Binary" : "Multi-state";
    return /* @__PURE__ */ figma.widget.h(AutoLayout, { direction: "vertical", width: "fill-parent", fill: COLORS.white }, /* @__PURE__ */ figma.widget.h(AutoLayout, { width: "fill-parent", height: 1, fill: COLORS.hairline }), /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "horizontal",
        spacing: "auto",
        verticalAlignItems: "center",
        width: "fill-parent",
        padding: { top: 10, bottom: 10, left: 14, right: 14 },
        fill: COLORS.white
      },
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          direction: "horizontal",
          verticalAlignItems: "center",
          spacing: 4,
          padding: { top: 4, bottom: 4, left: 6, right: 6 },
          cornerRadius: 4,
          hoverStyle: {
            fill: COLORS.figmaBlueLight
          },
          onClick: onAddRole
        },
        /* @__PURE__ */ figma.widget.h(PlusIcon, { size: 12, color: COLORS.figmaBlue }),
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            fontSize: 12,
            fontWeight: 600,
            fill: COLORS.figmaBlue
          },
          "Add role"
        )
      ),
      /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          padding: { top: 2, bottom: 2, left: 6, right: 6 },
          cornerRadius: 4,
          fill: COLORS.subtleBg,
          stroke: COLORS.hairline,
          strokeWidth: 1
        },
        /* @__PURE__ */ figma.widget.h(
          Text,
          {
            fontSize: 10,
            fontWeight: 500,
            fill: COLORS.textTertiary
          },
          modeLabel
        )
      )
    ));
  };

  // src/code.tsx
  function generateUniqueId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  function SignoffTrackerWidget() {
    const [title, setTitle] = useSyncedState("title", "Design Sign-off");
    const [mode, setMode] = useSyncedState("mode", "binary");
    const [rows, setRows] = useSyncedState("rows", []);
    const [activeDropdownRowId, setActiveDropdownRowId] = useSyncedState(
      "activeDropdownRowId",
      ""
    );
    const [openNoteRowIds, setOpenNoteRowIds] = useSyncedState(
      "openNoteRowIds",
      []
    );
    const openSettings = () => {
      return new Promise((resolve) => {
        figma.showUI(__html__, { width: 340, height: 420, title: "Widget Settings" });
        figma.ui.onmessage = (msg) => {
          switch (msg.type) {
            case "ready": {
              figma.ui.postMessage({ type: "init", mode, rows });
              break;
            }
            case "set-mode": {
              const newMode = msg.mode;
              setMode(newMode);
              break;
            }
            case "apply-preset": {
              const preset = ROLE_PRESETS.find((p) => p.id === msg.presetId);
              if (preset) {
                const seededRows = preset.roles.map((roleName) => ({
                  id: generateUniqueId(),
                  role: roleName,
                  assignee: "",
                  checked: false,
                  status: "not_started",
                  date: "",
                  note: ""
                }));
                setRows(seededRows);
              }
              figma.closePlugin();
              resolve();
              break;
            }
            case "reorder-row": {
              const { draggedId, targetIndex } = msg;
              const draggedIndex = rows.findIndex((r) => r.id === draggedId);
              if (draggedIndex === -1) break;
              const newRows = [...rows];
              const [moved] = newRows.splice(draggedIndex, 1);
              newRows.splice(targetIndex, 0, moved);
              setRows(newRows);
              figma.ui.postMessage({ type: "update-rows", rows: newRows });
              break;
            }
            case "remove-row": {
              const id = msg.id;
              const newRows = rows.filter((r) => r.id !== id);
              setRows(newRows);
              setOpenNoteRowIds(openNoteRowIds.filter((rowId) => rowId !== id));
              if (activeDropdownRowId === id) setActiveDropdownRowId("");
              figma.ui.postMessage({ type: "update-rows", rows: newRows });
              break;
            }
            case "close": {
              figma.closePlugin();
              resolve();
              break;
            }
          }
        };
      });
    };
    const handleAddRole = () => {
      const newRow = {
        id: generateUniqueId(),
        role: "Role",
        assignee: "",
        checked: false,
        status: "not_started",
        date: "",
        note: ""
      };
      setRows([...rows, newRow]);
    };
    const handleToggleNote = (rowId) => {
      setOpenNoteRowIds(
        openNoteRowIds.includes(rowId) ? openNoteRowIds.filter((id) => id !== rowId) : [...openNoteRowIds, rowId]
      );
    };
    const handleUpdateRow = (id, updated) => {
      setRows(
        rows.map((row) => row.id === id ? __spreadValues(__spreadValues({}, row), updated) : row)
      );
    };
    const handleToggleDropdown = (rowId) => {
      setActiveDropdownRowId(activeDropdownRowId === rowId ? "" : rowId);
    };
    return /* @__PURE__ */ figma.widget.h(
      AutoLayout,
      {
        direction: "vertical",
        width: 340,
        cornerRadius: 8,
        fill: COLORS.cardBg,
        stroke: COLORS.canvasBorder,
        strokeWidth: 1
      },
      /* @__PURE__ */ figma.widget.h(
        Header,
        {
          title,
          onTitleChange: setTitle,
          rows,
          mode,
          onOpenSettings: () => waitForTask(openSettings())
        }
      ),
      rows.length === 0 ? /* @__PURE__ */ figma.widget.h(
        EmptyState,
        {
          onChoosePreset: () => waitForTask(openSettings())
        }
      ) : /* @__PURE__ */ figma.widget.h(
        AutoLayout,
        {
          direction: "vertical",
          width: "fill-parent",
          fill: COLORS.white
        },
        rows.map((row) => /* @__PURE__ */ figma.widget.h(
          RowItem,
          {
            key: row.id,
            row,
            mode,
            isNoteOpen: openNoteRowIds.includes(row.id),
            isDropdownOpen: activeDropdownRowId === row.id,
            onToggleNote: () => handleToggleNote(row.id),
            onToggleDropdown: () => handleToggleDropdown(row.id),
            onUpdateRow: (updated) => handleUpdateRow(row.id, updated)
          }
        ))
      ),
      /* @__PURE__ */ figma.widget.h(Footer, { mode, onAddRole: handleAddRole })
    );
  }
  figma_default.register(SignoffTrackerWidget);
})();
