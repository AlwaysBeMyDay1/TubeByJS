import "./db";
import "./models/Video"
import app from "./server"

const PORT = 4008;

const handleListening = ()=> console.log(`Server listening on port http://localhost:${PORT}`);
app.listen(PORT, handleListening);
// 위 코드와 동일// app.listen(4000, ()=> console.log("Server listening on port 4000"));