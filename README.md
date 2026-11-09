# Inner Work

A private place for therapy work, journaling, vision and shadow work. Runs in the browser with no accounts and no build step.

## Open it

```bash
node serve.mjs
```

Then go to http://localhost:4173.

It is also published with GitHub Pages from the `main` branch, the same way Synthesis is: https://kandyphoenix.github.io/inner-work/. On a phone, open that address and choose "Add to Home Screen" to install it like an app.

## What's in it

- **Program**: 51 therapy sessions in 12 areas (`js/content-program.js`). Intake picks the areas; add or remove any on the Program tab.
- **Mood rescues**: 10 short guided sequences for the state you're in right now (`js/content-tools.js`).
- **Deeper**: 7 tools for problems that aren't shifting, plus EMDR-style processing (calm place, and the full target → sets → new belief → body scan → close sequence, with a left-right dot and sound).
- **Shadow, Journal, Vision**: Shadow Work with the 48-question archetype assessment, the Manifestation Journal, and the Vision Board with the moon phase. These were moved here from the Synthesis app. Their code is `js/life.js` (copied unchanged from Synthesis `premium-features.js`), their data `js/life-data.js`, their styles `life-base.css`. The moon phase is now worked out from today's date.
- **Guide**: a conversation with Claude. Needs your own Anthropic API key, pasted in Settings (`js/guide.js`).
- **Progress**: PHQ-9 and GAD-7 every two weeks, graduation criteria, then tapering maintenance check-ins.
- **Help now**: crisis numbers (US) and a safety plan, on every screen.

## Bringing entries over from Synthesis

In Synthesis: Profile → Export Backup. In Inner Work: Settings → Bring in your Synthesis entries → choose that file. Visions, journal days and shadow reflections that aren't already here are added; nothing is overwritten.

## Your data

Everything is stored in this browser (`localStorage`). Settings → Save a backup downloads it as a file.

Settings → Save across your devices is optional: sign in with Google and your writing is also kept in one private Firestore document (`users/{your id}/innerwork/state`) in the same Firebase project Synthesis uses, so phone and computer stay in step. Guide conversations and the API key are never uploaded. What you send to the guide goes to Anthropic.

Backup files contain everything you have written. `.gitignore` keeps them out of this repo; never commit one.

## The look

The backgrounds are three zen garden paintings in `assets/bg`. Settings → Background picks one, rotates them daily, switches to a forest drawn by `js/scene.js`, or uses a photo of your own. Colours and layout are in `styles.css`.

## Editing

Session and tool wording lives in the two `js/content-*.js` files. `vendor/anthropic.js` is the official Anthropic SDK (v1.7.0) bundled for the browser.

This is a self-help tool. It is not medical care and does not replace a doctor or therapist. The EMDR-style tool is for memories and upsets in the middle range; major trauma should be worked on with a trained EMDR therapist.
