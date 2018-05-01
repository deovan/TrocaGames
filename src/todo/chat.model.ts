export class ChatModel{
    public $key: string
       constructor(
           public lastMessage: string,
           public timestamp: any,
           public title: string,
           public photo: string
       ){}
   }