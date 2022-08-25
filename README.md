# SAFE ONLINE PURCHASE

##Functionality
This project demonstrates a basic online purchase that is safe for both buyer and seller. there will not be any trust issues. 
Functionality is : -
1. Seller will initiate the purchase contract and deposit the purchase amount to the contract.
2. Buyer will accept the purchase contract and deposit 2 times the purchase amount to the contract.
3. Seller will send the items to buyer and then buyer will confirm the receipt of the items.
4. After the buyer confirm the receipt of the items, he will get back the extra amount he deposited
5. After the buyer confirms the seller will be able to receive the money back from the contract.
6. Seller will get 2 times the amount back because he also deposited purchase amount to the contract in the beginning.

Try running some of the following tasks:

```shell
npx hardhat test .\test\onlinePurchaseAgreementTest.js
npx hardhat run .\deploy.js --network goerli
```
