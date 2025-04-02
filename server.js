import { createServer } from "http";
import { readFile } from "fs";

const INDEX_PAGE = "/src/html/index.html";

createServer((req, res) => {
  const url = req.url === "/" ? INDEX_PAGE : req.url;
  console.log(req.url);
  console.log(url);
  readFile(`.${url}`, (_, data) => {
    res.write(data);
    res.end();
  })
}).listen(8000);
