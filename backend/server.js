const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const taxDetailRoute = require("./taxDetail");
const paymentRoutes = require("./payment");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors({ origin: "http://31.220.18.57:3000" }));

// global middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

// save form routes
app.use("/api", taxDetailRoute);
app.use("/api/payment", paymentRoutes);

// not matched with any routes, send 404
app.use((req, res) => {
  res.status(404).send("Not foundd");
});

// server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
