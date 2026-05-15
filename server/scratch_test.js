const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3-flash-preview' });
    const prompt = `Test prompt, please reply with "Hello".`;
    const result = await model.generateContent(prompt);
    console.log("SUCCESS:");
    console.log(result.response.text());
  } catch (err) {
    console.error("ERROR:");
    console.error(err);
  }
}
run();
