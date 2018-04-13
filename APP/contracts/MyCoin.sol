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
    if (msg.sender == owner) {
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
    return true ;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
    allowances[msg.sender][_spender] = _value;
    Approval(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(address _owner, address _to, uint256 _value) public returns (bool success) {
    if(balances[_owner] < _value) throw;
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
    if(balances[this]  < noOfCoins){
      throw ;
    }

    balances[msg.sender] += noOfCoins ;
    balances[this] -= noOfCoins ;
    Transfer(this, msg.sender, noOfCoins) ;
  }




}
