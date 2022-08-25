
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers")
const {ethers} = require('hardhat');
const {expect} = require("chai");

let formatEther = (n)=>{
    return ethers.utils.parseEther(n.toString());
}

let humanReadableAmount = (n)=>{
    return ethers.utils.formatEther(n);
}

describe("OnlinePurchaseAgreement", ()=>{
    async function contractDeployment(){
        const {deployer, buyer} = await ethers.getSigners();

        const OnlinePurchaseAgreement = await ethers.getContractFactory("OnlinePurchaseAgreement");
        let value=1000;
        const onlinePurchaseAgreement = await OnlinePurchaseAgreement.deploy(formatEther(value), {value: formatEther(value)});
        await onlinePurchaseAgreement.deployed();
        
        return {onlinePurchaseAgreement, buyer }
    }

    describe("Contract Deployment", ()=>{
        it("should deploy the contract successfully", async ()=>{
            const {onlinePurchaseAgreement} = await loadFixture(contractDeployment);
            console.log(`OnlinePurchageAgreement deployed at ${onlinePurchaseAgreement.address}`)
            //console.log(`agreement status : ${onlinePurchaseAgreement.purchaseStatus}`)
            expect(onlinePurchaseAgreement.address).to.be.properAddress;
           // expect(onlinePurchaseAgreement.purchaseStatus).to.be.equal(0);
        })

        it("should have amount deposited by seller equal to purchase value", async ()=>{
            const {onlinePurchaseAgreement} = await loadFixture(contractDeployment);
            console.log(`OnlinePurchageAgreement deployed at ${onlinePurchaseAgreement.address}`)

            const contractBalance = humanReadableAmount(await ethers.provider.getBalance(onlinePurchaseAgreement.address));
            console.log(`Contract balance : ${contractBalance}`);
            expect(contractBalance).to.be.equal('1000.0');
           
        })


    })

    describe("Contract functionality", ()=>{
        it("buyer should be able to lock the agreement to buy", async ()=>{
            const {onlinePurchaseAgreement, buyer} = await loadFixture(contractDeployment);
            
            await onlinePurchaseAgreement.connect(buyer).confirmPurchase();


        })
    })
})