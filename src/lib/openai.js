const https = require('https');

const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

function ensureApiKey() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    const err = new Error('OPENAI_API_KEY is not set');
    err.status = 500;
    throw err;
  }
  return key;
}

function postJson(url, headers, json) {
  return new Promise((resolve, reject) => {
    try {
      const u = new URL(url);
      const options = {
        method: 'POST',
        hostname: u.hostname,
        path: u.pathname + (u.search || ''),
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(json),
          ...headers,
        },
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            const err = new Error(`OpenAI API error: ${res.statusCode} ${data}`);
            err.status = 502;
            return reject(err);
          }
          try {
            const parsed = JSON.parse(data);
            resolve(parsed);
          } catch (e) {
            reject(e);
          }
        });
      });

      req.on('error', reject);
      req.write(json);
      req.end();
    } catch (e) {
      reject(e);
    }
  });
}

async function askOpenAI(prompt, { system, model } = {}) {
  const apiKey = ensureApiKey();
  const usedModel = model || DEFAULT_MODEL;

  const body = {
    model: usedModel,
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      { role: 'user', content: prompt },
    ],
    temperature: 0.7,
  };

  const data = await postJson(
    'https://api.openai.com/v1/chat/completions',
    { Authorization: `Bearer ${apiKey}` },
    JSON.stringify(body)
  );

  const content = data?.choices?.[0]?.message?.content?.trim();
  return content || '';
}

module.exports = { askOpenAI };
