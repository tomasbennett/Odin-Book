export const POST_MAX_LENGTH = 1000;

export const POST_MIN_LENGTH = 1;



export const POST_FILE_ARRAY_KEY = "postFileArrayKey" as const;


export const SOCKET_EVENT_POST_OR_REPLY_CREATED: string = "postcreatedeventsocket";
export const SOCKET_EVENT_POST_OR_REPLY_DELETED: string = "postdeletedeventsocket"



export const SOCKET_POST_CHANGE_ROOM_PREFIX: string = "postchangingsuchaslikeornewcomment";
export const SOCKET_NEW_POST_OR_REPLY_ROOM_PREFIX: string = "newpostbeinguploadedSOthiswillbewhenyouareonacertainhomepagesomewhere";



export const VALID_SORT_OPTIONS = [
    "popular",
    "newest",
    "oldest"
] as const;

export const sortKeyWord: string = "sort";