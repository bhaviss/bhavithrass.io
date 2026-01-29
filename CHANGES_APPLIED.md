# All Changes Applied (Portfolio)

Summary of every change we discussed and implemented.

---

## 1. **No blur / blank sections**
- **Removed** scroll-reveal that set sections to `opacity: 0` (no more `animate-on-scroll` hiding content).
- **Removed** card observer that set project/skill/education/timeline cards to `opacity: 0` then animated them in (could leave content invisible).
- **Removed** body `pageLoad` animation (body no longer starts at `opacity: 0`).
- **Added** at start of `script.js`: `document.documentElement.style.opacity = '1'` and `document.body.style.opacity = '1'`.
- **Removed** hero section opacity fade on scroll (hero no longer fades to 0 when scrolling).
- **CSS**: Sections use `opacity: 1` and `transform: translateY(0)`; no body fade-in animation.

---

## 2. **Warm theme (no blue)**
- **`:root`** uses warm primary: `#c45c26`, `#b4531e` (terracotta/amber).
- **Replaced** all remaining blue accents in `style.css` and `script.js` with warm equivalents:
  - Hero background glow, code-intro shadow, buttons (primary hover, secondary hover).
  - Project placeholders, badges, metrics, GitHub link hover.
  - About personal tags, creative samples, timeline pulse, experience toggle.
  - Skills/certs/creative tags and samples.
  - Featured project card, project-snow theme (unified to warm), modal, video play button, play-button animation.
  - Scroll-to-top button (script), cursor trail (script), particle colors (script), timeline dot hover (script).

---

## 3. **Leave a message section**
- **HTML**: Contact section includes a “Leave a message” block with:
  - Heading “Leave a message”
  - Form (Name, Email, Message, Send button) using Formspree (`action="https://formspree.io/f/YOUR_FORM_ID"` — replace `YOUR_FORM_ID` with your Formspree form ID).
  - Note: “Or email me directly at bhavithrass@gmail.com”
- **CSS**: `.leave-message` and `.contact-form` styled (card, labels, inputs, textarea, focus states, note link).

---

## 4. **Cache busting**
- **HTML**: `style.css?v=3` and `script.js?v=3` so browsers load the latest CSS/JS after deploy.

---

## 5. **Already in place (no further change)**
- Profile picture: `images/my-photo.png`
- Nav: “Work” link to projects; hero CTA “View Projects”
- About: conversational copy; “When I’m not coding” / “Favourite series” (DARK, 3 Body Problem, Stranger Things)
- Projects: image-first grid, Socket Programming card, “View all projects on GitHub” link
- Contact: phone number removed; email, LinkedIn, GitHub only
- Fonts: DM Sans (body), Outfit (headings), JetBrains Mono (code)
- No download-resume option

---

## Next steps for you
1. **Formspree**: Create a form at [formspree.io](https://formspree.io), get your form ID, and in `index.html` replace `YOUR_FORM_ID` in the form `action` with that ID.
2. **Deploy**: Push this repo to the GitHub repo that Vercel uses (e.g. `bhaviss/bhavithrass.io`), then hard refresh (Ctrl+Shift+R) or use incognito when viewing the live site.
3. **Test locally**: Run `npx serve -l 3000` in the portfolio folder and open `http://localhost:3000` to confirm everything looks correct before deploying.
