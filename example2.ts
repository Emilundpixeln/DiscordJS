import { MESSAGE_CREATE } from "./discord_types.js";
import { Discord } from "./main.js";
import * as _text2png from 'text2png'; let text2png = _text2png.default;


// Edit a message on reaction.
let disc = new Discord();

disc.on_MESSAGE_CREATE(async (data: MESSAGE_CREATE) => {
    if(data.author.id != disc.data.me.id)
        return;
    if(data.content.startsWith("!render ")) {
        let opt = data.content.substr("!render ".length, 3);
        if(opt.length != 3) return;
        let font = "sans-serif";
        if (opt[0] == "i") font = "Impact";
        if (opt[0] == "m") font = "monospace";

        let size = 30;
        size = parseInt(opt.substr(1));
        let cont = data.content.substr("!render ".length + 3);
        console.log(`Wrote ${data.content}`);
        disc.delete_message(data.channel_id, data.id);
        let buff: Uint8Array = text2png(cont, {color: "grey", font: size +"px " + font});
        console.log(await disc.post_message_with_attachement(data.channel_id, Buffer.from(buff)));
    }
});
