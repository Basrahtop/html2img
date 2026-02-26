require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const convertRoutes = require("./routes/convert");
const presetsRoutes = require("./routes/presets");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", convertRoutes);
app.use("/api/presets", presetsRoutes);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(port, () => {
  console.log(`HTML2IMG server running on http://localhost:${port}`);
});
