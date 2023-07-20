const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");
const setupWebSocketServer = require("./config/wss");
const path = require("path");

//dotenv config
dotenv.config();

connectDB();

const app = express();
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));

// routes
app.use(router);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_MODE} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});

//Web Socket Server connection
setupWebSocketServer(server);
