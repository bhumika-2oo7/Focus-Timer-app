# Focus — a quiet timer

A minimal focus/pomodoro timer that logs your sessions right in the browser (no backend, no build step — just HTML, CSS, and JS).

## Run it locally
Just open `index.html` in your browser. That's it.

## Deploy it on GitHub Pages (free, live link anyone can open)

1. **Create a repo.** Go to github.com → New repository → name it e.g. `focus-timer` → Create.
2. **Upload these three files** (`index.html`, `style.css`, `script.js`) to the repo — either drag-and-drop them on the GitHub website ("Add file" → "Upload files"), or push them with git:
   ```
   git init
   git add .
   git commit -m "First commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/focus-timer.git
   git push -u origin main
   ```
3. **Turn on Pages.** In your repo, go to Settings → Pages. Under "Build and deployment," set Source to **Deploy from a branch**, Branch to **main** and folder to **/(root)**. Save.
4. **Wait ~1 minute**, then refresh that Settings → Pages screen. GitHub will show your live link, something like:
   ```
   https://YOUR-USERNAME.github.io/focus-timer/
   ```
5. Share that link — anyone who opens it sees the working timer.

## Notes
- Session history is stored per-browser using `localStorage`, so it won't sync between devices.
- To change the default session lengths, edit the three `data-mins` buttons in `index.html`.
