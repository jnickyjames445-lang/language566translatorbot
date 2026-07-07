# Language Translator Bot (@language566translatorbot)

A Telegram bot that translates any text you send it, using the free MyMemory Translation API (no API key required).

## Features
- Translate any message you send
- `/setlang <code>` to change target language (e.g. `/setlang fr`)
- `/languages` to see supported language codes
- `/help` for command list

## 1. Create the bot with BotFather
1. Open Telegram, search **@BotFather**
2. Send `/newbot`
3. Choose a display name, then set username: `language566translatorbot`
4. Copy the **API token** BotFather gives you — you'll need it below

## 2. Run locally (optional, for testing)
```bash
npm install
cp .env.example .env
# edit .env and paste your BOT_TOKEN
npm start
```

## 3. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: language translator bot"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/language-translator-bot.git
git push -u origin main
```
Do **not** commit your `.env` file — it's already excluded via `.gitignore`.

## 4. Deploy on Railway
1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your `language-translator-bot` repository
3. Go to the **Variables** tab and add:
   - `BOT_TOKEN` = the token from BotFather
4. Railway will detect Node.js automatically and run `npm start`
5. Check the **Deployments → Logs** tab — you should see:
   ```
   🤖 Language Translator Bot is running...
   ```

## 5. Test it
Open Telegram, search `@language566translatorbot`, send `/start`, then send any text to see it translated.

## Notes
- MyMemory's free tier has a daily character limit per IP. For heavier use, consider a paid translation API (Google Cloud Translate, DeepL API) — just swap the `axios.get` call in `index.js`.
- The bot uses **polling** (not webhooks), which works well on Railway since it just needs the process running continuously.
