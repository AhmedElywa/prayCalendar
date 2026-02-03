# Contributing to PrayCalendar

Thank you for your interest in contributing to PrayCalendar! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Code Style](#code-style)
- [Commit Guidelines](#commit-guidelines)
- [Testing](#testing)

---

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. Please be kind and constructive in all interactions.

---

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/prayCalendar.git
   cd prayCalendar
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/AhmedElywa/prayCalendar.git
   ```
4. **Install dependencies**:
   ```bash
   bun install
   ```
5. **Start development server**:
   ```bash
   bun dev
   ```

---

## How to Contribute

### Reporting Bugs

Before submitting a bug report:
- Check [existing issues](https://github.com/AhmedElywa/prayCalendar/issues) to avoid duplicates
- Try to reproduce the bug on the [live site](https://pray.ahmedelywa.com)

When submitting a bug report, include:
- **Clear title** describing the issue
- **Steps to reproduce** the bug
- **Expected behavior** vs actual behavior
- **Browser/device information**
- **Screenshots** if applicable

[Submit a bug report](https://github.com/AhmedElywa/prayCalendar/issues/new?labels=bug&template=bug_report.md)

### Suggesting Features

We welcome feature suggestions! Before submitting:
- Check [existing issues](https://github.com/AhmedElywa/prayCalendar/issues) for similar requests
- Consider if the feature aligns with the project's goals

When suggesting a feature, include:
- **Clear title** describing the feature
- **Problem** the feature would solve
- **Proposed solution** with details
- **Alternatives** you've considered

[Request a feature](https://github.com/AhmedElywa/prayCalendar/issues/new?labels=enhancement&template=feature_request.md)

### Pull Requests

#### Before Starting
1. **Check for existing PRs** working on the same thing
2. **Open an issue first** for significant changes to discuss the approach
3. **Keep PRs focused** — one feature or fix per PR

#### PR Process
1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

2. **Make your changes** following our [code style](#code-style)

3. **Test your changes**:
   ```bash
   bun test
   bun check
   ```

4. **Commit your changes** following our [commit guidelines](#commit-guidelines)

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** with:
   - Clear title describing the change
   - Description of what was changed and why
   - Link to related issue(s) if applicable
   - Screenshots for UI changes

#### PR Review
- PRs require at least one approval before merging
- Address review feedback promptly
- Keep the PR up to date with `main`

---

## Development Setup

### Prerequisites
- [Bun](https://bun.sh) v1.0+ (recommended) or Node.js 18+
- [Redis](https://redis.io) (optional, for caching)

### Environment Variables
Create a `.env.local` file:
```bash
# Optional: Redis connection
REDIS_URL=redis://localhost:6379

# Optional: Admin dashboard
ADMIN_KEY=dev-key
```

### Project Structure
```
src/
├── app/           # Next.js App Router pages and API routes
├── Components/    # React components
├── constants/     # Static data (translations, cities, etc.)
├── contexts/      # React contexts
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and services
└── __tests__/     # Test files
```

---

## Code Style

This project uses [Biome](https://biomejs.dev) for linting and formatting.

### Rules
- Use **TypeScript** for all new code
- Use **functional components** with hooks
- Prefer **named exports** over default exports (except pages)
- Use **descriptive variable names**
- Keep components **small and focused**

### Commands
```bash
# Check for issues
bun check

# Fix auto-fixable issues
bun check:fix

# Format code
bun format

# Lint only
bun lint
```

### Editor Setup
Install the Biome extension for your editor:
- [VS Code](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)
- [Other editors](https://biomejs.dev/guides/editors/)

---

## Commit Guidelines

We use conventional commit messages for clear history and automated changelogs.

### Format
```
<type>: <description>

[optional body]

[optional footer]
```

### Types
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding or updating tests
- `chore:` — Maintenance tasks

### Examples
```bash
feat: Add Ramadan mode with Iftar and Suhoor events

fix: Correct Qibla calculation for southern hemisphere

docs: Update API documentation with new parameters

refactor: Extract prayer time calculation into separate hook
```

### Pre-commit Hooks
This project uses [Lefthook](https://github.com/evilmartians/lefthook) to run checks before commits:
- Biome linting on staged files

If checks fail, fix the issues before committing.

---

## Testing

### Running Tests
```bash
# Unit tests
bun test

# Watch mode
bun test:watch

# E2E tests
npx playwright test
```

### Writing Tests
- Place unit tests in `src/__tests__/`
- Mirror the source file structure
- Name test files as `*.test.ts` or `*.test.tsx`

### Test Coverage
- Write tests for new features
- Add regression tests for bug fixes
- Aim for meaningful coverage, not 100%

---

## Questions?

If you have questions, feel free to:
- Open a [discussion](https://github.com/AhmedElywa/prayCalendar/discussions)
- Ask in an issue

Thank you for contributing!
