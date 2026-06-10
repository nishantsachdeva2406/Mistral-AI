# Mistral AI — Test Automation

![Playwright Tests](https://github.com/nishantsachdeva2406/Mistral-AI/actions/workflows/playwright.yml/badge.svg)
![API Tests](https://github.com/nishantsachdeva2406/Mistral-AI/actions/workflows/api-tests.yml/badge.svg)

Test automation suite for the Mistral API and Le Chat.

---

## Getting Started

```bash
git clone https://github.com/nishantsachdeva2406/Mistral-AI.git
cd Mistral-AI
```

Then follow the setup instructions for each suite below.

---

## Structure
mistral-ai/
└── tests/
├── api/    # Postman + Newman API tests
└── ui/     # Playwright + TypeScript UI tests

---

## Test Suites

| Suite | Stack | Docs |
|-------|-------|------|
| API Tests | Postman + Newman | [tests/api/README.md](tests/api/README.md) |
| UI Tests | Playwright + TypeScript | [tests/ui/README.md](tests/ui/README.md) |

---

## CI/CD

Both test suites run automatically via GitHub Actions on every push and pull request:

- **Playwright UI Tests** — headless Chromium, HTML report uploaded as artifact
- **API Tests (Newman)** — Postman collection via Newman, HTML report uploaded as artifact

View latest runs: [GitHub Actions](https://github.com/nishantsachdeva2406/Mistral-AI/actions)

---