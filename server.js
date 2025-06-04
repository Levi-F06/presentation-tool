import { createServer } from "http";
import { readFile } from "fs";
import url from "node:url";

const INDEX_PAGE = "/src/html/index.html";

createServer((req, res) => {
  const path = url.parse(req.url === "/" ? INDEX_PAGE : req.url);
  readFile(`.${path.pathname}`, (err, data) => {
    if (err) {
      // even if error is intended this will just avoid the server crashing
      console.log(err);
    } else {
      res.write(data);
      res.end();
    }
  });
}).listen(8000);
