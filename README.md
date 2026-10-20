# ImageViewer — Course 7

ImageViewer is a responsive React photo-journal demo with a sign-in screen, caption search, a home feed, profile editing, likes, comments, and local photo uploads.

## Run locally

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Select **Explore with demo account** on the sign-in page to get started. `npm run build` creates the production bundle in `dist/`.

## Using the app

- Search for words or hashtags in post captions.
- Like a post from the feed or its detail view.
- Open a post to read and add comments.
- Select **New post** to choose an image and write a caption with optional hashtags.
- Select your avatar to view the profile; **Edit profile** changes the displayed full name.
- Use **Log out** in the right-hand panel to return to sign in.

## Demo data and Instagram API

The app uses sample profile and post data so it runs without credentials or a backend. Sign-in is intentionally a local demo flow; the optional token field is not sent anywhere or validated. Posts, likes, comments, and profile edits are held in app memory and reset on refresh. They do not change Instagram.

The Instagram Basic Display API that many older ImageViewer tutorials used was discontinued on December 4, 2024. Connecting real Instagram accounts now requires an eligible Meta app, supported Instagram API products, OAuth configuration, and a backend to keep credentials safe; a token pasted into a frontend should not be treated as authentication.

## Tech stack

- React 19
- TypeScript
- Vite

Photos in the seeded demo use remote Unsplash image URLs and therefore require an internet connection to display.
