const SHA256 = require('crypto-js/sha256');
class BlocoProduto{
    constructor(index, nome, local_origem, info_adicionais, timestamp, dados, precedingHash=" "){
     this.index = index;
     this.nome = nome; //vegetal, animal, medicinal, etc 
     this.local_origem = local_origem;
     this.info_adicionais = info_adicionais;
     this.timestamp = timestamp; //registro do tempo de ocorrência de cada transação concluída
     this.dados = dados; //dados de transações concluídas [vendedor, detalhes do comprador, preço, etc]
     this.precedingHash = precedingHash;
     this.hash = this.computeHash();     
    }
    computeHash(){
        return SHA256(this.index + this.nome + this.local_origem + this.info_adicionais + this.precedingHash + this.timestamp + JSON.stringify(this.dados)+this.nonce).toString();
    }
    proofOfWork(difficulty){
        while(this.hash.substring(0, difficulty) !==Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.computeHash();
        }        
    }    
}

class ProdutoBlockchain{
    constructor(){
        this.blockchain = [this.startGenesisBlock()];  
        this.difficulty = 0;   
    }
    startGenesisBlock(){
        return new BlocoProduto(0, "", "", "", "17/05/2020", "Bloco inicial", "0");
    }
    obtainLatestBlock(){
        return this.blockchain[this.blockchain.length - 1];
    }
    addNewBlock(newBlock){
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        //newBlock.hash = newBlock.computeHash(); 
        newBlock.proofOfWork(this.difficulty);
        this.blockchain.push(newBlock);
    }
    checkChainValidity(){
        for(let i = 1; i < this.blockchain.length; i++){
            const currentBlock = this.blockchain[i];
            const precedingBlock= this.blockchain[i-1];

          if(currentBlock.hash !== currentBlock.computeHash()){
              return false;
          }
          if(currentBlock.precedingHash !== precedingBlock.hash)
            return false;
        }
        return true;
    }
}

let ChainDeProdutos = new ProdutoBlockchain();

console.log("produtos mining in progress....");
ChainDeProdutos.addNewBlock(
  new BlocoProduto(1, "Ovos", "Assentamento Mariana", "Ovos de Galinha Caipira", "01/04/2020", {
    produtor: "Dona Aparecida",
    comprador: "Augusto",
    preco_unidade: 2.50,
    quantidade: "12"
  })
);

ChainDeProdutos.addNewBlock(
  new BlocoProduto(2, "Cenoura", "Assentamento Mariana", "", "01/05/2020", {
    produtor: "Dona Raimunda",
    comprador: "Giovanna",
    preco_unidade: 1.00,
    quantidade: "5"
  })
);

console.log(JSON.stringify(ChainDeProdutos, null, 4));
