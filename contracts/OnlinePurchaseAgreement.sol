// SPDX-License-Identifier: MIT

pragma solidity 0.8.9;

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

    constructor(address payable _buyer, uint256 _value) payable {
        value = _value;
        seller = payable(msg.sender);
        buyer = _buyer;
    }
}