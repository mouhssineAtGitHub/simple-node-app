// Nodejs built-in modules
const http = require("http");
const url = require("url");
const fs = require("fs");
const os = require("os");

// Mailing service module to install before importation 
const nodemailer = require("nodemailer");

//My modules
const dt = require("./modules");
const { myPass } = require("./pass");

//Server variables declaration
const port = 3001;
const hostname = "127.0.0.1";

//Creation of the server connection
const server = http.createServer((req, res) => {
  
//data to append into the tracking file
const username = os.hostname();
const ip = req.connection.remoteAddress;
const pageUrl = req.url;
const checkingTime = dt.displayDateTime();

const content = `User: ${username} User ip:${ip}  Time:${checkingTime} Checked page: ${pageUrl} \r\n`;

  // Respond to home link request
  if (req.url === "" || req.url === "/" || req.url === "/home") {
    fs.readFile("home.html", (err, data) => {
      if (err) {
        return console.log(err);
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);

      fs.appendFile("track.user.txt", content, function(err) {
        if (err) throw err;
        console.log("User Tracking Updated!");
      });

      res.end();
    });

    // Respond to about link request
  } else if (req.url === "/about") {
    fs.readFile("about.html", (err, data) => {
      if (err) {
        return console.log(err);
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);

      fs.appendFile("track.user.txt", content, function(err) {
        if (err) throw err;
        console.log("User Tracking Updated!");
      });

      res.end();
    });

    // Respond to contact link request
  } else if (req.url === "/contact") {
    fs.readFile("contact.html", (err, data) => {
      if (err) {
        return console.log(err);
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      fs.appendFile("track.user.txt", content, function(err) {
        if (err) throw err;
        console.log("User Tracking Updated!");
      });
      res.end();
    });

    // Respond to contact link with params request
  } else if (req.url.includes("firstname")) {
    const adr = req.url;
    const q = url.parse(adr, true);
    const qdata = q.query;
    console.log(qdata);
    const msg =
      "First name:" +
      qdata.firstname +
      "last name:" +
      qdata.lastname +
      +"Email:" +
      qdata.message +
      "Message:" +
      qdata.message;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mouhssineidrissiakhelij1982@gmail.com",
        pass: myPass.pass
      }
    });

    var mailOptions = {
      from: "mouhssineidrissiakhelij1982@gmail.com",
      to: "mouhssineidrissiakhelij1982@gmail.com",
      subject: "Sending Email using Node.js",
      html: "<p>" + msg + "</p>"
    };

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        res.write(error);
        res.end();
      } else {
        res.write("Email sent: " + info.response);
        res.end();
      }
    });
  }
});

// Start to listen to the request on the port
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
