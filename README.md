# Similar Songs

If we have a list of songs, their descriptions, and their genres, can we generate their embeddings and find similar songs using cosine similarity?

Currently it doesn't work... you can sort of search anything and it will get one of the results as long as the prompt is long enough.

Ideas to fix:

- Expand the data used to generate the embeddings for the library songs
- Use a different model to generate the embeddings?
- Maybe embeddings isn't the right way to go about this??
  - Maybe we can use the embeddings to generate a classifier that can classify songs into genres?
  - Maybe we can use a NLP to map a prompt to a list of genres and songs which can then be compared to the library?
