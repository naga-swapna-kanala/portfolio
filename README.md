# Naga Swapna Kanala — portfolio

A four-page static site: a landing page plus three case studies. No framework, no build
step, no dependencies. Every file in this repo is served exactly as it sits here, which
means it cannot break from a package update and it will still work in five years.

```
index.html                          landing page
404.html                            not-found page
work/revenue-attribution.html       FAMSF  — attribution rebuild + first ELT pipeline
work/compliance-screening.html      Accenture — denied-party screening platform
work/quote-to-order.html            TCS — CPQ migration, forecasting, reconciliation
assets/styles.css                   the entire design system
assets/site.js                      theme toggle + scroll-spy nav (the only JS)
favicon.svg  robots.txt  sitemap.xml  vercel.json
```

Deployed on Vercel from the `main` branch. Any push to `main` redeploys automatically.

---

## Before going public: the red markers

Everything not yet confirmed is highlighted in red on the live site, with a floating
**"Review before publishing"** button at the bottom right of every page that lists the
items and jumps to each one. Hover any highlight for the note. Tick *Preview without
markers* in that panel to see the clean page.

What is marked, and why:

| Marker | What to decide |
|---|---|
| Job titles (every role, landing page + case study header) | Must match LinkedIn word for word. Your tailored resumes use several titles per role; the public site can only carry one. |
| TCS dates | Three versions exist across your files (Jun 2018, Jan 2019, Jun 2019 as the role split). The site uses the locked record. Confirm against LinkedIn. |
| "Enterprise software client" / "Telecom client" | Anonymized on purpose. Name them only if you are comfortable with a public page describing their systems. |
| Resume PDF button | Missing on purpose: the master PDF in the project has stale titles and dates. Supply a current one. |
| "70%?" tile on the Accenture page | This figure is on file as both 70% and 50%. Pick one or delete the tile. |
| "Written for you" pins on each *What I would do differently* section | The reflections were composed from the facts on file. Edit until they are what you actually think. |
| Headline pin | "I make revenue data tell the truth." is a choice. Keep it or replace it. |

Also read every page once in full. The narrative prose was written from your resume
bullets; the numbers are all confirmed, the connective sentences between them are not.

**To remove the markers** once every item is resolved:

```bash
node scripts/strip-review-markers.js
git commit -am "Remove review markers" && git push
```

The script strips the highlights and leaves the text. It does not fix content, so resolve
the "70%?" tile and the resume button first. The review CSS and JS stay in the files but
render nothing once no markers exist; they are harmless.

---

## Editing it

### Change a job title

Titles appear in exactly two places per role, and nowhere else:

| Role | Landing page | Case study page |
|---|---|---|
| FAMSF | `index.html` — work card + `#record` timeline | `work/revenue-attribution.html` — `.casehero__meta` |
| Accenture | `index.html` — work card + `#record` timeline | `work/compliance-screening.html` — `.casehero__meta` |
| TCS (both) | `index.html` — work card + `#record` timeline | `work/quote-to-order.html` — `.casehero__meta` |

Search the file for `casehead__meta` / `workcard__meta` / `tl__role` and you will find all of
them. **Keep these identical to LinkedIn** — a recruiter who opens both in adjacent tabs is
the whole reason to care.

### Add the resume download

Drop the current PDF at `assets/Naga_Swapna_Kanala.pdf`, then add this to the
`.hero__cta` block in `index.html`, after the Email button:

```html
<a class="btn" href="/assets/Naga_Swapna_Kanala.pdf" download>
  <svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"
       stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3v12M7 11l5 5 5-5M4 20h16"/>
  </svg>
  Resume
</a>
```

Ship only a version whose titles and dates match this site and LinkedIn.

### Change the colors

Every color in the site is a custom property at the top of `assets/styles.css`, declared
three times: once for light, once under `prefers-color-scheme: dark`, once under
`[data-theme="dark"]`. Change a value in all three and the whole site follows.

The two chart colors (`--series-1`, `--series-2`) are not arbitrary. They were validated for
colorblind separation and contrast against this site's background in both themes. If you
swap them, re-validate rather than eyeballing it.

### Update the URL

If the domain changes, update it in: each page's `<link rel="canonical">` and
`og:url`, plus `robots.txt` and `sitemap.xml`.

---

## Running it locally

```bash
npx serve .          # or: python3 -m http.server 8000
```

Open <http://localhost:3000>. Note that `vercel.json`'s `cleanUrls` is a Vercel behavior, so
locally you may need the `.html` suffix on case-study URLs.

---

## Notes on the content

- The Accenture and TCS case studies deliberately omit the client, the vendor, and internal
  system names. That work was done under contract. Do not add them back.
- Every figure on the site comes from the confirmed career record. Nothing is estimated,
  rounded up, or reconstructed.
- Each case study ends with a "what I would do differently" section. That is not filler —
  it is the part that makes the rest credible, and it is what interviewers follow up on.
  Be ready to talk about those.
