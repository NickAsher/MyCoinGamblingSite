pragma solidity ^0.4.4 ;


contract MyCoin {

  mapping(address=>uint256) public balances ;
  mapping(address=>mapping(address=>uint256)) public allowances ;
  uint256 public totalSupply ;


  // ERC20 Events
  event Transfer(address indexed _from, address indexed _to, uint256 _value);
  event Approval(address indexed _owner, address indexed _spender, uint256 _value);  // the owner has allowed spender(exchange) to spend this much on their behalf

  string public name ;
  uint8 public decimals;
  string public symbol;
  string public version;

  address public owner ;

  modifier onlyOwner(){
    if(msg.sender == owner){
      _;
    }
  }


  uint256 public coinPrice  ;


  function  MyCoin(uint256 _totalSupply, uint256 _coinPrice) {
    totalSupply = _totalSupply ;
    balances[this] = totalSupply ;
    name = "MyCoin" ;
    decimals = 9 ;
    symbol = "MYC" ;
    version = "0.1" ;
    owner = msg.sender ;
    coinPrice = _coinPrice ;

  }



  // ERC20 Methods
  function balanceOf(address _address) public constant returns (uint256 balance) {
    return balances[_address];
  }

  function allowance(address _owner, address _spender) public constant returns (uint256 remaining) {
    return allowances[_owner][_spender];
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    if(balances[msg.sender] < _value) throw;
    if(balances[_to] + _value < balances[_to]) throw;
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    Transfer(msg.sender, _to, _value);
    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
    allowances[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(address _owner, address _to, uint256 _value) public returns (bool success) {
    if (balances[_owner] < _value) throw;
    if(balances[_to] + _value < balances[_to]) throw;
    if(allowances[_owner][msg.sender] < _value) throw;
    balances[_owner] -= _value;
    balances[_to] += _value;
    allowances[_owner][msg.sender] -= _value;
    Transfer(_owner, _to, _value);
    return true;
  }


  function setCoinPrice(uint256 _coinPrice) public onlyOwner {
    coinPrice = _coinPrice ;
  }

  function buyMyCoin() public payable {
    uint256 noOfCoins = msg.value/coinPrice ;
    if(balances[this] < noOfCoins){
      throw ;
    }

    balances[msg.sender] += noOfCoins ;
    balances[this] -= noOfCoins ;
    Transfer(this, msg.sender, noOfCoins) ;
  }




}






contract Gamble {
    

    uint256 public team1Amount ;
    uint256 public team2Amount ;
    uint256 public totalAmount ;

    uint256 public HardLimit ;

    address public owner ;
    MyCoin public myCoin ;
    modifier onlyOwner(){
      if(msg.sender == owner) {
         _;
      }
    }


    /*mapping(address => uint256) team1Betters ;
    mapping(address => uint256) team2Betters ;*/

    struct Person {
      address personAddress ;
      uint256 contribution ;
    }

    Person[] team1Betters ;
    Person[] team2Betters ;




    function Gamble(address _ower, uint256 _hardLimit) {
      owner = _ower;
      totalAmount = 0;
      team1Amount = 0;
      team2Amount = 0;
      HardLimit = _hardLimit;
    }

    function setMyCoinContract(address _myCoinContractAddress) {
      myCoin = MyCoin(_myCoinContractAddress) ;

    }

    function getTeam1Balance() returns (uint256) {
      return team1Amount ;
    }


    function getTeam2Balance() returns (uint256) {
      return team2Amount ;
    }

    function BetOnTeam1(uint _noOfTokens) public {
      /*if(team1Amount >= HardLimit){
        throw ;
      }

      if(team1Amount + value >= HardLimit){
        throw ;
      }*/

      
      myCoin.transferFrom(msg.sender, this, _noOfTokens) ;
      team1Betters.push(Person(msg.sender, _noOfTokens)) ;
      team1Amount += _noOfTokens ;
      totalAmount += _noOfTokens ;


    }

    function BetOnTeam2(uint _noOfTokens) public {
      // if (team2Amount >= HardLimit){ throw; }
      // if (team2Amount + value >= HardLimit){ throw; }

      myCoin.transferFrom(msg.sender, this, _noOfTokens) ;
      team2Betters.push(Person(msg.sender, _noOfTokens)) ;

      team2Amount += _noOfTokens;
      totalAmount += _noOfTokens;
    }




    function resolveBet(uint256 winningTeamNumber) public onlyOwner {




        if(winningTeamNumber == 1) {

          // Team1 has won the Game

          uint256 ratio1 = totalAmount/team1Amount ;

          for(uint i = 0 ; i < team1Betters.length ; i++) {
            if(myCoin.transfer(team1Betters[i].personAddress, team1Betters[i].contribution * ratio1) != true) {
              throw ;
            } 
          }
      } else if(winningTeamNumber == 2) {
        // Team1 has won the Game
          uint256 ratio2 = totalAmount/team2Amount ;

          for(uint j = 0 ; j < team2Betters.length ; j++) {
            if(myCoin.transfer(team1Betters[j].personAddress, team1Betters[j].contribution * ratio1) != true) {
              throw ;
            } 
          }
    }




    }


    function refund() public onlyOwner {

      uint256 ratio1 = totalAmount/team1Amount ;
      for(uint i2 = 0 ; i2 < team1Betters.length ; i2++) {
        team1Betters[i2].personAddress.send(team1Betters[i2].contribution * ratio1) ;
      }

      uint256 ratio2 = totalAmount/team2Amount ;

      for(uint j2 = 0 ; j2 < team2Betters.length ; j2++) {
        team2Betters[j2].personAddress.send(team2Betters[j2].contribution * ratio2) ;
      }
      // refund everyone's money
    }






}
