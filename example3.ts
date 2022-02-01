import { WebSocketServer, WebSocket }  from 'ws';
import { MESSAGE_CREATE } from "./discord_types.js";
import { Discord } from "./main.js";

const wss_sender = new WebSocketServer({ port: 8081 });

let follow_id = "207864830806196227";

let reciever = null;

let last_message = null;
wss_sender.on('connection', function connection(ws) {
    reciever = ws;
    console.log("CONNECTED to receiver");
    if(reciever != null && reciever.readyState === WebSocket.OPEN && last_message != null) {
        reciever.send(last_message);
    }
 
});
let disc = new Discord();
disc.on_PRESENCE_UPDATE(async (data) => {

    if(data.activities == 0 || data.user.id != "304649370005929985")
        return;
    let e = data.activities.filter((e) => e.id == "spotify:1");
    if(e.length != 1) {
        console.log("Not playing");
    } 
    console.log(data.activities);
    if(e[0] == null || e[0].sync_id == null)
        return;
    let track_id = e[0].sync_id;
    let time = new Date().getTime();
    let start = (e[0].timestamps.start - time) / 1000;
    let end = (e[0].timestamps.end - time) / 1000;
    let created_at = (e[0].created_at - time) / 1000;   
    console.log(track_id);
    console.log(start);
    console.log(end);
    console.log(created_at);

    last_message = JSON.stringify({
        track_id,
        start: e[0].timestamps.start,
        end: e[0].timestamps.end,
        created_at
    })
    if(reciever != null && reciever.readyState === WebSocket.OPEN) {
        reciever.send(last_message);
    }
});



