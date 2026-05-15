const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
  try {
    const models = await genAI.getModels();
    console.log("AVAILABLE MODELS:");
    for (const model of models) {
      console.log(model.name);
    }
  } catch (e) {
    // some versions might not support getModels(), fall back to REST
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
      const data = await res.json();
      console.log("REST AVAILABLE MODELS:");
      if (data.models) {
        data.models.forEach(m => console.log(m.name));
      } else {
        console.log(data);
      }
    } catch(err) {
      console.error(err);
    }
  }
}
run();
