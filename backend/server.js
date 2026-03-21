const express = require("express");
const cors    = require("cors");
const routes  = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/", (req, res) => res.json({ message: "E-Commerce API running 🚀" }));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));