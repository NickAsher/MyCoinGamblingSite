// const Web3 = require('web3') ;
// const fs = require('fs') ;

let deployed ;
// Import libraries we need.
window.App = {

        start(){
          // for linux
            // var deployed = helper.deployContract("APP/contracts/MyCoin.sol", "MyCoin", [1000000, web3.toWei(0.1, 'ether')])
            
            var abi = require("../build/abi_MyCoin.json") ;
            var MyCoinContract = window.web3.eth.contract(abi) ;
            var deployedContractAddress = "0xe604481f6c9c6f133f58829b01e43a1ab34cf273" ;
            deployed = MyCoinContract.at(deployedContractAddress) ;
            $('#div_MyCoinContractAddress').html(" Address : " + deployedContractAddress) ;

            this.displayContractInfo() ;


        

        },
        displayContractInfo(){
            $('#div_MyCoinInfo').html("Info <br>") ;
            deployed.owner.call(function(err, data){
                if(err){
                    $('#div_MyCoinInfo').append(` Error in getting contractOwner Address <br> `)
                } else {
                    let contractOwnerAddress = data ;
                    $('#div_MyCoinInfo').append(` Coin Owner Address <b>${contractOwnerAddress} </b> <br>`) ;
                }
            }) ;


            deployed.totalSupply.call(function(err, data){
                if(err){
                    $('#div_MyCoinInfo').append(` Error in getting Coin Total SUppply  <br> `)
                } else {
                    let totalSupply = data.toNumber() ;
                    $('#div_MyCoinInfo').append(` Coin Total Supply <b>${totalSupply} </b> <br>`) ;
                }
            }) ;


            deployed.name.call(function(err, data){
                if(err){
                    $('#div_MyCoinInfo').append(` Error in getting Coin Name  <br> `)
                } else {
                    console.log(data) ; 
                    $('#div_MyCoinInfo').append(` Coin Name <b> ${data} </b> <br>`) ;
                }
            }) ;


            deployed.coinPrice.call(function(err, data){
                if(err){
                    $('#div_MyCoinInfo').append(` Error in getting CoinPrice <br> `)
                } else {
                    let coinPrice = window.web3.fromWei(data.toNumber(), 'ether') ;
                    $('#div_MyCoinInfo').append(` Coin Price <b>${coinPrice} </b> <br>`) ;
                }
            }) ;



   
        },
        justDummyMethod(){
            console.log("Just run the dummy method") ;
        },
        getCurrentAccount_EtherBalance(){
            console.log("getCurrentAccount_EtherBalance button is clicked") ;
            let currentAccount = window.web3.eth.accounts[0] ;
            window.web3.eth.getBalance(currentAccount, (err, data)=>{
                if(err){
                    console.log("error in getting data " + err) ;
                } else {
                    console.log(data) ;
                     var balanceInEther = window.web3.fromWei(data, 'ether').toNumber() ;
                     $('#div_CurrentAccount_EtherBalance').html(`Current Account : ${currentAccount}, <br> Ether balance :  ${balanceInEther}`) ;
                     
                }
                
            }) ;
            

        }, 
        getCurrentAccount_MyCoinBalance(){
            let currentAccount = window.web3.eth.accounts[0] ;
            deployed.balanceOf.call(currentAccount, function(err, data){
                if(err){
                    $('#div_CurrentAccount_MyCoinBalance').html("error in getting data " + err) ;
                } else {
                     var balanceInMyCoins = data.toNumber() ;
                     $('#div_CurrentAccount_MyCoinBalance').html(`Current Account : ${currentAccount}, <br> MyCoin balance :  ${balanceInMyCoins}`) ;
                     
                }
            }) ;
        }, 
        getCurrentAccount_Allowance(){
            let currentAccount = window.web3.eth.accounts[0] ;
            let spenderAccount = $('#input_AllowanceSpenderAddress').val() ;
            deployed.allowance.call(currentAccount, spenderAccount, function(err, data){
                if(err){
                    $('#div_CurrentAccountSpenderAllowanceBalance').html("error in getting data " + err) ;
                } else {
                     var balanceInMyCoins = data.toNumber() ;
                     $('#div_CurrentAccountSpenderAllowanceBalance').html(`Current Account : ${currentAccount},  Spender : ${spenderAccount} , spenderAllowance :  ${data.toNumber()}`) ;
                     
                }
            }) ;
        },
        transferMyCoins(){
            let currentAccount = window.web3.eth.accounts[0] ;
            let toAccount = $('#input_TransferMyCoinAccountAddress').val() ;
            let value = $('#input_TransferMyCoinValue').val() ;

            deployed.transfer(toAccount, value, function(err, data){
                if(err){
                    $('#div_TransferMyCoinResultInfo').html("error in getting data " + err) ;
                } else {
                     $('#div_TransferMyCoinResultInfo').html(`result of Transaction ${data}`) ;
                     window.App.getCurrentAccount_MyCoinBalance() ;
                     
                }
            }) ;

        }, 
        buyMyCoins(){
            let currentAccount = window.web3.eth.accounts[0] ;
            let amountInEther = $('#input_BuyMyCoinValue').val() ;
            let amountInWei = window.web3.toWei(amountInEther, 'ether') ;

            deployed.buyMyCoin({"value" : amountInWei}, function(err, data){
                if(err){
                    $('#div_BuyMyCoinInfo').html("error in getting data " + err) ;
                } else {
                     $('#div_BuyMyCoinInfo').html(`result of Transaction ${data}`) ;
                     window.App.getCurrentAccount_MyCoinBalance() ;
                     window.App.justDummyMethod() ;
                     
                }
            }) ;
        }



    }


window.addEventListener('load', function() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        $('#div_Web3Info').html("yo web3 is installed <br> ") ;
        window.web3 = new Web3(web3.currentProvider);
    } else {
        $('#div_Web3Info').html("yo web3 is NOT installed <br>") ;
        
    }
    window.App.start() ;



});
                    
                    
                