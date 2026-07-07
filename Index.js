require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('ERROR: BOT_TOKEN is not set. Add it as an environment variable.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// In-memory store of each chat's target language (resets on restart)
const userTargetLang = {};

// Common language codes users can pick from
const LANGUAGES = {
  en: 'English',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  pt: 'Portuguese',
  ru: 'Russian',
  ar: 'Arabic',
  zh: 'Chinese',
  ja: 'Japanese',
  ko: 'Korean',
  hi: 'Hindi',
  yo: 'Yoruba',
  ig: 'Igbo',
  ha: 'Hausa',
  tr: 'Turkish',
  nl: 'Dutch',
  pl: 'Polish'
};

function languageListText() {
  return Object.entries(LANGUAGES)
    .map(([code, name]) => `\`${code}\` - ${name}`)
    .join('\n');
}

// /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    `👋 *Welcome to Language Translator Bot!*\n\n` +
      `Send me any text and I'll translate it.\n` +
      `Default target language: *English*\n\n` +
      `Use /setlang <code> to change target language (e.g. /setlang fr)\n` +
      `Use /languages to see supported language codes\n` +
      `Use /help for all commands`,
    { parse_mode: 'Markdown' }
  );
});

// /help command
bot.onText(/\/help/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `*Commands:*\n` +
      `/start - Welcome message\n` +
      `/setlang <code> - Set target language (e.g. /setlang es)\n` +
      `/languages - List supported language codes\n` +
      `/help - Show this message\n\n` +
      `Just send any text message to translate it.`,
    { parse_mode: 'Markdown' }
  );
});

// /languages command
bot.onText(/\/languages/, (msg) => {
  bot.sendMessage(msg.chat.id, `*Supported language codes:*\n${languageListText()}`, {
    parse_mode: 'Markdown'
  });
});

// /setlang command
bot.onText(/\/setlang(?:\s+(.+))?/, (msg, match) => {
  const chatId = msg.chat.id;
  const code = match[1] ? match[1].trim().toLowerCase() : null;

  if (!code || !LANGUAGES[code]) {
    bot.sendMessage(
      chatId,
      `Please provide a valid language code, e.g. /setlang fr\n\nSee /languages for the full list.`
    );
    return;
  }

  userTargetLang[chatId] = code;
  bot.sendMessage(chatId, `✅ Target language set to *${LANGUAGES[code]}* (${code})`, {
    parse_mode: 'Markdown'
  });
});

// Handle regular text messages -> translate
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore non-text messages and commands (already handled above)
  if (!text || text.startsWith('/')) return;

  const targetLang = userTargetLang[chatId] || 'en';

  try {
    bot.sendChatAction(chatId, 'typing');

    // MyMemory Translation API - free, no API key required
    const response = await axios.get('https://api.mymemory.translated.net/get', {
      params: {
        q: text,
        langpair: `autodetect|${targetLang}`
      },
      timeout: 10000
    });

    const translated = response.data?.responseData?.translatedText;

    if (translated) {
      bot.sendMessage(chatId, translated);
    } else {
      bot.sendMessage(chatId, '⚠️ Sorry, I could not translate that. Please try again.');
    }
  } catch (err) {
    console.error('Translation error:', err.message);
    bot.sendMessage(chatId, '⚠️ Translation service is currently unavailable. Please try again shortly.');
  }
});

// Basic error handling so the bot doesn't crash on polling errors
bot.on('polling_error', (err) => {
  console.error('Polling error:', err.message);
});

console.log('🤖 Language Translator Bot is running...');
