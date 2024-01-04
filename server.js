import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/search", (req, res) => {
  const userQuery = req.body.search.toLowerCase();

  res.send(`
    <p class="px-4 py-2 bg-gray-800 text-white">${userQuery}</p>
  `);
});

app.listen(port, () => {
  console.log(`Listening on: http://localhost:${port}`);
});
