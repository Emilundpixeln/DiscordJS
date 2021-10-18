import { type } from "os";

export type MESSAGE_TYPE =  'SESSIONS_REPLACE' 
                    |'PRESENCE_UPDATE'
                    |'MESSAGE_CREATE'
                    |'MESSAGE_UPDATE'
                    |'READY_SUPPLEMENTAL'
                    |'READY'
                    |'MESSAGE_REACTION_ADD'
                    |'VOICE_STATE_UPDATE'
                    |'MESSAGE_DELETE'
                    |'GUILD_INTEGRATIONS_UPDATE'
                    |'INTEGRATION_UPDATE'
                    |'GUILD_EMOJIS_UPDATE'
                    |'CHANNEL_UPDATE'
                    |'GUILD_BAN_ADD';

// all numerical ids
export type CHANNEL_ID = string;
export type USER_ID = string;
export type MESSAGE_ID = string;
export type ROLE_ID = string;
export type TIMESTAMP = string;
export type GUILD_ID = string;


export type EMOJI = {
    name: string;
    id: string;
};
export type USER = {
    username: string,
    id: USER_ID,
    discriminator: string, // number from 0-9999
    avatar: string
};
export type MESSAGE_REACTION_ADD = {
    user_id: USER_ID,
    message_id: MESSAGE_ID,
    member: {
      user: USER
      roles: Array<ROLE_ID>,
      premium_since: any,
      pending: boolean,
      nick: any,
      mute: boolean,
      joined_at: TIMESTAMP,
      is_pending: boolean,
      hoisted_role: ROLE_ID,
      deaf: boolean,
      avatar: any
    },
    emoji: EMOJI,
    channel_id: CHANNEL_ID,
    guild_id: GUILD_ID
};