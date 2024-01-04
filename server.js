import express from "express";
import dotenv from "dotenv";
import xssFilters from "xss-filters";
import stopwords from "stopword";
import OpenAI from "openai";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("No API key provided");
}

const openai = new OpenAI({ apiKey });

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

function validateQuery(query) {
  if (query.length >= 140) {
    throw new Error("Query too long");
  }

  if (typeof query !== "string") {
    throw new Error("Query must be a string");
  }

  const sanitisedQuery = xssFilters.inHTMLData(query);

  return sanitisedQuery;
}

function processQuery(query) {
  const withoutPunctuation = query
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = withoutPunctuation.split(" ");
  const withoutStopwords = stopwords.removeStopwords(words);
  const withoutDuplicates = [...new Set(withoutStopwords)];
  const processedQuery = withoutDuplicates.join(" ");

  return processedQuery;
}

async function getEmbeddings(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    console.log(response.data[0].embedding);
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error in getting embeddings: ", error);
    return null;
  }
}

app.post("/search", async (req, res) => {
  const userQuery = req.body.search.toLowerCase();

  const validatedQuery = validateQuery(userQuery);
  const processedData = processQuery(validatedQuery);

  const embeddings = await getEmbeddings(processedData);

  res.send(`
    <p class="px-4 py-2 bg-gray-800 text-white">${embeddings}</p>
  `);
});

app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});
