/**
 * This file is used to generate the embeddings for local songs.
 * It only needs to be run manually when the songs.json file changes.
 * The results should be saved in a JSON file.
 */

import songLibraryData from "./src/data/songLibraryData.json" assert { type: "json" };
import { getEmbeddings } from "./src/services/embeddingService.js";
import fs from "fs";

const songs = songLibraryData.songs;

async function createEmbeddings(songs) {
  const embeddings = await Promise.all(
    songs.map(async (song) => {
      const songInformation =
        song.genres.join(" ") + " " + song.inspirations.join(" ");

      const embedding = await getEmbeddings(songInformation);

      return {
        id: song.id,
        title: song.title,
        embedding: embedding,
      };
    })
  );

  return embeddings;
}

async function main() {
  const embeddings = await createEmbeddings(songs);

  console.log(embeddings);

  fs.writeFileSync("./src/data/newEmbeddings.json", JSON.stringify(embeddings));
}

main();
