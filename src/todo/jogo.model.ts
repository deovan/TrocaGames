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
    public cidade?: string,
    public troca:boolean=true,
    public venda:boolean=true, 
    public fotos: string[] = [],
    public done: boolean = false) { }
}