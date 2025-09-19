export interface sendType {
    type:"chat" | "join";
    payload:{
        message:string;
    } | {
        roomId:string;
    }
}