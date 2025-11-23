const { askOpenAI } = require('../../../lib/openai');

function normalizeName(name) {
  return String(name || '').trim() || 'User';
}

async function kundliMake({ name, birthDate, birthTime, birthPlace }) {
  if (!birthDate || !birthTime || !birthPlace) throw new Error('birthDate, birthTime, birthPlace are required');
  const prompt = `Create a concise Vedic Kundli overview. Fields: Basic Sun/Moon/Ascendant (approx), personality summary, strengths, areas to improve. Input: name=${normalizeName(name)}, birthDate=${birthDate}, birthTime=${birthTime}, birthPlace=${birthPlace}. Keep it factual and short bullets.`;
  const system = 'You are an expert Vedic astrologer. Provide clear, safe, non-deterministic guidance with disclaimers about approximation.';
  const text = await askOpenAI(prompt, { system });
  return { report: text };
}

async function kundliMatch({ personA, personB }) {
  if (!personA || !personB) throw new Error('personA and personB are required');
  const prompt = `Perform a high-level Kundli compatibility summary (gun milan style approximation). Provide: overall score (approx 0-36), pros, cons, guidance. PersonA=${JSON.stringify(personA)}, PersonB=${JSON.stringify(personB)}. Keep it brief.`;
  const system = 'You are an expert Vedic astrologer. Make it approximate and include a disclaimer that it is not a substitute for a full professional reading.';
  const text = await askOpenAI(prompt, { system });
  return { report: text };
}

async function numerologyPredict({ name, birthDate }) {
  if (!name || !birthDate) throw new Error('name and birthDate are required');
  const prompt = `Provide basic numerology insights: Life Path, Destiny, Soul Urge (approx). Input: name=${normalizeName(name)}, birthDate=${birthDate}. Give 3-5 brief bullets for each.`;
  const system = 'You are a numerologist assistant. Keep responses short and structured.';
  const text = await askOpenAI(prompt, { system });
  return { report: text };
}

async function tarotDaily({ question, name }) {
  const safeQuestion = String(question || 'General guidance for today');
  const prompt = `Simulate a single tarot card daily draw with supportive guidance. User=${normalizeName(name)}. Question=${safeQuestion}. Provide: card name (random plausible), upright/reversed (random), 3 concise insights, and an actionable tip. Keep it uplifting and non-absolute.`;
  const system = 'You are a compassionate tarot reader. Offer supportive, non-deterministic guidance.';
  const text = await askOpenAI(prompt, { system });
  return { report: text };
}

module.exports = {
  kundliMake,
  kundliMatch,
  numerologyPredict,
  tarotDaily,
};
