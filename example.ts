import { MESSAGE_CREATE } from "./discord_types.js";
import { Discord } from "./main.js";

/*
This example will periodically send out a status message to 
create the `Listening to Spotify` status, with arbitrary data.
*/


const spot_message = () => {
    let shuffle = function (a: Array<string>): string {
        var n = a.length;
    
        for(var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a.join("");
    }
    
    let empty = "‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌‌";
    let d = new Date();
    let millis = Date.now();
    let prog =  ((d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds()) * 1000 + d.getMilliseconds(); 
    let name = shuffle(["🍉", "💯", "⛺", "🧭", "🔥", "✨"]);
    return {
        "op": 3,
        "d": {
            "status": "dnd",
            "since": 0,
            "activities": [
                {
                    "type": 2,
                    "name": "Spotify",
                    "assets": {
                        "large_image": "spotify:ab67616d00004851a1408724911fcc0eda2bd9a1",
                        "large_text": name
                    },
                    "details": empty,
                    "timestamps": {
                        "start": millis - prog,
                        "end": 1337000000000 * 60 * 60
                    },
                    "party": {
                        "id": "spotify:261587350121873408"
                    },
                    "sync_id": "4cOdK2wGLETKBW3PvgPWqT5",
                    "flags": 48,
                    "metadata": {
                        "context_uri": "spotify:playlist:1r1JdQ3SoQYf1dQcSijGnJ",
                        "album_id": "5Z9iiGl2FcIfa3BMiv6OIw",
                        "artist_ids": []
                    }
                }
            ],
            "afk": false
        }
    }
}

let disc = new Discord();

// Send a message to create a `listening to Spotify` status.
setInterval(() => {
    console.log("Send Spotify Message");
    disc.send_json(spot_message());
}, 15 * 1000);