import WebSocket from 'ws';
import pako from './inflater.js';
import fetch from 'node-fetch';
import * as Type from './discord_types'
import { readFileSync } from "fs";
import { inspect } from "util";


export class Discord {
    ws: WebSocket;
    handler: Partial<Record<Type.MESSAGE_TYPE, Function>>;
    auth: string;

    constructor() {
        this.auth = JSON.parse(readFileSync('token.json').toString()).token;
        const auth_message = {
            "op": 2,
            "d": {
                "token": this.auth,
                "capabilities": 125,
                "properties": {
                    "os": "Windows",
                    "browser": "Chrome",
                    "device": "",
                    "browser_user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
                    "browser_version": "94.0.4606.81",
                    "os_version": "10",
                    "referrer": "https://www.google.com/",
                    "referring_domain": "www.google.com",
                    "search_engine": "google",
                    "referrer_current": "",
                    "referring_domain_current": "",
                    "release_channel": "stable",
                    "client_build_number": 99508,
                    "client_event_source": null
                },
                "presence": {
                    "status": "dnd",
                    "since": 0,
                    "activities": [],
                    "afk": false
                },
                "compress": false,
                "client_state": {
                    "guild_hashes": {},
                    "highest_last_message_id": "0",
                    "read_state_version": 0,
                    "user_guild_settings_version": -1
                }
            }
        };

       

        let endpoint = "wss://gateway.discord.gg/?encoding=json&v=9&compress=zlib-stream"
        console.log("connecting to: " + endpoint);
        let ws = new WebSocket(endpoint);
        this.ws = ws;
        this.handler = {};
        ws.binaryType = "arraybuffer";

        let inflater = new pako.Inflate({ 
            chunkSize: 65536,
            to: "string"
        });

        ws.on("open", () => {
            console.log("Connected");
        });

        ws.on("close", () => {
            console.log("Closed");
        });

        ws.on("message", (n) => {
            var r = new DataView(n),
            i = r.byteLength >= 4 &&
            65535 === r.getUint32(r.byteLength - 4, !1);
            inflater.push(n, !!i && 2);
        });

        let messages = [];
        inflater.onEnd = (res) => {
            if(res == 0) {
                let json = JSON.parse(messages.join(""));
                messages = []; 
                if(json.op == 10) {
                    //auth
                    console.log("Auth");
                    ws.send(JSON.stringify(auth_message));
                    let s = 50;
                    setInterval(() => {
                        console.log("Send Heartbeat");
                        ws.send(JSON.stringify({
                            "op": 1,
                            "d": s
                        }));
                        s += 40;
                    }, 20 * 1000);
                  
                } else if(json.op == 11) {
                    console.log("Got Heartbeat responce")
                } else if(json.op == 0) {
                    let known_types: Array<Type.MESSAGE_TYPE> = [
                        'SESSIONS_REPLACE' ,
                        'PRESENCE_UPDATE',
                        'MESSAGE_CREATE',
                        'MESSAGE_UPDATE',
                        'READY_SUPPLEMENTAL',
                        'READY',
                        'MESSAGE_REACTION_ADD',
                        'VOICE_STATE_UPDATE',
                        'MESSAGE_DELETE',
                        'GUILD_INTEGRATIONS_UPDATE',
                        'INTEGRATION_UPDATE',
                        'GUILD_EMOJIS_UPDATE',
                        'CHANNEL_UPDATE',
                        'GUILD_BAN_ADD',
                        'CHANNEL_PINS_UPDATE',
                        'GUILD_MEMBER_UPDATE'
                    ];
                    if(json.t == "MESSAGE_CREATE") console.log(inspect(json.d, false, null, true));
                    if(known_types.indexOf(json.t) != -1) {
                        console.log(json.t);
                        let handler = this.handler[json.t]
                        if(handler) handler(json.d);
                    }
                    else console.log(json);
                }
                else 
                    console.log(json);
            }
        };

        inflater.onData = (res) => {
            messages.push(res);
        };
    }

    // send data directly
    send_json(data: object) {
        return this.ws.send(JSON.stringify(data));
    }

    on_MESSAGE_REACTION_ADD(callback: (data: Type.MESSAGE_REACTION_ADD) => void)  {
        this.handler["MESSAGE_REACTION_ADD"] = callback;
    }

    async edit_message(channel_id: Type.CHANNEL_ID, message_id: Type.MESSAGE_ID, message: string) {
        let res = await fetch("https://discord.com/api/v9/channels/830260317040541697/messages/899754609961230346", {
            "headers": {
                "accept": "*/*",
                "accept-language": "de",
                "authorization": this.auth,
                "content-type": "application/json",
            },
            "body": JSON.stringify({
                "content": message
            }),
            "method": "PATCH"
        });
        return res;
    }
}

