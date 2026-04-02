const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Helper to add a delay between requests to avoid rapid 429s in tests
const delay = ms => new Promise(res => setTimeout(res, ms));

async function runTest() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const modelsToTry = [
        "gemini-2.0-flash-exp",
        "gemini-2.0-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash"
    ];

    for (const modelName of modelsToTry) {
        try {
            console.log(`\nTesting: ${modelName}...`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const prompt = "Analyze the sentiment of this feedback: 'NO books are present in the library. we may use the library as a prayer hall.' Reply with one word: positive, negative, or neutral.";

            const result = await model.generateContent(prompt);
            const response = await result.response;
            console.log(`✅ Success! Sentiment Analysis Result (${modelName}):`, response.text().trim());
            return; // Stop if one works!

        } catch (error) {
            console.error(`❌ Failed (${modelName}):`, error.status || error.message);
            await delay(1000); // 1-second cooldown between tests to avoid 429 cascades
        }
    }
}

runTest();
