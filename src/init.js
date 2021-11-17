import "dotenv/config"; //require("dotenv").config(); 와 동일
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4000;

const handleListening = ()=> console.log(`✅ Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
// 위 코드와 동일// app.listen(4000, ()=> console.log("Server listening on port 4000"));