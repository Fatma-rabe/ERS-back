const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const initChatSocket = require("./socket/chatSocket");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "http://localhost:54501", 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

// APIs
app.use("/login", require("./routes/login"));
app.use("/register", require("./routes/registrat"));
app.use("/Update", require("./routes/Update"));
app.use("/chat", require("./routes/chat"));
app.use("/Transaction", require("./routes/Transaction"));
app.use("/WorkerManagement", require("./routes/Theworker-management"));
app.use("/MaintenanceRequest", require("./routes/MaintenanceRequest"));
app.use("/EquipmentList",require("./routes/Equipment-List"));
app.use("/WarehouseManagement", require("./routes/WarehouseManagement"));
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
  console.log(`Server is running on http://localhost:${PORT}`);
});
