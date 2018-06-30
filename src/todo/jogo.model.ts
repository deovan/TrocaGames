export class Jogo {


   key: any;

  constructor(
    public user: string,
    public userNome: string,
    public nome: string,
    public console: string,
    public categoria: string,
    public descricao: string,
    public preco: string,
    public datetime: any,
    public fotos: string[] = [],
    public troca:boolean=true,
    public venda:boolean=true, 
    public done: boolean = false) { }
}