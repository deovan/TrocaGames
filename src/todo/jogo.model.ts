export class Jogo {


   key: any;

  constructor(
    public user: string,
    public nome: string,
    public console: string,
    public categoria: string,
    public descricao: string,
    public preco: string,
    public datetime: string,
    public fotos: string[] = [],
    public done: boolean = false) { }
}