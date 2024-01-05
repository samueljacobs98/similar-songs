import { songEmbeddings } from "../services/embeddingService";

async function getMostSuitableSong(embeddings) {
  try {
    const songEmbeddingsWithDistance = songEmbeddings.map((song) => {
      const distance = embeddings.reduce((total, embedding, index) => {
        return total + Math.abs(embedding - song.embedding[index]);
      }, 0);

      return {
        id: song.id,
        title: song.title,
        distance,
      };
    });

    const sortedSongs = songEmbeddingsWithDistance.sort(
      (a, b) => a.distance - b.distance
    );

    const mostSuitableSong = sortedSongs[0];

    return mostSuitableSong;
  } catch (error) {
    console.error("Error in getting most suitable song: ", error);
    return null;
  }
}

export { getMostSuitableSong };
