import { embeddings as songEmbeddings } from "../data/songLibraryEmbeddingsData.js";

const cosineSimilarity = (a, b) => {
  const dotProduct = a.reduce((total, num, index) => {
    return total + num * b[index];
  }, 0);

  const magnitudeA = Math.sqrt(a.reduce((total, num) => total + num ** 2, 0));
  const magnitudeB = Math.sqrt(b.reduce((total, num) => total + num ** 2, 0));

  return dotProduct / (magnitudeA * magnitudeB);
};

async function getMostSuitableSong(queryEmbeddings) {
  const mostSuitableSong = songEmbeddings.reduce(
    (mostSuitableSoFar, song) => {
      const similarity = cosineSimilarity(queryEmbeddings, song.embedding);

      if (similarity > mostSuitableSoFar.similarity) {
        return {
          id: song.id,
          title: song.title,
          similarity,
        };
      }

      return mostSuitableSoFar;
    },
    { id: null, title: null, similarity: 0 }
  );

  return mostSuitableSong;
}

export { getMostSuitableSong };
