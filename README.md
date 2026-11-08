# Vijay Karthik — Portfolio

A minimal, high-impact single-page portfolio engineered with the **Positivus neo-brutalist aesthetic** (electric lime green `#B9FF66`, matte obsidian black `#191A23`, crisp white, and rounded border cards).

---

## ⚡ Quick Start & Local Testing

### 1. Test Locally with SMTP (Contact Form)
To use the contact form with your `.env` Gmail SMTP credentials:
```bash
npm install
npm start
```
Then open **[http://localhost:3000](http://localhost:3000)** in your browser. Any message submitted in the form will now send directly via Nodemailer!

> [!NOTE]
> If you open `index.html` directly via double-clicking (`file:///`), there is no server running to handle `POST /api/contact`, so the form will automatically launch your default email client (`mailto:`) instead.

---

## 🎛️ Single Source of Truth (`config.js`)

You do **not** need to search through 1,000+ lines of HTML to edit your information, drive links, or projects! Everything can be modified inside **[`config.js`](file:///o:/git/portfolio/config.js)**:

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

---

## 📁 File Structure

- **[`config.js`](file:///o:/git/portfolio/config.js)**: Single source of truth for all links, projects, stats, and text content.
- **[`index.html`](file:///o:/git/portfolio/index.html)**: Clean, semantic markup with accessible landmark sections.
- **[`style.css`](file:///o:/git/portfolio/style.css)**: Neo-brutalist Positivus styling with solid offset shadows and responsive layouts.
- **[`script.js`](file:///o:/git/portfolio/script.js)**: Handles hydration from `config.js`, accordion toggles, mobile drawer, back-to-top scroll, and `/api/contact` submissions.
- **[`api/contact.js`](file:///o:/git/portfolio/api/contact.js)**: Serverless function powered by `nodemailer` for Vercel and Node. Features strict email validation (RFC syntax, disposable domain filter, and DNS MX record lookup) and renders two branded Positivus neo-brutalist HTML email templates (Admin Lead Notification & Client Auto-Receipt).
- **[`server.js`](file:///o:/git/portfolio/server.js)**: Lightweight Node server that loads `.env` and serves both static files and the `/api/contact` endpoint locally.
- **[`assets/`](file:///o:/git/portfolio/assets)**: Cleaned assets directory containing:
  - `logo.png` (Profile photo & favicon)
  - `github.png`, `linkedin.png`, `leetcode.png`, `codechef.png`, `codolio-icon.png`

---

## 📧 Gmail SMTP Configuration (`.env`)

For Gmail authentication with Nodemailer:
1. Make sure your [`.env`](file:///o:/git/portfolio/.env) file has:
   ```env
   GMAIL_USER=karthikryali2007@gmail.com
   GMAIL_PASS=your_16_character_app_password
   ```
2. **Important**: `GMAIL_PASS` must be a **Google App Password** (16 lowercase letters generated at [Google App Passwords](https://myaccount.google.com/apppasswords)), **not** your regular Google account password.
3. When deploying to **Vercel**, add `GMAIL_USER` and `GMAIL_PASS` under **Settings > Environment Variables** in your Vercel project dashboard.
