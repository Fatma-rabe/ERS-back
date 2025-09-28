const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const initChatSocket = require("./socket/chatSocket");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cors({
    origin: '*',  // دومين الفرونت
    methods: ['GET','POST','PUT','DELETE','OPTIONS'],
    credentials:true
  }));

// APIs
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/registrat"));
app.use("/chat", require("./routes/chat"));

// MongoDB
const mongourl = process.env.MONGO_URL;
mongoose
  .connect(mongourl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 3000;

// ONE server only
const server = http.createServer(app);

// Socket.io attach
const io = new Server(server, {
  cors: { origin: "*" },
});
initChatSocket(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
