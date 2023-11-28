import { ethers, run } from "hardhat";

const HUB = "0x4fbffF20302F3326B20052ab9C217C44F6480900";
const MODULE = "0x4BeB63842BB800A1Da77a62F2c74dE3CA39AF7C0";
const PKP_FIAT = "0x8834aE494ADD3C56d274Fe88243526DBAB15dEF8";
const main = async () => {
  try {
    // const PrintAccessControl = await ethers.getContractFactory(
    //   "PrintAccessControl"
    // );
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
    // const ListenerOpenAction = await ethers.getContractFactory(
    //   "ListenerOpenAction"
    // );

    // const LegendOpenAction = await ethers.getContractFactory(
    //   "LegendOpenAction"
    // );
    // const LegendMilestone = await ethers.getContractFactory("LegendMilestone");
    // const LegendRegister = await ethers.getContractFactory("LegendRegister");

    // const printAccessControl = await PrintAccessControl.deploy();
    // const printDesignData = await PrintDesignData.deploy(
    //   printAccessControl.address
    // );
    // const printOrderData = await PrintOrderData.deploy(
    //   "0xd140356e35930a15943757A276D72487E7e77746",
    //   "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE"
    // );
    // const printSplitsData = await PrintSplitsData.deploy(
    //   printAccessControl.address
    // );
    // const nFTCreator = await NFTCreator.deploy(
    //   "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //   "0xd140356e35930a15943757A276D72487E7e77746"
    // );
    // const collectionCreator = await CollectionCreator.deploy(
    //   nFTCreator.address,
    //   "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //   "0xd140356e35930a15943757A276D72487E7e77746",
    //   "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD"
    // );
    // const marketCreator = await MarketCreator.deploy(
    //   "0xd140356e35930a15943757A276D72487E7e77746",
    //   "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD",
    //   "0x0cFbdC285A8C4f2D95660da5B67f10aEB61fe029",
    //   collectionCreator.address,
    //   "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //   PKP_FIAT
    // );
    // const communityCreator = await CommunityCreator.deploy(
    //   "0x0cFbdC285A8C4f2D95660da5B67f10aEB61fe029",
    //   "0xd140356e35930a15943757A276D72487E7e77746",
    //   "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE"
    // );
    // const printCommunityData = await PrintCommunityData.deploy(
    //   "0xd140356e35930a15943757A276D72487E7e77746",
    //   "0x22Cb3b5A41B17Cb455C827d81b2A6Bc11F4B1d11"
    // );
    // const chromadinOpenAction = await ChromadinOpenAction.deploy(
    //   "mystringjsoninfo",
    //   HUB,
    //   MODULE,
    //   "0xd140356e35930a15943757A276D72487E7e77746",
    //   "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD",
    //   "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //   "0x81d8C7f6c30ab10815ecd3B83548Bbc1a3a9c3Fb",
    //   "0xb40009a0aEAe4d01a539E8Acd56A6893F65c19d3",
    //   printCommunityData.address
    // );
    // const coinOpOpenAction = await CoinOpOpenAction.deploy(
    //   "mystringjsoninfo",
    //   HUB,
    //   MODULE,
    //   "0xd140356e35930a15943757A276D72487E7e77746",
    //   "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD",
    //   "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //   "0x81d8C7f6c30ab10815ecd3B83548Bbc1a3a9c3Fb",
    //   "0xb40009a0aEAe4d01a539E8Acd56A6893F65c19d3",
    //   printCommunityData.address
    // );
    // const listenerOpenAction = await ListenerOpenAction.deploy(
    //   "mystringjsoninfo",
    //   HUB,
    //   MODULE,
    //   "0xd140356e35930a15943757A276D72487E7e77746",
    //   "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD",
    //   "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //   "0x81d8C7f6c30ab10815ecd3B83548Bbc1a3a9c3Fb",
    //   "0xb40009a0aEAe4d01a539E8Acd56A6893F65c19d3",
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

    const WAIT_BLOCK_CONFIRMATIONS = 20;
    // printAccessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // printDesignData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // printOrderData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // printSplitsData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // nFTCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // collectionCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // marketCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // communityCreator.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // printCommunityData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // chromadinOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // coinOpOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // listenerOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

    // legendRegister.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendMilestone.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // console.log(
    //   `PrintAccessControl deployed at\n${printAccessControl.address}`
    // );
    // console.log(`PrintDesignData deployed at\n${printDesignData.address}`);
    // console.log(`PrintOrderData deployed at\n${printOrderData.address}`);
    // console.log(`PrintSplitsData deployed at\n${printSplitsData.address}`);
    // console.log(`NFTCreator deployed at\n${nFTCreator.address}`);
    // console.log(`CollectionCreator deployed at\n${collectionCreator.address}`);
    // console.log(`MarketCreator deployed at\n${marketCreator.address}`);
    // console.log(`CommunityCreator deployed at\n${communityCreator.address}`);
    // console.log(
    //   `PrintCommunityData deployed at\n${printCommunityData.address}`
    // );
    // console.log(
    //   `ChromadinOpenAction deployed at\n${chromadinOpenAction.address}`
    // );
    // console.log(`CoinOpOpenAction deployed at\n${coinOpOpenAction.address}`);
    // console.log(
    //   `ListenerOpenAction deployed at\n${listenerOpenAction.address}`
    // );
    // console.log(`LegendRegister deployed at\n${legendRegister.address}`);
    // console.log(`LegendMilestone deployed at\n${legendMilestone.address}`);
    // console.log(`LegendOpenAction deployed at\n${legendOpenAction.address}`);

    // await run(`verify:verify`, {
    //   address: "0xd140356e35930a15943757A276D72487E7e77746",
    // });
    // await run(`verify:verify`, {
    //   address: "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //   constructorArguments: ["0xd140356e35930a15943757A276D72487E7e77746"],
    // });
    await run(`verify:verify`, {
      address: "0xea233D71243E9e3B16dB2CF3b265C35D00cf71d6",
      constructorArguments: [
        "0xd140356e35930a15943757A276D72487E7e77746",
        "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
      ],
    });
    // await run(`verify:verify`, {
    //   address: "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD",
    //   constructorArguments: ["0xd140356e35930a15943757A276D72487E7e77746"],
    // });
    // await run(`verify:verify`, {
    //   address: "0xc9C77d0ad2E881397b2Ad5f38Aa20bDb04A5c35c",
    //   constructorArguments: [
    //     "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //     "0xd140356e35930a15943757A276D72487E7e77746",
    //   ],
    // });

    // await run(`verify:verify`, {
    //   address: "0xb40009a0aEAe4d01a539E8Acd56A6893F65c19d3",
    //   constructorArguments: [
    //     "0xc9C77d0ad2E881397b2Ad5f38Aa20bDb04A5c35c",
    //     "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //     "0xd140356e35930a15943757A276D72487E7e77746",
    //     "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x81d8C7f6c30ab10815ecd3B83548Bbc1a3a9c3Fb",
    //   constructorArguments: [
    //     "0xd140356e35930a15943757A276D72487E7e77746",
    //     "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD",
    //     "0x0cFbdC285A8C4f2D95660da5B67f10aEB61fe029",
    //     "0xb40009a0aEAe4d01a539E8Acd56A6893F65c19d3",
    //     "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //     PKP_FIAT,
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x22Cb3b5A41B17Cb455C827d81b2A6Bc11F4B1d11",
    //   constructorArguments: [
    //     "0x0cFbdC285A8C4f2D95660da5B67f10aEB61fe029",
    //     "0xd140356e35930a15943757A276D72487E7e77746",
    //     "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //   ],
    // });

    // await run(`verify:verify`, {
    //   address: "0xBAeD632166cb30bdA9391212708A2B504fab74e7",
    //   constructorArguments: [
    //     "0xd140356e35930a15943757A276D72487E7e77746",
    //     "0x22Cb3b5A41B17Cb455C827d81b2A6Bc11F4B1d11"
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x565eCEd13C8c93Dd204bb4A3C6852f5F8A97Ad12",
    //   constructorArguments: [
    //     "mystringjsoninfo",
    //     HUB,
    //     MODULE,
    //     "0xd140356e35930a15943757A276D72487E7e77746",
    //     "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD",
    //     "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //     "0x81d8C7f6c30ab10815ecd3B83548Bbc1a3a9c3Fb",
    //     "0xb40009a0aEAe4d01a539E8Acd56A6893F65c19d3",
    //     printCommunityData.address
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x35EB473bc7df000D5730d289D6b695217d5470C4",
    //   constructorArguments: [
    //     "mystringjsoninfo",
    //     HUB,
    //     MODULE,
    //     "0xd140356e35930a15943757A276D72487E7e77746",
    //     "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD",
    //     "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //     "0x81d8C7f6c30ab10815ecd3B83548Bbc1a3a9c3Fb",
    //     "0xb40009a0aEAe4d01a539E8Acd56A6893F65c19d3",
    //     printCommunityData.address
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xff67A1a26CC6a9Cf8CEc5Bf55F7EBFfEA99D56D0",
    //   constructorArguments: [
    //     "mystringjsoninfo",
    //     HUB,
    //     MODULE,
    //     "0xd140356e35930a15943757A276D72487E7e77746",
    //     "0x0682F7ef679478cb37bfBE2239D6D8DdB0b18DFD",
    //     "0x5a414dC38877198864Ed1c5B299DA19BBe30E5EE",
    //     "0x81d8C7f6c30ab10815ecd3B83548Bbc1a3a9c3Fb",
    //     "0xb40009a0aEAe4d01a539E8Acd56A6893F65c19d3",
    //     printCommunityData.address
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
[] set Oracle Price USD
[] add fulfiller coinop split
 
8. verify open action modules and MONA and accepted token currencies with lens contracts!

*/
