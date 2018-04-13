global.Web3 = require("web3") ;
global.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")) ;
global.solc = require("solc") ;
global.fs = require("fs") ;
//
global.account0 = web3.eth.accounts[0] ;
global.account1 = web3.eth.accounts[1] ;
global.account2 = web3.eth.accounts[2] ;
global.account3 = web3.eth.accounts[3] ;
global.account4 = web3.eth.accounts[4] ;
global.account5 = web3.eth.accounts[5] ;


class Helpers {

  getAccountBalance(account){
    return web3.fromWei(web3.eth.getBalance(account), 'ether').toNumber() ;
  }

  deployContract(filePath, contractName, option=[]){




    var source = global.fs.readFileSync(filePath, 'utf8') ;
    var compiled = global.solc.compile(source) ;
    console.log(compiled) ;
    var abi = JSON.parse(compiled["contracts"][contractName]["interface"]) ;
    var bytecode = compiled["contracts"][contractName]["bytecode"] ;
    var gasEstimate = global.web3.eth.estimateGas({data : bytecode}) ;

    var myContract = global.web3.eth.contract(abi) ;


    var deployedContract = myContract.new(...option, {
      'from' :  global.account0,
      'data' : bytecode,
      'gas' : 4000000,
      'gasPrice' : 1
    }, (error, result)=>{
      if(error){
        console.log(error) ;
      }
    }  ) ;


      return deployedContract ;
  }


  deployContract_SaviAbi(filePath, contractName, option=[]){




    var source = global.fs.readFileSync(filePath, 'utf8') ; 
    var compiled = global.solc.compile(source) ;
    console.log(compiled) ;
    var abi = JSON.parse(compiled["contracts"][contractName]["interface"]) ;
    global.fs.writeFileSync(`abi_${contractName}.json`, JSON.stringify(abi, undefined, 2)) ;
    var bytecode = compiled["contracts"][contractName]["bytecode"] ;
    var gasEstimate = global.web3.eth.estimateGas({data : bytecode}) ;

    var myContract = global.web3.eth.contract(abi) ;


    var deployedContract = myContract.new(...option, {
      'from' :  global.account0,
      'data' : bytecode,
      'gas' : 4000000,
      'gasPrice' : 1
    }, (error, result)=>{
      if(error){
        console.log(error) ;
      }
    }  ) ;


      return deployedContract ;
  }

 




}
global.helper = new Helpers() ;

console.log("Welcome my Apprentice .. !") ;
require("repl").start({}) ;
