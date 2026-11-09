# Vijay Karthik — Portfolio & AI Mode

A minimal, high-impact single-page portfolio and interactive **AI Mode** engineered with the **Positivus neo-brutalist aesthetic** (electric lime green `#B9FF66`, matte obsidian black `#191A23`, crisp white, and rounded border cards).

---

## ⚡ Quick Start & Local Testing

### 1. Start the Local Server
```bash
npm install
npm start
```
- **Portfolio Main Page**: [http://localhost:3000](http://localhost:3000)
- **Interactive AI Chat Mode**: [http://localhost:3000/ai](http://localhost:3000/ai)

---

## 🏛️ Architecture & Separation of Concerns

The repository is organized following clean architectural principles:

```text
portfolio/
├── assets/                    # Media, logos & icons (logo.png, github.png, etc.)
├── css/
│   ├── style.css              # Master Positivus neo-brutalist portfolio styles
│   └── ai.css                 # Specialized AI Mode chat styles & typing indicators
├── js/
│   ├── config.js              # Single source of truth for portfolio data & links
│   ├── script.js              # Portfolio dynamic hydration, UI accordions & OTP client
│   ├── ai.js                  # AI Mode client controller & progressive typing client
│   └── vendor/
│       └── marked.min.js      # Vendor Markdown parser (UMD)
├── api/
│   ├── contact.js             # Serverless HTTP controller for /api/contact
│   ├── chat.js                # Serverless HTTP controller for /api/chat
│   └── services/
│       ├── emailValidator.js  # RFC regex, disposable domain filter, DNS MX lookup
│       ├── emailTemplates.js  # Positivus-branded responsive HTML email templates
│       ├── otpService.js      # Crypto HMAC tokens, attempt tracking & replay protection
│       ├── mailer.js          # Nodemailer SMTP transporter & dispatch helper
│       ├── groqService.js     # Groq API key rotation, round-robin & rate-limit fallback
│       └── systemPrompt.js    # Grounded persona, recruiter JD evaluation & scope rules
├── index.html                 # Main portfolio page entrypoint
├── ai.html                    # AI Mode chat page entrypoint
├── server.js                  # Development server (serves static assets + routes /ai, /api/*)
├── package.json               # Dependencies and start script
├── .env                       # Environment variables (GMAIL_USER, GMAIL_PASS, GROQ_API_KEYS)
└── .env.example               # Environment variable templates
```

---

## 🤖 AI Mode (`/ai`)

A dedicated ChatGPT-inspired interactive chat interface tailored in the Positivus neo-brutalist theme.
- **Backend LLM**: Powered by **Groq** (`llama-3.3-70b-versatile` by default).
- **Strict Scope Guardrails**: Grounded exclusively in Vijay Karthik's professional profile (skills, projects like DevMeter and SQL Data Warehouse, RAG experience at HiRekruit, competitive coding stats, education, and contact channels). Politely deflects any unrelated questions back to Vijay's profile.
- **Recruiter & JD Evaluator**: Evaluates job descriptions pasted by recruiters and directly maps Vijay's skills and projects to requirements.
- **Round-Robin Multi-Key Rotation & Auto-Fallback**: Configure multiple Groq API keys; the backend rotates keys across requests and automatically falls back to the next key if a key hits rate limits (HTTP 429) or fails.
- **Session Chat History**: Keeps conversation turns within the active session so users can ask contextual follow-ups.
- **Markdown Parsing & Typing Effect**: Progressive typing animation rendering bold text, bulleted lists, numbered steps, inline code, and code blocks cleanly.

### Groq API Key Setup (`.env`):
Get your free API key at [Groq Console](https://console.groq.com/keys) and add it to your [`.env`](file:///o:/git/portfolio/.env):
```env
# Single key:
GROQ_API_KEY=gsk_your_key_here

# Or multiple keys for round-robin rotation & rate-limit fallback:
GROQ_API_KEYS=gsk_key1,gsk_key2,gsk_key3

# Optional model override (defaults to llama-3.3-70b-versatile):
GROQ_MODEL=llama-3.3-70b-versatile
```

---

## 🔐 Contact Form with Email OTP Verification

To protect against spam and fake/non-existent email addresses, inquiries require one-time email OTP verification:
1. **Validation**: Email syntax checked against RFC standards, disposable email domains blocked, and live DNS MX records verified.
2. **OTP Dispatch**: A cryptographically random 6-digit code is dispatched to the entered email with a 10-minute HMAC token.
3. **Verification**: Direct lead notifications are only sent after the user confirms their mailbox with the correct code.
4. **Security**: Session attempt limits (5 attempts), 60-second resend cooldown, replay prevention, and timing-safe hash comparison.

---

## 🎛️ Single Source of Truth (`js/config.js`)

You do **not** need to search through 1,000+ lines of HTML to edit your information, drive links, or projects! Everything can be modified inside **[`js/config.js`](file:///o:/git/portfolio/js/config.js)**:

- **Drive & Document Links (`portfolioConfig.links`)**:
  - Update `resumeDriveLink` once, and all Resume buttons across the navbar, hero section, and footer automatically update!
  - Update `transcriptDriveLink` or certificate links.
- **Projects (`portfolioConfig.projects`)**:
  - Add or edit projects (title, category, date, description, bullet points, tags, GitHub link). Cards are dynamically rendered into the grid.
- **Work Experience (`portfolioConfig.experience`)**:
  - Add or update internships, responsibilities, certificate links, and open/closed accordion states.
- **Competitive Programming Stats (`portfolioConfig.stats`)**:
  - Update problem counts, contest counts, or ratings. Animated counters automatically read these values on scroll.
- **Certifications (`portfolioConfig.certifications`)**:
  - Add new verified badges and URLs.
- **Social Profiles & Handles (`portfolioConfig.profiles`)**:
  - Manage links to GitHub, LinkedIn, LeetCode, CodeChef, and Codolio.
