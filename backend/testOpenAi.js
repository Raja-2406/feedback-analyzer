require("dotenv").config();
const OpenAI = require("openai");

const testOpenAI = async () => {
    try {
        console.log("OpenAI API Key exists?", !!process.env.OPENAI_API_KEY);

        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const comment = "NO books are present in the library .we may use the library as a prayer hall somewhat that will be helpfull";

        const prompt = `You are an expert customer sentiment analyzer. Analyze the underlying sentiment of the following customer feedback. 
Pay close attention to sarcasm, passive-aggressiveness, or complaints disguised as suggestions. 
Reply with exactly ONE word: "positive", "negative", or "neutral".
Comment: "${comment}"`;

        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o-mini",
            temperature: 0,
            max_tokens: 5
        });

        const responseText = chatCompletion.choices[0].message.content.trim().toLowerCase();
        console.log("RAW AI RESPONSE:", responseText);

    } catch (err) {
        console.error("Test failed:", err.message);
    }
};

testOpenAI();
