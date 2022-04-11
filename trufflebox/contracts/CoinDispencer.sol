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

    function sellTokn(uint _discharge, uint _toknAmount) external{
        uint discharge = _discharge * 10 ** 14;
        uint toknAmount = _toknAmount * 10 ** 14;
        require(_discharge > 0, "You need to sell at least some tokens");
        allowance(msg.sender, address(this));
        transferFrom(msg.sender, address(this), toknAmount);
        payable(msg.sender).transfer(discharge);
    }
    
    function changePoint(uint256 _requireRED, uint _calcedPirec) external
    payable
    fee(_calcedPirec){
        uint requireRED = _requireRED * 10 ** 14;
        transferFrom(address(this), msg.sender, requireRED);
        // purchase[msg.sender].point = _requirePoint;
        // purchase[msg.sender].price = _calcedPirec;
    }
    function ca_ethBal() public view returns(uint){
        return address(this).balance;
    }
    function connection() public view returns(string memory){
        return connecTecs;
    }
}