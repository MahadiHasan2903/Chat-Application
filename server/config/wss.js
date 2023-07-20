const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("../models/messageSchema");
const fs = require("fs");
const path = require("path");

function createWebSocketServer(server) {
  const wss = new ws.WebSocketServer({ server });

  function notifyAboutOnlinePeople() {
    const onlineClients = [...wss.clients].map((client) => ({
      userId: client.userId,
      username: client.username,
    }));

    wss.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          online: onlineClients,
        })
      );
    });
  }

  wss.on("connection", (connection, req) => {
    connection.isAlive = true;

    function heartbeat() {
      connection.isAlive = true;
    }

    function terminateConnection() {
      clearInterval(connection.timer);
      connection.terminate();
      notifyAboutOnlinePeople();
      console.log("dead");
    }

    connection.timer = setInterval(() => {
      connection.ping(heartbeat);

      connection.deathTimer = setTimeout(() => {
        if (!connection.isAlive) {
          terminateConnection();
        }
      }, 1000);
    }, 5000);

    connection.on("pong", heartbeat);

    // read username and id from the cookie for this connection
    const cookies = req.headers.cookie;
    if (cookies) {
      const tokenCookieString = cookies
        .split(";")
        .find((str) => str.startsWith("token="));
      if (tokenCookieString) {
        const token = tokenCookieString.split("=")[1];
        if (token) {
          jwt.verify(token, process.env.JWT_SECRET, {}, (err, userData) => {
            if (err) throw err;
            const { userId, username } = userData;
            connection.userId = userId;
            connection.username = username;
          });
        }
      }
    }

    connection.on("message", async (message) => {
      const messageData = JSON.parse(message.toString());
      const { recipient, text, file } = messageData;
      let filename = null;

      if (file) {
        console.log("size", file.data.length);
        const parts = file.name.split(".");
        const ext = parts[parts.length - 1];
        filename = Date.now() + "." + ext;
        const uploadsDir = path.join(__dirname, "../Uploads", filename);
        const bufferData = Buffer.from(file.data.split(",")[1], "base64");

        fs.writeFile(uploadsDir, bufferData, () => {
          console.log("file saved:" + uploadsDir);
        });
      }

      if (recipient && (text || file)) {
        const messageDoc = await Message.create({
          sender: connection.userId,
          recipient,
          text,
          file: file ? filename : null,
        });
        console.log("created message");
        [...wss.clients]
          .filter((c) => c.userId === recipient)
          .forEach((c) =>
            c.send(
              JSON.stringify({
                text,
                sender: connection.userId,
                recipient,
                file: file ? filename : null,
                _id: messageDoc._id,
              })
            )
          );
      }
    });

    // notify everyone about online people (when someone connects)
    notifyAboutOnlinePeople();
  });
}

module.exports = createWebSocketServer;
