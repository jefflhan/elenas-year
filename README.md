# Elena's Year: a playable version of the demo story

A proposal to react to, built on your Elena sample and your existing `/api/demo/assist` endpoint. Nothing on your site was changed.

## Try it in two minutes
1. Unzip, then double-click `index.html`. No server needed.
2. Click **Jump in** on the landing page, then **Become Elena**, and play through.
3. Open `workspace.html` for the "Ask Bookae about Elena" page (the end of the story links to it).

Opened from a folder like this, the workspace shows real answers that were recorded from your live demo, and says so. It goes live the moment it is hosted on your site (your endpoint only answers requests from its own origin).

## What is in the folder
- `index.html`: the story. One file, no build step, no dependencies.
- `landing.html`, `popup-journal.js`, `marks/`: the current bookae.ai landing page, which the story opens on. The only change is that its four "Jump in" links start the demo.
- `workspace.html`: one screen in place of the five tabs. Pick who is asking (Elena, a cold reader, Priya), ask, and see the answer next to what that seat is allowed to read. Your five modes map one to one: Elena → `connections`, `coach`, `colleges`; cold reader → `review`; Priya → `counselor`. Request and response shapes are unchanged.

## The story, step by step
1. **Voice journal**: the app's floating voice bar and the "22 words · took out 2 ums · Cleaned / As said" receipt. The viewer reads Elena's line out loud; with no microphone it plays as a labelled simulation.
2. **Connect the dots**: four marked days, then "Keep this thread" or "Not sure yet".
3. **School fit**: four phrases from her journal open four colleges, each with her question. No chances, no rankings.
4. **Essay room**: her own journal words land on the page word for word. Bookae asks one question and never writes for her.

## To put it on the demo site
1. Copy the folder into `public/demo-story/`.
2. Serve it at `/demo`: a rewrite to `/demo-story/index.html`, or
   `<iframe src="/demo-story/index.html" title="Bookae demo" allow="microphone" style="width:100%;height:100dvh;border:0"></iframe>`
   (`allow="microphone"` matters, or the voice step can only run as a simulation.)
3. At the top of the script in `index.html`, `LINKS.films` points at `/demo/watch` on the current deployment. Make it relative if you like.
4. `workspace.html` calls `/api/demo/assist` as is. Nothing to change on the server.

## Things to know
- **UT Austin** is the fourth college in the story only. The workspace and your AI still know three. To add it there, add it to your server-side sample and tell us; the page's data and recorded answers get regenerated from your bundle.
- **The logo** in the header is the official lockup from the bookae.ai nav (`<svg class="logo">` inside `index.html`). It would be good to use the same one across the demo site.
- **The brand film** on `/demo/watch` is the earlier cut. The current one has the redrawn bouquets.
- Fonts come from Google Fonts (Fraunces, Geist); the landing page also loads three.js from jsDelivr.

## Not tested yet
- Anything hosted on the demo site itself (the landing opening inside your page, the microphone inside a frame, the workspace answering live there).
- A real voice, Safari, and a real phone. It was played start to finish in headless Chromium at laptop and phone sizes.
- Timing with a real person. The copy says "90 seconds"; it may run longer.
