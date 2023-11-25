import { ethers, run } from "hardhat";

const HUB = "0x4fbffF20302F3326B20052ab9C217C44F6480900";
const MODULE = "0x4BeB63842BB800A1Da77a62F2c74dE3CA39AF7C0";
const PKP_FIAT = "0x8834aE494ADD3C56d274Fe88243526DBAB15dEF8";
const main = async () => {
  try {
    // const PrintAccessControl = await ethers.getContractFactory(
    //   "PrintAccessControl"
    // );
    // const PrintLibrary = await ethers.getContractFactory("PrintLibrary");
    // const PrintDesignData = await ethers.getContractFactory("PrintDesignData");
    // const PrintOrderData = await ethers.getContractFactory("PrintOrderData");
    // const PrintSplitsData = await ethers.getContractFactory("PrintSplitsData");
    // const NFTCreator = await ethers.getContractFactory("NFTCreator");
    // const CollectionCreator = await ethers.getContractFactory(
    //   "CollectionCreator"
    // );
    // const MarketCreator = await ethers.getContractFactory("MarketCreator");
    // const PrintCommunityData = await ethers.getContractFactory(
    //   "PrintCommunityData"
    // );
    // const CommunityCreator = await ethers.getContractFactory(
    //   "CommunityCreator"
    // );
    // const ChromadinOpenAction = await ethers.getContractFactory(
    //   "ChromadinOpenAction"
    // );
    // const CoinOpOpenAction = await ethers.getContractFactory(
    //   "CoinOpOpenAction"
    // );
    // const LegendOpenAction = await ethers.getContractFactory(
    //   "LegendOpenAction"
    // );
    // const LegendMilestone = await ethers.getContractFactory("LegendMilestone");
    // const LegendRegister = await ethers.getContractFactory("LegendRegister");
    // const ListenerOpenAction = await ethers.getContractFactory(
    //   "ListenerOpenAction"
    // );

    // const printAccessControl = await PrintAccessControl.deploy();
    // const printLibrary = await PrintLibrary.deploy();
    // const printDesignData = await PrintDesignData.deploy(
    //   printAccessControl.address
    // );
    // const printOrderData = await PrintOrderData.deploy(
    //   printAccessControl.address
    // );
    // const printSplitsData = await PrintSplitsData.deploy(
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4"
    // );
    // const nFTCreator = await NFTCreator.deploy(
    //   "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4"
    // );
    // const collectionCreator = await CollectionCreator.deploy(
    //   nFTCreator.address,
    //   "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4"
    // );
    // const marketCreator = await MarketCreator.deploy(
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //   printSplitsData.address,
    //   "0x792143D199067a4a40Ac4682d81C957623f7c5c3",
    //   collectionCreator.address,
    //   "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //   PKP_FIAT
    // );
    // const communityCreator = await CommunityCreator.deploy(
    //   "0x792143D199067a4a40Ac4682d81C957623f7c5c3",
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //   "0x813186B4290Ff3240808372b7bB75DBD7881B087"
    // );
    // const printCommunityData = await PrintCommunityData.deploy(
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //   communityCreator.address
    // );
    // const chromadinOpenAction = await ChromadinOpenAction.deploy(
    //   "mystringjsoninfo",
    //   HUB,
    //   MODULE,
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //   "0x456Dfd81673256c358d79307aC400A9586aECA7B",
    //   "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //   "0xC2d14bF8B21538183F2Cf0a334d42BA0Bd3233BD",
    //   "0x15448744C11Ee4C8974018B7e7183435187E0Fa1",
    //   "0x068F3F62c252FE509dFB826515D1b34cAcfCa714"
    // );
    // const coinOpOpenAction = await CoinOpOpenAction.deploy(
    //   HUB,
    //   MODULE,
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //   "0x456Dfd81673256c358d79307aC400A9586aECA7B",
    //   "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //   "0xC2d14bF8B21538183F2Cf0a334d42BA0Bd3233BD",
    //   "0x15448744C11Ee4C8974018B7e7183435187E0Fa1",
    //   printCommunityData.address
    // );
    // const legendRegister = await LegendRegister.deploy(
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4"
    // );
    // const legendMilestone = await LegendMilestone.deploy(
    //   legendRegister.address,
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //   "0x456Dfd81673256c358d79307aC400A9586aECA7B"
    // );
    // const legendOpenAction = await LegendOpenAction.deploy(
    //   HUB,
    //   MODULE,
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //   "0x456Dfd81673256c358d79307aC400A9586aECA7B",
    //   "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //   "0xC2d14bF8B21538183F2Cf0a334d42BA0Bd3233BD",
    //   legendMilestone.address,
    //   legendRegister.address
    // );
    // const listenerOpenAction = await ListenerOpenAction.deploy(
    //   HUB,
    //   MODULE,
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //   "0x456Dfd81673256c358d79307aC400A9586aECA7B",
    //   "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //   "0xC2d14bF8B21538183F2Cf0a334d42BA0Bd3233BD",
    //   "0x15448744C11Ee4C8974018B7e7183435187E0Fa1",
    //   "0x068F3F62c252FE509dFB826515D1b34cAcfCa714"
    // );

    const WAIT_BLOCK_CONFIRMATIONS = 20;
    // printAccessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // printDesignData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // printLibrary.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // printOrderData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // printSplitsData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // nFTCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // collectionCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // marketCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // printCommunityData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // communityCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // chromadinOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // coinOpOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendRegister.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendMilestone.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // listenerOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // console.log(
    //   `PrintAccessControl deployed at\n${printAccessControl.address}`
    // );
    // console.log(`PrintDesignData deployed at\n${printDesignData.address}`);
    // console.log(`PrintLibrary deployed at\n${printLibrary.address}`);
    // console.log(`PrintOrderData deployed at\n${printOrderData.address}`);
    // console.log(`PrintSplitsData deployed at\n${printSplitsData.address}`);
    // console.log(`NFTCreator deployed at\n${nFTCreator.address}`);
    // console.log(`CollectionCreator deployed at\n${collectionCreator.address}`);
    // console.log(`MarketCreator deployed at\n${marketCreator.address}`);
    // console.log(
    //   `PrintCommunityData deployed at\n${printCommunityData.address}`
    // );
    // console.log(`CommunityCreator deployed at\n${communityCreator.address}`);
    // console.log(
    //   `ChromadinOpenAction deployed at\n${chromadinOpenAction.address}`
    // );
    // console.log(`CoinOpOpenAction deployed at\n${coinOpOpenAction.address}`);
    // console.log(`LegendRegister deployed at\n${legendRegister.address}`);
    // console.log(`LegendMilestone deployed at\n${legendMilestone.address}`);
    // console.log(`LegendOpenAction deployed at\n${legendOpenAction.address}`);
    // console.log(
    //   `ListenerOpenAction deployed at\n${listenerOpenAction.address}`
    // );

    // await run(`verify:verify`, {
    //   address: "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    // });
    // await run(`verify:verify`, {
    //   address: "0xeD8D361AA83E87Eb0588F59295D45533826FcE86",
    // });
    // await run(`verify:verify`, {
    //   address: "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //   constructorArguments: ["0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4"],
    // });
    // await run(`verify:verify`, {
    //   address: "0x792143D199067a4a40Ac4682d81C957623f7c5c3",
    //   constructorArguments: ["0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4"],
    // });
    // await run(`verify:verify`, {
    //   address: "0x456Dfd81673256c358d79307aC400A9586aECA7B",
    //   constructorArguments: ["0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4"],
    // });

    // await run(`verify:verify`, {
    //   address: "0x3Bb3157F4af00BA61A562A0Ffe9cBfd07388d2b1",
    //   constructorArguments: [
    //     "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //     "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x15448744C11Ee4C8974018B7e7183435187E0Fa1",
    //   constructorArguments: [
    //     "0x3Bb3157F4af00BA61A562A0Ffe9cBfd07388d2b1",
    //     "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //     "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xC2d14bF8B21538183F2Cf0a334d42BA0Bd3233BD",
    //   constructorArguments: [
    //     "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //     "0x456Dfd81673256c358d79307aC400A9586aECA7B",
    //     "0x792143D199067a4a40Ac4682d81C957623f7c5c3",
    //     "0x15448744C11Ee4C8974018B7e7183435187E0Fa1",
    //     "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //     PKP_FIAT,
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xa9A70a87d67B6FC0C72e0799266755a332d43DAf",
    //   constructorArguments: ["0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4"],
    // });
    // await run(`verify:verify`, {
    //   address: "0x3AE1cbbFfa5E011d688E7d48C35710a5842491f",
    //   constructorArguments: [
    //     "0xa9A70a87d67B6FC0C72e0799266755a332d43DAf",
    //     "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //     "0x456Dfd81673256c358d79307aC400A9586aECA7B",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x0eb82Cc9df6DB90fb05aD515B53eC9C5222A08F0",
    //   constructorArguments: [
    //     HUB,
    //     MODULE,
    //     "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //     "0x456Dfd81673256c358d79307aC400A9586aECA7B",
    //     "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //     "0xC2d14bF8B21538183F2Cf0a334d42BA0Bd3233BD",
    //     "0x3AE1cbbFfa5E011d688E7d48C35710a5842491f",
    //     "0xa9A70a87d67B6FC0C72e0799266755a332d43DAf",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x068F3F62c252FE509dFB826515D1b34cAcfCa714",
    //   constructorArguments: [
    //     "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //     "0xc3642Ab0c912874c9D8361074666D6c7187BD8fd",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x20e15dDcFa20Da9a742514F9606C93A8778bb747",
    //   constructorArguments: [
    //     "0x792143D199067a4a40Ac4682d81C957623f7c5c3",
    //     "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //     "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //   ],
    // });

    await run(`verify:verify`, {
      address: "0xEf7a24F490496f9f88078D7C4e7Ce6B8c757859F",
      constructorArguments: [
        "mystringjsoninfo",
        HUB,
        MODULE,
        "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
        "0x456Dfd81673256c358d79307aC400A9586aECA7B",
        "0x813186B4290Ff3240808372b7bB75DBD7881B087",
        "0xC2d14bF8B21538183F2Cf0a334d42BA0Bd3233BD",
        "0x15448744C11Ee4C8974018B7e7183435187E0Fa1",
        "0x068F3F62c252FE509dFB826515D1b34cAcfCa714",
      ],
    });
    // await run(`verify:verify`, {
    //   address: "0x616BBd3F1d09349a9cd32C05621FE04572539A41",
    //   constructorArguments: [
    //     HUB,
    //     MODULE,
    //     "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //     "0x456Dfd81673256c358d79307aC400A9586aECA7B",
    //     "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //     "0xC2d14bF8B21538183F2Cf0a334d42BA0Bd3233BD",
    //     "0x15448744C11Ee4C8974018B7e7183435187E0Fa1",
    //     "0x068F3F62c252FE509dFB826515D1b34cAcfCa714",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x6A1878895AE23375f678dE7E9582F03Aa33c8A80",
    //   constructorArguments: [
    //     HUB,
    //     MODULE,
    //     "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4",
    //     "0x456Dfd81673256c358d79307aC400A9586aECA7B",
    //     "0x813186B4290Ff3240808372b7bB75DBD7881B087",
    //     "0xC2d14bF8B21538183F2Cf0a334d42BA0Bd3233BD",
    //     "0x15448744C11Ee4C8974018B7e7183435187E0Fa1",
    //     "0x068F3F62c252FE509dFB826515D1b34cAcfCa714",
    //   ],
    // });
  } catch (err: any) {
    console.error(err.message);
  }
};

main();

/* Steps

1. Print Design Data
[] set collection creator
[] set nft creator

2. Print Order
[] set market creator

3. Nft creator
[] set collection creator

4. collection creator
[] set market creator

5. community creator
[] set community data 

6. access control
[] add open actions

7. Print Splits
[] Add verified currencies 
[] se tOracle Price USD

8. verify open action modules and MONA and accepted token currencies

*/
