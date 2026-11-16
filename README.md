# Elena's Year: a playable version of the demo story

A proposal to react to, built on your Elena sample and your existing `/api/demo/assist` endpoint. Nothing on your site was changed.

## Try it in two minutes
1. Unzip, then double-click `index.html`. No server needed.
2. Click **Jump in** on the landing page, then **Become Elena**, and play through (about three minutes).
3. Open `workspace.html` for the "Ask Bookae about Elena" page (the end of the story links to it).

Opened from a folder like this, the workspace shows real answers that were recorded from your live demo, and says so. It goes live the moment it is hosted on your site (your endpoint only answers requests from its own origin).

## What is in the folder
- `index.html`: the story. One file, no build step, no dependencies.
- `landing.html`, `popup-journal.js`, `marks/`: the current bookae.ai landing page, which the story opens on. The only change is that its four "Jump in" links start the demo.
- `workspace.html`: one screen in place of the five tabs. Pick who is asking (Elena, a cold reader, Priya), ask, and see the answer next to what that seat is allowed to read. Your five modes map one to one: Elena → `connections`, `coach`, `colleges`; cold reader → `review`; Priya → `counselor`. Request and response shapes are unchanged.

## The story, step by step
1. **Voice journal**: the app's floating voice bar and the "22 words · took out 2 ums · Cleaned / As said" receipt. The viewer reads Elena's line out loud; with no microphone it plays as a labelled simulation. On Save the day prints as a picture, top to bottom, and the page takes that picture's colour.
2. **Connect the dots**: four marked days, then "Keep this thread" or "Not sure yet".
3. **School fit**: four phrases from her journal open four colleges, each with her question. No chances, no rankings. She puts **UT Austin** on her list (for the Austin audience), and the card then shows the three things UT Austin asks for: an essay on any topic, and its two short answers quoted word for word. Those match UT's own admissions page (read 2026-11-16) and Bookae's catalog.
4. **Essay room**: the story line says "Bookae never writes for you. It asks." before anything else happens, and the page carries the same line in its footer. Bookae then asks three questions about one day. She answers each out loud in the voice bar, and her three answers are the first paragraph, word for word. "Write it for me" gets "Bookae NEVER writes for you. It asks."
5. **Ending**: the same eleven days laid out for UT Austin's three asks (her opening paragraph; her own lines set beside "Why this major?"; her own sentence and counts for "Most proud of?"). It waits for "Finish the story", then the summary card, which leads with "Bookae never writes for you."

## To put it on the demo site
1. Copy the folder into `public/demo-story/`.
2. Serve it at `/demo`: a rewrite to `/demo-story/index.html`, or
   `<iframe src="/demo-story/index.html" title="Bookae demo" allow="microphone" style="width:100%;height:100dvh;border:0"></iframe>`
   (`allow="microphone"` matters, or the voice step can only run as a simulation.)
3. At the top of the script in `index.html`, `LINKS.films` points at `/demo/watch` on the current deployment. Make it relative if you like.
4. `workspace.html` calls `/api/demo/assist` as is. Nothing to change on the server.

## Things to know
- **The look** is new: a deep wall that takes the colour of the day on screen, white Hanken Grotesk, one white button, and Elena's story as a large line beside the scene (under it on a phone). It follows the Home design being prepared for the app. The guide bar that talks to the viewer stays on top.
- **The day pictures** in the story are drawn in code: a ribbed sheet in the day's colour with the captions in the corners. They stand in for the pictures the app generates; they are not generated ones.
- **The workspace page** still has its earlier white look.
- **UT Austin** is the college the second half of the story is built on, but it is in the story only. The workspace and your AI still know three colleges. To add it there, add it to your server-side sample and tell us; the page's data and recorded answers get regenerated from your bundle.
- Every line on the three ending cards is from your Elena sample (Jun 1, Jul 27, Aug 24, Oct 19 entries), quoted, not rewritten.
- **The logo** in the header is the official lockup from the bookae.ai nav (`<svg class="logo">` inside `index.html`). It would be good to use the same one across the demo site.
- **The brand film** on `/demo/watch` is the earlier cut. The current one has the redrawn bouquets.
- Fonts come from Google Fonts (Hanken Grotesk; Fraunces only for the small landing fallback); the landing page also loads three.js from jsDelivr.

## Not tested yet
- Anything hosted on the demo site itself (the landing opening inside your page, the microphone inside a frame, the workspace answering live there).
- A real voice, Safari, and a real phone. It was played start to finish in headless Chromium at phone, tablet, laptop and full-HD sizes.
- Timing with a real person. The copy says "three minutes"; nobody has timed a full run.
