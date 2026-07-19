# Riya & Kunal — Wedding Invite Website

A mobile-first wedding invite built with **Next.js (App Router) + Tailwind CSS**, featuring a
tap-to-open seal animation, scroll-snap slides for every section, a live countdown, an RSVP
form that saves to Google Sheets, and background music. Placeholder content is already wired
up so it runs immediately — swap in your own names, dates, photos, and venues.

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000 — resize your browser to a phone width (or open dev tools' device
toolbar) to see it as guests will.

## 2. Add your own content

**Names & dates**
- `components/HeroSlide.jsx` — groom/bride names, hero date line
- `components/OurStorySlide.jsx` — the `milestones` array: your how-we-met story
- `components/EventCards.jsx` — the `events` array: one object per ceremony (Gondhal, Mehendi,
  Haldi, Wedding). Edit `date`, `time`, `venue`, `dressCode`, `desc`, and `mapsUrl` (get this
  by opening the venue in Google Maps → Share → Copy link).
- `components/WeddingPartySlide.jsx` — the `party` array: bridesmaids/groomsmen names & roles
- `components/StaySlide.jsx` — the `hotels` array: recommended hotels near your venue
- `components/RegistrySlide.jsx` — the `registry` array: registry/honeymoon fund links
- `components/CountdownSlide.jsx` — the `TARGET` date at the top of the file. Keep the
  `+05:30` suffix for Indian Standard Time (change it if your wedding is elsewhere).
- `components/EnvelopeIntro.jsx` and `components/FinalSlide.jsx` — the "R&K" monogram and
  closing names/pills.

**Photos** — drop these into `public/` (same filenames, any real photo will do):
| File | Used for |
|---|---|
| `couple.webp` | Hero slide background + closing slide watermark |
| `gondhal-bg.jpg` | Gondhal ceremony slide |
| `mehendi-bg.jpg` | Mehendi ceremony slide |
| `haldi-bg.jpg` | Haldi ceremony slide |
| `wedding-bg.jpg` | Wedding ceremony slide |

Placeholder images are already in `public/` so the site looks correct out of the box — just
overwrite them with your real photos (same filenames). Vertical photos (portrait, ~3:4) work
best since every slide is full-screen on a phone. Want real photos for Wedding Party too?
Add a `photo: "/party/name.jpg"` field to any person in `WeddingPartySlide.jsx`.

**Music** — add two mp3s to `public/`:
- `song-seal.mp3` — plays on the tap-to-open envelope screen
- `song-inner.mp3` — plays once the invite is open

Missing music files won't break the site — they just won't play until you add them. Keep
files short (a 30–60s loop is plenty) so the site stays fast to load.

## 3. RSVP → Google Sheet (free, no backend needed)

The RSVP form posts to a small Google Apps Script "web app" that appends each response as a
row in a Google Sheet. It costs nothing and needs no server.

1. Create a new Google Sheet. Rename the first tab to exactly `RSVP`.
2. In the Sheet menu: **Extensions → Apps Script**.
3. Delete the starter code, then paste in the contents of `apps-script/rsvp-to-sheet.gs`
   (included in this project) and save.
4. **Deploy → New deployment** → select type **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click Deploy, authorize it, and copy the URL it gives you (ends in `/exec`).
6. In your project folder, copy `.env.local.example` to `.env.local` and paste that URL in as
   `NEXT_PUBLIC_RSVP_ENDPOINT`.
7. Restart `npm run dev` (env vars are only read at startup). Submit a test RSVP and check the
   Sheet — a new row should appear within a couple seconds.

When deploying to Vercel (next section), add the same `NEXT_PUBLIC_RSVP_ENDPOINT` variable
under **Project Settings → Environment Variables** so it works on the live site too.

If you skip this step, the RSVP form still shows the "Thank You" screen to guests — it just
won't save anywhere, so responses would be lost. Check your browser console for a warning
reminding you it isn't configured yet.

## 4. How the pieces fit together

- `app/page.js` — orchestrates the envelope → invite transition and the two-song music
  handoff, and renders every slide inside one scroll-snap container, in this order:
  Hero → Our Story → Countdown → Ceremonies → Wedding Party → Where to Stay → Registry →
  RSVP → Final.
- `app/globals.css` — locks page scrolling to the single snap container, sets the phone-width
  shell, and holds shared design utilities (`.eyebrow`, `.gold-rule`, `.corner-frame`, etc).
- Each section is a self-contained component in `components/`, listed above.
- A guest who already opened the invite this session (`sessionStorage`) skips straight past
  the envelope on reload.

## 5. Deploy your free live link

The easiest free option is **Vercel** (made by the creators of Next.js):

1. Push this folder to a new GitHub repo.
2. Go to https://vercel.com → **Add New Project** → import that repo.
3. Add the `NEXT_PUBLIC_RSVP_ENDPOINT` environment variable (see section 3) if you're using
   the RSVP form.
4. Leave everything else as default (Vercel auto-detects Next.js) → **Deploy**.
5. You'll get a free link like `your-wedding.vercel.app` — share that with guests.
   (Optional: add a custom domain later from the Vercel project settings.)

No GitHub account? Vercel's CLI also works straight from this folder:

```bash
npm install -g vercel
vercel
```

Follow the prompts and it will give you a live URL in under a minute.

## 6. Before you share the link

- [ ] Real photos in `public/` (couple + all four ceremony backgrounds)
- [ ] Real music files (or remove the two `<Audio>` calls in `app/page.js` if you'd rather
      have a silent invite)
- [ ] Correct dates, times, venues, and Google Maps links in `EventCards.jsx`
- [ ] Correct countdown target date in `CountdownSlide.jsx`
- [ ] Real names in `WeddingPartySlide.jsx`, real hotels in `StaySlide.jsx`, real links in
      `RegistrySlide.jsx`
- [ ] RSVP endpoint configured and tested (section 3) if you want responses saved
- [ ] Test on an actual phone — tap the seal, scroll through every slide, submit a test RSVP,
      check the mute button
