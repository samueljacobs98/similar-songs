import express from "express";
import dotenv from "dotenv";
import { getEmbeddings } from "./src/services/embeddingService.js";
import { validateQuery } from "./src/utils/validator.js";
import { parseQuery } from "./src/utils/parser.js";
import { getMostSuitableSong } from "./src/utils/suitabilityChecker.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

const MAXIMUM_SUITABILITY_DISTANCE = 20;

const noSuitableSongFoundResponse = `<p class="px-4 py-2 bg-gray-800 text-white">No song found</p>`;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (_, res) => {
  res.sendFile("index.html");
});

app.post("/search", async (req, res) => {
  const userQuery = req.body.search.toLowerCase();

  const validatedQuery = validateQuery(userQuery);
  const parsedQuery = parseQuery(validatedQuery);

  const queryEmbeddings = await getEmbeddings(parsedQuery);

  const mostSuitableSong = await getMostSuitableSong(queryEmbeddings);

  if (!mostSuitableSong) {
    res.send(noSuitableSongFoundResponse);
    return;
  }

  if (mostSuitableSong.distance > MAXIMUM_SUITABILITY_DISTANCE) {
    res.send(noSuitableSongFoundResponse);
    return;
  }

  res.send(`
      <div class="px-4 py-2 bg-gray-800 text-white">
        <p>Most suitable song is "${mostSuitableSong.title}" (ID: ${mostSuitableSong.id})</p>
      </div>
    `);
});

app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});
