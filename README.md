# Elena's days: a playable version of the demo story

A proposal to react to, built on your Elena sample and your existing `/api/demo/assist` endpoint. Nothing on your site was changed.

## Try it in a minute
1. Unzip, then double-click `index.html`. No server needed for the story itself.
2. Click **Jump in** on the landing page, open one of the three days, and follow it to her card. One path takes about a minute. Then open another day: there are fifteen endings.
3. Open `workspace.html` for the "Ask Bookae about Elena" page (the end of the story links to it).

Opened from a folder like this, the workspace shows real answers that were recorded from your live demo, and says so. It goes live the moment it is hosted on your site (your endpoint only answers requests from its own origin).

## What is in the folder
- `index.html`: the story. One file, no build step, no dependencies.
- `days/`: Elena's twelve days as pictures (720 x 1080 JPEG, about 160 KB each).
- `landing.html`, `popup-journal.js`, `marks/`: the current bookae.ai landing page, which the story opens on. The only change is that its four "Jump in" links start the demo.
- `workspace.html`: one screen in place of the five tabs. Pick who is asking (Elena, a cold reader, Priya), ask, and see the answer next to what that seat is allowed to read. Your five modes map one to one: Elena → `connections`, `coach`, `colleges`; cold reader → `review`; Priya → `counselor`. Request and response shapes are unchanged.

## The story, step by step
There is no welcome page and nothing to read out loud. The viewer makes Elena's calls.
1. **Pick** (her days): three of her twelve days, as pictures. The viewer opens one.
2. **Open** (voice journal): part of what she said that day, on white paper beside its picture.
3. **Recall** (connect the dots): Bookae brings a second day back, joins the two pictures, shows one line from each with the echoing words highlighted, and names "a possible thread". The viewer answers for her: "That fits" or "Not really". A no sends that day away and brings a different day with a different thread. A second no and Bookae drops it: "No thread. Just a day."
4. **Ask** (essay room): Bookae asks. With a thread there are two questions and the viewer picks one; without, one question about the day itself.
5. **Card**: the line she had already said, on a card with its source ("Her Jul 13 entry, word for word"; two endings quote a thought she kept or her own draft instead, and say so). The story line says "Bookae never writes for you. It asks." here, once.
6. **End**: "Open another day" (no counter, so the other endings feel like more to see, not a list to finish). Two optional side doors: "Try a day of your own" (talk or type) and "What UT Austin asks".

The names in the top row (Voice journal, Connect the dots, Essay room) light up as each feature comes into play. "Start over" in the corner goes back to the three days at any point.

## To put it on the demo site
1. Copy the folder into `public/demo-story/`.
2. Serve it at `/demo`: a rewrite to `/demo-story/index.html`, or
   `<iframe src="/demo-story/index.html" title="Bookae demo" allow="microphone" style="width:100%;height:100dvh;border:0"></iframe>`
   (`allow="microphone"` matters only for the optional own-day step; without it that step falls back to typing.)
3. At the top of the script in `index.html`, `LINKS.films` points at `/demo/watch` on the current deployment. Make it relative if you like.
4. `workspace.html` calls `/api/demo/assist` as is. Nothing to change on the server.

## Things to know
- **Every line shown as Elena's is quoted from your sample**, word for word (her entries, her kept note and her draft). The build checks each one against the sample and refuses to build if one differs. The questions, the thread names and the narration are Bookae's and ours.
- **The pictures** were made from her twelve entries with the recipe Bookae uses for journal pictures (the entry goes in, a ribbed relief of its subject comes out). One of them, the poster day, was redrawn with a note about what to show.
- **No microphone on the main path.** The optional "Try a day of your own" uses the browser's own speech recognition (Chrome, Edge, Safari). What it hears lands in a field the viewer can fix or say again (the note under it says how many words it heard and how many "um"s it took out), then prints as a sheet with their words in large type. Where the browser has no speech recognition, they type. Nothing is simulated, and the page keeps and sends nothing.
- **UT Austin** (for the Austin audience) is an optional panel after the card: the three things UT Austin asks first-year applicants for, with her line placed under the one it could start (a line that belongs on her college list, not in an application, says so instead). The asks match UT's own admissions page (read 2026-11-16) and Bookae's catalog. The workspace and your AI still know three colleges.
- **The look**: a deep wall that takes the colour of the day on screen, white Hanken Grotesk, one white button, the story as a large line beside the scene (under it on a phone), the guide bar on top. The workspace page has the same look.
- **The logo** in the header is the official lockup from the bookae.ai nav (`<svg class="logo">` inside `index.html`). It would be good to use the same one across the demo site.
- **The brand film** on `/demo/watch` is the earlier cut. The current one has the redrawn bouquets.
- Fonts come from Google Fonts (Hanken Grotesk; Fraunces only for the small landing fallback); the landing page also loads three.js from jsDelivr.

## Not tested yet
- Anything hosted on the demo site itself (the landing opening inside your page, the microphone inside a frame, the workspace answering live there).
- A real voice, Safari, and a real phone. All fifteen endings were played in headless Chromium, and one or more paths at twelve window sizes from 360 x 640 to 1920 x 1080.
- Timing with a real person. A scripted reader who reads every word reaches the end of one path about a minute after "Jump in".
