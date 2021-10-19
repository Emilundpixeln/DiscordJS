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
    | "GUILD_MEMBER_UPDATE";

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
    username: string;
    id: USER_ID;
    discriminator: string; // number from 0-9999
    avatar: string;
};
export type MESSAGE_REACTION_ADD = {
    user_id: USER_ID;
    message_id: MESSAGE_ID;
    member: {
        user: USER;
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
    emoji: EMOJI;
    channel_id: CHANNEL_ID;
    guild_id: GUILD_ID;
};
/*
{                                                     
  type: 19,                                           
  tts: false,                                         
  timestamp: '2021-10-18T23:26:05.544000+00:00',      
  referenced_message: {                               
    type: 19,                                         
    tts: false,                                       
    timestamp: '2021-10-18T23:26:01.795000+00:00',    
    pinned: false,                                    
    message_reference: {                              
      message_id: '899800476218970132',               
      channel_id: '899779887940927540'                
    },                                                
    mentions: [],                                     
    mention_roles: [],                                
    mention_everyone: false,                          
    id: '899800521433559060',                         
    flags: 0,                                         
    embeds: [],                                       
    edited_timestamp: null,                           
    content: 'a',                                     
    components: [],                                   
    channel_id: '899779887940927540',                 
    author: {                                         
      username: 'EmiL',                               
      public_flags: 0,                                
      id: '261587350121873408',                       
      discriminator: '2064',                          
      avatar: '1875c72cfea4d1ab59a593ba85d24b18'      
    },                                                
    attachments: []                                   
  },                                                  
  pinned: false,                                      
  nonce: '899800535752769536',                        
  message_reference: {                                
    message_id: '899800521433559060',                 
    channel_id: '899779887940927540'                  
  },                                                  
  mentions: [],                                       
  mention_roles: [],                                  
  mention_everyone: false,                            
  id: '899800537158000670',                           
  flags: 0,                                           
  embeds: [],                                         
  edited_timestamp: null,                             
  content: 'a',                                       
  components: [],                                     
  channel_id: '899779887940927540',                   
  author: {                                           
    username: 'EmiL',                                 
    public_flags: 0,                                  
    id: '261587350121873408',                         
    discriminator: '2064',                            
    avatar: '1875c72cfea4d1ab59a593ba85d24b18'        
  },                                                  
  attachments: []                                     
}                                                     

*/
export type MESSAGE_MESSAGE_CREATE = {
    type: number;
    tts: boolean;
    timestamp: TIMESTAMP;
    referenced_message: {
        type: 19;
        tts: false;
        timestamp: "2021-10-18T23:15:30.882000+00:00";
        pinned: false;
        message_reference: {
        message_id: "899797216095514704";
        guild_id: "645607528297922560";
        channel_id: "753680247068688414";
        };
        mentions: [[Object]];
        mention_roles: [];
        mention_everyone: false;
        id: "899797875192660019";
        flags: 0;
        embeds: [];
        edited_timestamp: null;
        content: "only when on crit";
        components: [];
        channel_id: "753680247068688414";
        author: {
        username: "superb";
        public_flags: 0;
        id: "395938577021796362";
        discriminator: "9619";
        avatar: "4315b6bf995ed544d25c28a8d2d743da";
        };
        attachments: [];
    };
    pinned: false;
    nonce: "899797968415096832";
    message_reference: {
        message_id: "899797875192660019";
        guild_id: "645607528297922560";
        channel_id: "753680247068688414";
    };
    mentions: [
        {
        username: "superb";
        public_flags: 0;
        member: [Object];
        id: "395938577021796362";
        discriminator: "9619";
        avatar: "4315b6bf995ed544d25c28a8d2d743da";
        }
    ];
    mention_roles: [];
    mention_everyone: false;
    member: {
        roles: [
        "669024566194077696",
        "645609614242611210",
        "848751148478758914",
        "715258455216226404"
        ];
        premium_since: null;
        pending: false;
        nick: null;
        mute: false;
        joined_at: "2020-07-20T20:16:38.883000+00:00";
        is_pending: false;
        hoisted_role: "715258455216226404";
        deaf: false;
        avatar: null;
    };
    id: "899797969937760287";
    flags: 0;
    embeds: [];
    edited_timestamp: null;
    content: "ty";
    components: [];
    channel_id: "753680247068688414";
    author: {
        username: "Tefa";
        public_flags: 0;
        id: "664946096283320372";
        discriminator: "4694";
        avatar: "b7955155ab7eeb977b12a86c16aafc7a";
    };
    attachments: [];
    guild_id: "645607528297922560";
};
