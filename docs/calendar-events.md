# Calendar Events

Events appear on the `/agenda` calendar page. Each event is a Markdown file in `src/content/events/`.

## Frontmatter Schema

### Required fields

| Field       | Type          | Notes                                                                        |
| ----------- | ------------- | ---------------------------------------------------------------------------- |
| `title`     | string        | Event name.                                                                  |
| `dateStart` | date (string) | Start date. Use ISO format `YYYY-MM-DD`, e.g. `'2026-03-10'`.              |
| `type`      | enum          | One of: `seminar`, `meeting`, `social`, `conference`, `training`, `deadline`. |

### Optional fields

| Field         | Type          | Notes                                                        |
| ------------- | ------------- | ------------------------------------------------------------ |
| `dateEnd`     | date (string) | End date for multi-day events. Same format as `dateStart`.   |
| `location`    | string        | Venue or room name.                                          |
| `description` | string        | Short summary shown on the event card.                       |
| `link`        | string        | External URL. Opens in a new tab (`target="_blank"`).        |

## Example

```yaml
---
title: 'Ensemble Reading Group'
dateStart: '2026-03-25'
type: seminar
location: 'Online (Zoom)'
description: 'Monthly cross-disciplinary reading group. Paper TBA one week before.'
---
```

## Type, Icon, and Colour Mapping

The `type` field controls all visual styling automatically. You do not choose an icon or colour manually.

### Mapping table

| Type         | Colour    | Icon path                          |
| ------------ | --------- | ---------------------------------- |
| `seminar`    | `#d4960c` | `/icons/calendar/seminar.png`      |
| `meeting`    | `#28a745` | `/icons/calendar/meeting.png`      |
| `social`     | `#dc3545` | `/icons/calendar/social.png`       |
| `conference` | `#ccb800` | `/icons/calendar/conference.png`   |
| `training`   | `#20b2aa` | `/icons/calendar/training.png`     |
| `deadline`   | `#333333` | `/icons/calendar/deadline.png`     |

Icons are pixel-art PNGs in `public/icons/calendar/`. Colours are defined in `TYPE_COLORS` and icons in `TYPE_ICONS` inside the inline script in `src/pages/agenda.astro`.

### Where the colour appears

- **Filter button active state** — the `--btn-color` CSS variable.
- **Event card accent line** — the vertical coloured bar on the left of each card.
- **Calendar day dots** — the small coloured dot below a day number indicating an event exists.

## Behavioural Rules

The calendar grid renders dynamically via inline JavaScript. These rules govern how icons and highlights behave:

1. **Default "Upcoming" view** — No type icons are shown on calendar days. Only coloured dots appear for days with events.
2. **Type filter active** — When a specific type filter button is selected, the corresponding pixel-art icon renders behind the day number (at `z-index: 0`, day number at `z-index: 1`) for each day that has an event of that type.
3. **Single event selected** — When a user clicks a specific day, the event list on the right updates. The type icon still follows rule 2 (shown only when a type filter is active).
4. **Selected day highlight** — The highlight ring on the selected day must not obscure the icon beneath it. The icon sits behind the day number layer.

## Date Handling

The content schema uses `z.coerce.date()`. For consistency, use **ISO `YYYY-MM-DD`** format (e.g. `'2026-03-10'`). Wrap dates in quotes in YAML frontmatter.

Multi-day events mark every day in the range on the calendar. Set both `dateStart` and `dateEnd`.

## External Links

If `link` is set, the event title on the card becomes a clickable link that opens in a new tab (`target="_blank"`, `rel="noopener noreferrer"`). Do not use iframes — external sites block them.

## Adding a New Event Type

If a new type is needed (requires maintainer approval):

1. Add the value to the `type` enum in `src/content/config.ts`.
2. Add a colour entry to `TYPE_COLORS` in `src/pages/agenda.astro`.
3. Add an icon entry to `TYPE_ICONS` in `src/pages/agenda.astro`.
4. Place the icon PNG at `public/icons/calendar/<type>.png`.
5. Add the type to the `EVENT_TYPES` array in the frontmatter script of `agenda.astro`.
