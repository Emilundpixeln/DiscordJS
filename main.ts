import WebSocket from 'ws';
import pako from './inflater.js';
import fetch from 'node-fetch';
import * as Type from './discord_types'
import { readFileSync, createReadStream, ReadStream } from "fs";

export class Discord {
    ws: WebSocket;
    handler: Partial<Record<Type.MESSAGE_TYPE, Function>>;
    auth: string;

    data: {
        guilds: Map<Type.GUILD_ID, Type.Guild>;
        users: Map<Type.USER_ID, Type.User>;
        me: {
            id: Type.USER_ID;
        }
    };

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
                        'GUILD_MEMBER_UPDATE',
                        'MESSAGE_REACTION_REMOVE',
                        'CHANNEL_CREATE'
                    ];
                    //if(json.t == "READY") console.log(inspect(json.d, false, null, false));
            
                    if(json.t == "READY") {
                        let data: Type.MESSAGE_READY = json.d;
                        this.data = {
                            users: new Map(data.users.map((user) => [user.id, user])),
                            guilds: new Map(data.guilds.map((guild) => [guild.id, guild])),
                            me: {
                                id: data.user.id,
                            },
                        }
                       // console.log(inspect(data, false, null, false));
                    }

                    if(known_types.indexOf(json.t) != -1) {
                       // console.log(json.t);
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

    on_PRESENCE_UPDATE(callback: (data: any) => void)  { // TODO
        this.handler["PRESENCE_UPDATE"] = callback;
    }

    on_MESSAGE_REACTION_ADD(callback: (data: Type.MESSAGE_REACTION_ADD) => void)  {
        this.handler["MESSAGE_REACTION_ADD"] = callback;
    }

    on_MESSAGE_CREATE(callback: (data: Type.MESSAGE_CREATE) => void)  {
        this.handler["MESSAGE_CREATE"] = callback;
    }

    get_guild_by_id(id: Type.GUILD_ID): Type.Guild {
        return this.data.guilds.get(id);
    }

    async edit_message(channel_id: Type.CHANNEL_ID, message_id: Type.MESSAGE_ID, message: string) {
        let res = await fetch(`https://discord.com/api/v9/channels/${channel_id}/messages/${message_id}`, {
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

    async delete_message(channel_id: Type.CHANNEL_ID, message_id: Type.MESSAGE_ID) {
        let res = await fetch(`https://discord.com/api/v9/channels/${channel_id}/messages/${message_id}`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "de",
                "authorization": this.auth,
                "content-type": "application/json",
            },
            "method": "DELETE"
        });
        return res;
    }

    async post_message_with_attachement_by_path(channel_id: Type.CHANNEL_ID, file_path: string) {
        return this.post_message_with_attachement(channel_id, readFileSync(file_path));
    }

    async post_message_with_attachement(channel_id: Type.CHANNEL_ID, file_data: Buffer) {
        let body_head = "-----------------------------215753160114040\n"
        + "Content-Disposition: form-data; name=\"file\"; filename=\"1.png\"\n"
        + "Content-Type: image/png\n"
        + "\n";

        let body_tail = "\n"
        + "-----------------------------215753160114040\n"
        + "Content-Disposition: form-data; name=\"payload_json\"\n"
        + "\n"
        + "{\"content\":\"\",\"tts\":false}\n"
        + "-----------------------------215753160114040--\n"
     //   console.log(file_data);
        if(file_data.toString().search("-----------------------------215753160114040") != -1) {
            console.error("Error sending file");
            return null;
        }
        let body = Buffer.concat([Buffer.from(body_head), file_data, Buffer.from(body_tail)]);

        console.log(body);
        let res = await fetch(`https://discord.com/api/v9/channels/${channel_id}/messages`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "de",
                "authorization": this.auth,
                "Content-Type":	"multipart/form-data; boundary=---------------------------215753160114040",
            },
            "body": body,
            "method": "POST"
        });
 

    
        return res;
    }
}

