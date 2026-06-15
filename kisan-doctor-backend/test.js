import http from "http";

http.createServer((req, res) => {
  res.end("HELLO");
}).listen(5001, "0.0.0.0");

console.log("Running on port 5001");