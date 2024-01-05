import dotenv from "dotenv";
import OpenAI from "openai";
import songs from "../../public/embeddings/embeddings.json" assert { type: "json" };

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("No API key provided");
}

const openai = new OpenAI({ apiKey });

async function getEmbeddings(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    return response.data[0].embedding;
  } catch (error) {
    console.error("Error in getting embeddings: ", error);
    return null;
  }
}

const songEmbeddings = songs.map((song) => {
  return {
    id: song.id,
    title: song.title,
    embedding: song.embedding,
  };
});

export { getEmbeddings, songEmbeddings };
