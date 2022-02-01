import { type } from "os";

export type MESSAGE_TYPE =
    | "SESSIONS_REPLACE"
    | "PRESENCE_UPDATE"
    | "MESSAGE_CREATE"
    | "MESSAGE_UPDATE"
    | "READY_SUPPLEMENTAL"
    | "READY"
    | "MESSAGE_REACTION_ADD"
    | "VOICE_STATE_UPDATE"
    | "MESSAGE_DELETE"
    | "GUILD_INTEGRATIONS_UPDATE"
    | "INTEGRATION_UPDATE"
    | "GUILD_EMOJIS_UPDATE"
    | "CHANNEL_UPDATE"
    | "GUILD_BAN_ADD"
    | "CHANNEL_PINS_UPDATE"
    | "GUILD_MEMBER_UPDATE"
    | "MESSAGE_REACTION_REMOVE"
    | "CHANNEL_CREATE";

// all numerical ids
export type CHANNEL_ID = string;
export type USER_ID = string;
export type MESSAGE_ID = string;
export type ROLE_ID = string;
export type TIMESTAMP = string;
export type GUILD_ID = string;
export type EMOJI_ID = string;

export type ICON_URI = string;

export type EMOJI = {
    name: string;
    id: EMOJI_ID;
};

export type Emoji_definition = {
    roles: Array<ROLE_ID>;
    require_colons: boolean;
    name: string;
    managed: boolean;
    id: EMOJI_ID;
    available: boolean;
    animated: boolean;
};

export type User = {
    username: string;
    id: USER_ID;
    discriminator: string; // number from 0-9999
    avatar: string;
    public_flags?: number;
};

export type Member_Data = {
    user: User;
    roles: Array<ROLE_ID>;
    premium_since: any;
    pending: boolean;
    nick: any;
    mute: boolean;
    joined_at: TIMESTAMP;
    is_pending: boolean;
    hoisted_role: ROLE_ID;
    deaf: boolean;
    avatar: any;
};

export type MESSAGE_REACTION_ADD = {
    user_id: USER_ID;
    message_id: MESSAGE_ID;
    member: Member_Data;
    emoji: EMOJI;
    channel_id: CHANNEL_ID;
    guild_id: GUILD_ID;
};

export type Message_Refence = {
    message_id: MESSAGE_ID;
    guild_id?: GUILD_ID;
    channel_id: CHANNEL_ID;
};
export type Message = {
    type: number;
    tts: boolean;
    timestamp: TIMESTAMP;
    pinned: boolean;
    message_reference?: Message_Refence; // IDs of referenced message. Only present if the message referenced another.
    content: string;
    flags: number;
    mention_everyone: boolean;
    channel_id: CHANNEL_ID;
    author: User;
    id: MESSAGE_ID;
    mentions: Array<User>;
    mention_roles: Array<ROLE_ID>;
    edited_timestamp: TIMESTAMP | null;

    // TODO: incomplete
    embeds: Array<any>;
    components: Array<any>;
    attachments: Array<any>;
};

export interface MESSAGE_CREATE extends Message {
    referenced_message: Message | null;
    nonce: string; // some sort of id
    member?: Member_Data; // Only present if message is on a server (guild).
    guild_id?: GUILD_ID; // Only present if message is on a server (guild).
};

export type Friend = {
  user_id: USER_ID;
  id: USER_ID; // alias for user_id
  type: number;
  nickname: string | null; // TODO confirm this is a string
}

export type Private_chat = {
  type: 1 // Personal chat
  recipient_ids: Array<USER_ID>; // Member except urself
  last_message_id: MESSAGE_ID;
  id: CHANNEL_ID;
  icon?: string;
  last_pin_timestamp?: TIMESTAMP;
};

export type Group_chat = {
  type: 3; // Group chat
  recipient_ids: Array<USER_ID>; // Member except urself
  name?: string | null; 
  last_message_id: MESSAGE_ID;
  id: CHANNEL_ID;
  icon?: string;
  owner_id?: USER_ID; 
  last_pin_timestamp?: TIMESTAMP;
};


export type Private_channel = Private_chat | Group_chat;

export type Guild = {
    emojis: Array<Emoji_definition>;
    name: string;
    default_message_notifications: number;
    icon: ICON_URI | null;
    description: string | null;
    guild_scheduled_events: Array<any>; // TODO
    splash: string;
    system_channel_id: CHANNEL_ID;
    public_updates_channel_id: CHANNEL_ID | null;
    application_command_count: number;
    premium_subscription_count: number;
    mfa_level: number;
    explicit_content_filter: number;
    max_video_channel_users: number;
    application_id: any; // always null ?
    discovery_splash: string;
    max_members: number;
    nsfw: boolean;
    vanity_url_code: string | null;
    id: GUILD_ID;
    channels: any; //TODO
    owner_id: USER_ID;
    stage_instances: Array<any>; // TODO
    large: boolean,
    system_channel_flags: number,
    roles: Array<any>; // TODO
    embedded_activities: Array<any>; // TODO
    guild_hashes: object; // TODO
    premium_tier: number;
    afk_channel_id: CHANNEL_ID;
};

export type USER_INFO = {
    username: string;
    id: USER_ID;
    discriminator: string; // number from 0-9999
    // TODO there are more members
}

export type MESSAGE_READY = {
    v: number; // version 
    users: Array<User>; 
    user_settings: any; // TODO
    user: USER_INFO;
    tutorial: any;
    session_id: string;
    relationships: Array<Friend>;
    read_state: any; // TODO
    private_channels: Array<Private_channel>;
    merged_members: Array<any>; // TODO
    guilds: Array<Guild>;
};
