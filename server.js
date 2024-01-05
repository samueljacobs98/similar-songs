import express from "express";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getEmbeddings } from "./src/services/embeddingService.js";
import { validateQuery } from "./src/utils/validator.js";
import { parseQuery } from "./src/utils/parser.js";
import { getMostSuitableSong } from "./src/utils/suitabilityChecker.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

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

  if (!mostSuitableSong.id) {
    res.send(noSuitableSongFoundResponse);
    return;
  }

  console.log("Similarity:", mostSuitableSong.similarity);

  if (mostSuitableSong.similarity < 0.5) {
    res.send(noSuitableSongFoundResponse);
    return;
  }

  const { id, title } = mostSuitableSong;

  res.send(`
    <div class="flex flex-col items-center px-4 py-2 bg-gray-800 text-white">
      <audio id="audio-player" src="/stream/${id}/${title}" controls></audio>
      </div>
  `);
});

app.get("/stream/:id/:title", (req, res) => {
  const { id, title } = req.params;

  if (!id || !title) {
    res.status(400).send("Bad request");
    return;
  }

  const filePath = path.join(__dirname, `./public/songs/${id}-${title}.mp3`);
  const stat = fs.statSync(filePath);

  res.writeHead(200, {
    "Content-Type": "audio/mpeg",
    "Content-Length": stat.size,
  });

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});
