import stopwords from "stopword";

function parseQuery(query) {
  const withoutPunctuation = query
    .replace(/[^a-zA-Z0-9]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = withoutPunctuation.split(" ");
  const withoutStopwords = stopwords.removeStopwords(words);
  const withoutDuplicates = [...new Set(withoutStopwords)];
  const parsedQuery = withoutDuplicates.join(" ");

  return parsedQuery;
}

export { parseQuery };
