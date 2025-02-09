// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// 合约的部署者在部署的时候存入一笔钱，过了锁定期可以提取这笔钱
contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        // 要求当前区块的时间戳小于传入的时间
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        // owner设置为payable的地址，可以通过transfer和send进行转账
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        // 谁存入合约谁可以提款
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        // 提款逻辑：调用owner的transfer方法（向owner转账），把当前合约address(this)的余额转账给owner
        owner.transfer(address(this).balance);
    }
}
