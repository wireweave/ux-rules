# @wireweave/ux-rules

UX validation rules for Wireweave DSL. This package provides automated UX best practice validation for wireframe designs.

> **Note:** This is a private package distributed via GitHub Packages.

## Installation

### 1. Configure npm registry

Create or update `.npmrc` in your project:

```
@wireweave:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

### 2. Install the package

```bash
npm install @wireweave/ux-rules
# or
pnpm add @wireweave/ux-rules
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
| `usability` | General usability (empty containers, CTA, loading states) |
| `touch-target` | Touch target sizes for mobile |
| `navigation` | Navigation patterns (item count, active states) |
| `consistency` | Consistent styling across components |

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

## License

MIT
