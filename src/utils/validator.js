import xssFilters from "xss-filters";

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

export { validateQuery };
