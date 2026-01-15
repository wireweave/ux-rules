# @wireweave/ux-rules

[![npm version](https://img.shields.io/npm/v/@wireweave/ux-rules.svg)](https://www.npmjs.com/package/@wireweave/ux-rules)
[![npm downloads](https://img.shields.io/npm/dm/@wireweave/ux-rules.svg)](https://www.npmjs.com/package/@wireweave/ux-rules)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

UX validation rules for Wireweave DSL. This package provides automated UX best practice validation for wireframe designs.

## Installation

```bash
npm install @wireweave/ux-rules
# or
pnpm add @wireweave/ux-rules
# or
yarn add @wireweave/ux-rules
```

## Usage

```typescript
import { parse } from '@wireweave/core';
import { validateUX, getUXScore, getUXIssues } from '@wireweave/ux-rules';

const doc = parse(`
  page {
    card {
      input placeholder="Email"
      button "Submit" primary
    }
  }
`);

// Full validation
const result = validateUX(doc);
console.log(result.score);    // 0-100
console.log(result.valid);    // true if no errors
console.log(result.issues);   // Array of UX issues

// Quick helpers
const score = getUXScore(doc);
const issues = getUXIssues(doc);
```

## Rule Categories

| Category | Description |
|----------|-------------|
| `accessibility` | Screen reader support, labels, alt text |
| `form` | Form UX patterns, input types, validation |
| `usability` | General usability (empty containers, CTA, loading states, cognitive load) |
| `touch-target` | Touch target sizes for mobile |
| `navigation` | Navigation patterns (item count, active states) |
| `consistency` | Consistent styling across components |
| `content` | Text quality, placeholder detection, title requirements |
| `data-display` | Tables, lists, empty states, pagination |
| `feedback` | Spinners, progress bars, toasts, alerts |

## API

### `validateUX(ast, options?)`

Full validation with score and issues.

**Options:**
- `categories`: Filter by rule categories
- `minSeverity`: Minimum severity to report (`'error'` | `'warning'` | `'info'`)
- `maxIssues`: Maximum issues to collect
- `customRules`: Add custom rules
- `disabledRules`: Disable rules by ID

### `isUXValid(ast)`

Quick check - returns `true` if no errors.

### `getUXScore(ast)`

Returns UX score from 0 to 100.

### `getUXIssues(ast, options?)`

Returns array of UX issues.

### `formatUXResult(result)`

Formats validation result as human-readable string.

## Issue Severity

| Severity | Impact | Score Penalty |
|----------|--------|---------------|
| `error` | Critical UX problem | -10 |
| `warning` | Should fix | -3 |
| `info` | Consider improving | -1 |

## Related Packages

- [@wireweave/core](https://www.npmjs.com/package/@wireweave/core) - Core parser and renderer

## License

MIT
