// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

import "hardhat/console.sol";

contract OnlinePurchaseAgreement {

    uint256 public value;
    address payable public buyer;
    address payable public seller;

    enum PurchaseStatus{
        CREATED,
        LOCKED,
        ITEM_RECEIVED,
        PAYMENT_RECEIVED,
        COMPLETED,
        FAILED
    }

    PurchaseStatus public purchaseStatus;

    ///This function cant be called in current state
    error inValidState();

    event ContractLocked(address buyer, address seller, uint256 purchageAmount);

    modifier inState(PurchaseStatus _status) {
        require(purchaseStatus == _status, "This function cant be called at current purchase status");
        _;
    }

    constructor(uint256 _value) payable {
        require(_value == msg.value, "Please send correct amount. Same as purchase amount");
        //purchaseStatus=PurchaseStatus.CREATED;
        value = _value;
        purchaseStatus=PurchaseStatus.CREATED;
        console.log("AAAAAAA",purchaseStatus);
        seller = payable(msg.sender);
    }

    function confirmPurchase() public payable inState(PurchaseStatus.CREATED){

        require(msg.value == 2*value, "Please send twice the purchase amount");

        buyer = payable(msg.sender);
        purchaseStatus = PurchaseStatus.LOCKED;

        emit ContractLocked(buyer, seller, value);
        
    }
}