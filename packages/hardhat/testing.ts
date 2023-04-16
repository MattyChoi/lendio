import { ethers, ContractFactory, BigNumber } from "ethers";
import dealFactory from "./artifacts/contracts/DealFactory.sol/DealFactory.json";
import deal from "./artifacts/contracts/Deal.sol/Deal.json";
import bm from "./artifacts/contracts/BondManager.sol/BondManager.json";

const usdcABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];

const provider = new ethers.providers.JsonRpcProvider("https://avalanche-fuji.infura.io/v3/YOUR_API_KEY");
const wallet = new ethers.Wallet("YOUR_WALLET_PRIVATE_KEY", provider);
const usdc = "0xA6847a9b6b6aF5bd09A36c3b331f6c66CA46c998";
const usdcContract = new ethers.Contract(usdc, usdcABI, wallet);

async function testDeployDealFactory() {
    console.log("Deploying DealFactory...")
    const factory = new ContractFactory(dealFactory.abi, dealFactory.bytecode, wallet);
    const contract = await factory.deploy();
    await contract.deployTransaction.wait();
    console.log(`Deployed DealFactory. (Address: ${contract.address})`);
    const dfContract = new ethers.Contract(contract.address, dealFactory.abi, wallet);
    console.log("Bond Manager address", await dfContract.manager());
    const length = await dfContract.length();
    console.log("length", length);
    const deals = new Array<string>();
    for (let i = 0; i < length; i++) {
        deals.push(await dfContract.deals(i));
        console.log("Deal " + i + ": ", deals[i]);
    }
    return dfContract;
}

async function testLaunchDeal(dfContract: ethers.Contract) {
    console.log("Launching Deal...");
    const tx = await dfContract.launchDeal(usdc, 500, 1, 1000, 5);
    await tx.wait();
    console.log("Launched Deal.");
    const deals = new Array<string>();
    for (let i = 0; i < await dfContract.length(); i++) {
        deals.push(await dfContract.deals(i));
        console.log("Deal " + i + ": ", deals[i]);
    }
    const dealContract = new ethers.Contract(deals[deals.length - 1], deal.abi, wallet);
    console.log("denom", await dealContract.denom());
    console.log("principal", BigNumber.from(await dealContract.principal()).toString());
    console.log("coupon", BigNumber.from(await dealContract.coupon()).toString());
    console.log("maturity", BigNumber.from(await dealContract.maturity()).toString());
    console.log("supply", BigNumber.from(await dealContract.supply()).toString());
    console.log("amtLeft", BigNumber.from(await dealContract.amtLeft()).toString());
    console.log("admin", await dealContract.admin());
    console.log("repaymentAmt", BigNumber.from(await dealContract.repaymentAmt()).toString());
    console.log("status", BigNumber.from(await dealContract.status()).toString());
    return dealContract;
}

async function testCancelDeal(dealContract: ethers.Contract) {
    console.log("Approving USDC to send to deal contract...")
    const tx1 = await usdcContract.approve(dealContract.address, await dealContract.calcAtomicPrice(5));
    await tx1.wait();
    console.log("USDC approved.");
    console.log("Depositing USDC for 5 bonds...");
    const tx2 = await dealContract.deposit(5);
    await tx2.wait();
    console.log("Deposited USDC for 5 bonds.");
    console.log("Canceling deal as admin...");
    const tx3 = await dealContract.cancel();
    await tx3.wait();
    console.log("Canceled deal.");
    console.log("Withdrawing deposit...");
    const tx4 = await dealContract.withdraw();
    await tx4.wait();
    console.log("Withdrew deposit.");
}

async function testExecuteDeal(dealContract: ethers.Contract) {
    console.log("Approving USDC to send to deal contract...")
    const tx1 = await usdcContract.approve(dealContract.address, await dealContract.calcAtomicPrice(5));
    await tx1.wait();
    console.log("USDC approved.");
    console.log("Depositing USDC for 5 bonds...");
    const tx2 = await dealContract.deposit(5);
    await tx2.wait();
    console.log("Deposited USDC for 5 bonds.");
    console.log("Executing deal as admin...");
    const tx3 = await dealContract.execute();
    await tx3.wait();
    console.log("Executed deal.");
    console.log("Collecting bonds...");
    const tx4 = await dealContract.collectBond();
    await tx4.wait();
    console.log("Collected bonds.");
    console.log("Funding Deal contract...");
    const needed = (await dealContract.repaymentAmt()).sub(await usdcContract.balanceOf(dealContract.address));
    const tx5 = await usdcContract.transfer(dealContract.address, needed);
    await tx5.wait();
    console.log("Funded Deal contract");
    console.log("Approving Deal contract to burn bonds...");
    const bondManager = await dealContract.bondManager();
    const bondManagerContract = new ethers.Contract(bondManager, bm.abi, wallet);
    const tx6 = await bondManagerContract.setApprovalForAll(dealContract.address, true);
    await tx6.wait();
    console.log("Approved Deal contract to burn bonds.");
    console.log("Redeeming bonds...");
    const tx7 = await dealContract.redeemBond();
    await tx7.wait();
    console.log("Redeemed bonds.");
}

(async () => {
    const dfContract = await testDeployDealFactory();
    const deal1Contract = await testLaunchDeal(dfContract);
    console.log("Testing cancel deal...");
    await testCancelDeal(deal1Contract);
    console.log("Tested cancel deal.");
    const deal2Contract = await testLaunchDeal(dfContract);
    console.log("Testing execute deal...");
    await testExecuteDeal(deal2Contract);
    console.log("Tested execute deal.");
})();
