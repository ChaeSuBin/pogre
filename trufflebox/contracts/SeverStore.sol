pragma solidity ^0.8.3;

import '../client/node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

contract SeverStore is ERC20{

    constructor() ERC20("Thread", "THRe") {
        _mint(address(this), 10000*10**18);
    }
    struct playTeam {
        string title;
        address[] name;
        address owner;
        uint[] stake;
        uint price;
    }
    mapping(uint => playTeam) history;
    uint countTrading = 0;

    function putBlockAndPurchase(
        uint _team, 
        address[] memory _ptcp, 
        uint[] memory _stake, 
        uint _price)
    external
    {
        uint8 iterA = 0;
        while(iterA != _ptcp.length)
        {
            history[_team].name.push(_ptcp[iterA]);
            history[_team].stake.push(_stake[iterA]);
            ++iterA;
        }
        history[_team].price = _price * 10**18;
        transferFrom(msg.sender, address(this), history[_team].price);
        ideaTrade(_team, _ptcp);
        history[_team].owner = msg.sender;
    }
    function ideaTrade(uint _team, address[] memory _ptcp)
    internal
    {//_stake = at 0.001
        uint8 iterA = 0;
        while(iterA != _ptcp.length)
        {
            transferFrom(
                address(this),
                _ptcp[iterA],
                1*10**15*history[_team].stake[iterA]);
            ++iterA;
        }
        ++countTrading;
    }
    function getPtcp(uint _team) public view returns(address[] memory){
        return history[_team].name;
    }
    function getStake(uint _team) public view returns(uint[] memory){
        return history[_team].stake;
    }
    function getOwner(uint _team) public view returns(address){
        return history[_team].owner;
    }
    function getPrice(uint _team) public view returns(uint){
        return history[_team].price;
    }
    function getTradingCounter() public view returns(uint){
        return countTrading;
    }
}

//["0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"]
//["hasha", "hashb"]