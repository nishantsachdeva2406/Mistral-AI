# Mistral AI — API Test Automation

Automated API tests for the Mistral `/v1/chat/completions` endpoint built with Postman and Newman.

---

## Tech Stack

- [Postman](https://postman.com) — API test collection
- [Newman](https://github.com/postmanlabs/newman) — CLI runner for CI/CD
- [newman-reporter-htmlextra](https://github.com/DannyDainton/newman-reporter-htmlextra) — HTML reports

---

## Project Structure

```
api/
  Chat Completions API.postman_collection.json    # Postman collection
  PRD.postman_environment.example.json            # Environment template (safe to commit)
  PRD.postman_environment.json                    # Your environment with API key (gitignored)
  reports/
    api-report.html                               # Generated HTML report
  README.md
```

---

## Prerequisites

- Node.js v20+
- Newman installed globally

---

## Installation

```bash
sudo npm install -g newman newman-reporter-htmlextra
```

---

## Environment Setup

```bash
cp PRD.postman_environment.example.json PRD.postman_environment.json
```

Open `PRD.postman_environment.json` and add your API key:

```json
{
  "key": "api_key",
  "value": "your_actual_api_key_here"
}
```

Get your API key from [console.mistral.ai](https://console.mistral.ai) → API Keys → Create new key.

---

## Running Tests

```bash
newman run "Chat Completions API.postman_collection.json" \
  -e "PRD.postman_environment.json" \
  --reporters cli,htmlextra \
  --reporter-htmlextra-export reports/api-report.html
```

---

## Test Cases

### 01 - Happy Path

| Request | What is tested |
|---------|---------------|
| Valid completion — basic prompt | Status 200, response structure, model behaviour, token usage, response time |
| Valid completion — max_tokens respected | Response truncated at max_tokens, finish_reason is length |

### 02 - Negative Tests

| Request | Expected Status | What is tested |
|---------|----------------|---------------|
| Missing API key | 401 | Unauthenticated request rejected |
| Invalid API key | 401 | Invalid credentials rejected |
| Missing model field | 400 | Required field validation |
| Missing messages field | 422 | Required field validation |
| Invalid model name | 400 | Unknown model rejected |

### 03 - Edge Cases

| Request | What is tested |
|---------|---------------|
| Empty string message | Empty content rejected with clear error |
| Very long prompt | Performance with large input |
| max_tokens = 1 | Single token output behaviour |

---

## Test Results

```
requests:          10 executed, 0 failed
assertions:        33 executed, 0 failed
duration:          3.2s
avg response time: 286ms
```
![API Report](docs/TestReportAPI.png)
---