const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 7071});

const clients = new Map();

wss.on('connection', (ws) => {
    console.log('ws connected');
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const meta = {color, id};
    clients.set(ws, meta);



    ws.on('message', (messageAsString = "example message") => {
        // console.log("messageAsString data as Buffer: ", messageAsString);
        // console.log(`BUFFER-STRING`, Buffer.from(messageAsString).toString('utf8'))

        const message = Buffer.from(messageAsString).toString('utf8');
        const metadata = clients.get(ws);
        message.sender = metadata.id;
        message.color = metadata.color;

        const outbound = JSON.stringify(Buffer.from(messageAsString).toString('utf8'));
        [...clients.keys()].forEach((client) => {
            client.send(outbound);
        });
    });

    ws.on("close", () => {
        clients.delete(ws);
    })
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// https://ably.com/blog/web-app-websockets-nodejs