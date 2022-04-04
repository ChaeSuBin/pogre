// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import './SeverStore.sol';

contract CoinDispencer is SeverStore{
    struct userCharge{
        uint price;
        uint8 point;
    }
    string connecTecs = "connection-right_idea";
    
    mapping(address => userCharge) purchase;

    modifier fee(uint _fee) {
        if (msg.value != _fee) {
            revert("!REVERT 101");
        } else {
            _;
        }
    }

    function sellTokn(uint _toknAmount) external{
        require(_toknAmount > 0, "You need to sell at least some tokens");
        allowance(msg.sender, address(this));
        transferFrom(msg.sender, address(this), _toknAmount);
        payable(msg.sender).transfer(_toknAmount*100);
    }

    function changePoint(uint8 _requirePoint, uint _calcedPirec) external
    payable
    fee(_calcedPirec){
        purchase[msg.sender].point = _requirePoint;
        purchase[msg.sender].price = _calcedPirec;
        //trx(purchase[msg.sender].price);
    }
    function ca_ethBal() public view returns(uint){
        return address(this).balance;
    }
    function userPoint() public view returns(uint){
        return purchase[msg.sender].point;
    }
    function connection() public view returns(string memory){
        return connecTecs;
    }
}