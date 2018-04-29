export class User {

    public $key: string;
    constructor(
        public name: string,
        public username: string,
        public email: string,
        public telefone:string,
        public photo: string,
    ) { }

}