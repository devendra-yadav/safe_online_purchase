
const {loadFixture} = require("@nomicfoundation/hardhat-network-helpers")
const {ethers} = require("hardhat");
const {expect, assert} = require("chai");

let formatEther = (n)=>{
    return ethers.utils.parseEther(n.toString());
}

let humanReadableAmount = (n)=>{
    return ethers.utils.formatEther(n);
}

describe("OnlinePurchaseAgreement", ()=>{
    async function contractDeployment(){
        let accounts = await ethers.getSigners();
        let deployer = accounts[0];
        let buyer = accounts[1];

        const OnlinePurchaseAgreement = await ethers.getContractFactory("OnlinePurchaseAgreement");
        let value=1000;
        const onlinePurchaseAgreement = await OnlinePurchaseAgreement.deploy(formatEther(value), {value: formatEther(value)});
        await onlinePurchaseAgreement.deployed();
        
        return {onlinePurchaseAgreement, deployer, buyer, value}
    }

    describe("Contract Deployment", ()=>{
        it("should deploy the contract successfully", async ()=>{
            const {onlinePurchaseAgreement} = await loadFixture(contractDeployment);
            console.log(`OnlinePurchageAgreement deployed at ${onlinePurchaseAgreement.address}`)
           
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
            const {onlinePurchaseAgreement, buyer, value} = await loadFixture(contractDeployment);
            
            await onlinePurchaseAgreement.connect(buyer).confirmPurchase({value: formatEther(2*value)});

            let contractBalance = humanReadableAmount(await ethers.provider.getBalance(onlinePurchaseAgreement.address));
            console.log(`Contract balance : ${contractBalance}`);
            expect(contractBalance).to.be.equal('3000.0');    
        })

        it("buyer should be able to confirm the receipt of the items", async ()=>{
            const {onlinePurchaseAgreement, buyer, value} = await loadFixture(contractDeployment);
            await onlinePurchaseAgreement.connect(buyer).confirmPurchase({value: formatEther(2*value)});

            await onlinePurchaseAgreement.connect(buyer).confirmReceived();
            let contractBalance = humanReadableAmount(await ethers.provider.getBalance(onlinePurchaseAgreement.address));
            console.log(`Contract balance : ${contractBalance}`);
            expect(contractBalance).to.be.equal('2000.0');
        })

        it("seller should be able to receive the amount after buyer received the items", async ()=>{
            const {onlinePurchaseAgreement,deployer, buyer, value} = await loadFixture(contractDeployment);
            await onlinePurchaseAgreement.connect(buyer).confirmPurchase({value: formatEther(2*value)});

            await onlinePurchaseAgreement.connect(buyer).confirmReceived();

            await onlinePurchaseAgreement.connect(deployer).paySeller();

            let contractBalance = humanReadableAmount(await ethers.provider.getBalance(onlinePurchaseAgreement.address));
            console.log(`Contract balance : ${contractBalance}`);
            expect(contractBalance).to.be.equal('0.0');
        })

        it("seller should be able to abort the contract if buyer didnt pay yet", async ()=>{
            const {onlinePurchaseAgreement,deployer, buyer, value} = await loadFixture(contractDeployment);
            let contractBalance = humanReadableAmount(await ethers.provider.getBalance(onlinePurchaseAgreement.address));
            console.log(`Contract balance Before : ${contractBalance}`);

            await onlinePurchaseAgreement.connect(deployer).abort();

            contractBalance = humanReadableAmount(await ethers.provider.getBalance(onlinePurchaseAgreement.address));
            console.log(`Contract balance After : ${contractBalance}`);
            expect(contractBalance).to.be.equal('0.0');

        })

        it("seller should not be able to abort the contract if buyer alreay paid", async ()=>{
            const {onlinePurchaseAgreement,deployer, buyer, value} = await loadFixture(contractDeployment);
            let contractBalance = humanReadableAmount(await ethers.provider.getBalance(onlinePurchaseAgreement.address));
            console.log(`Contract balance Before : ${contractBalance}`);
            await onlinePurchaseAgreement.connect(buyer).confirmPurchase({value: formatEther(2*value)});
            
            await expect(onlinePurchaseAgreement.connect(deployer).abort()).to.be.reverted;

            contractBalance = humanReadableAmount(await ethers.provider.getBalance(onlinePurchaseAgreement.address));
            console.log(`Contract balance After : ${contractBalance}`);
            expect(contractBalance).to.be.equal('3000.0');

        })
    })
})