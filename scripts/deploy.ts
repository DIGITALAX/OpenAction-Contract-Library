import { ethers, run } from "hardhat";

const HUB = "0x4fbffF20302F3326B20052ab9C217C44F6480900";
const MODULE = "0x4BeB63842BB800A1Da77a62F2c74dE3CA39AF7C0";
const PKP_FIAT = "0x8834aE494ADD3C56d274Fe88243526DBAB15dEF8";
const main = async () => {
  try {
    const PrintAccessControl = await ethers.getContractFactory(
      "PrintAccessControl"
    );
    const PrintDesignData = await ethers.getContractFactory("PrintDesignData");
    const PrintOrderData = await ethers.getContractFactory("PrintOrderData");
    const PrintSplitsData = await ethers.getContractFactory("PrintSplitsData");
    const NFTCreator = await ethers.getContractFactory("NFTCreator");
    const CollectionCreator = await ethers.getContractFactory(
      "CollectionCreator"
    );
    const MarketCreator = await ethers.getContractFactory("MarketCreator");
    const PrintCommunityData = await ethers.getContractFactory(
      "PrintCommunityData"
    );
    const CommunityCreator = await ethers.getContractFactory(
      "CommunityCreator"
    );
    const ChromadinOpenAction = await ethers.getContractFactory(
      "ChromadinOpenAction"
    );
    const CoinOpOpenAction = await ethers.getContractFactory(
      "CoinOpOpenAction"
    );
    const ListenerOpenAction = await ethers.getContractFactory(
      "ListenerOpenAction"
    );

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
    //   printAccessControl.address,
    //   printDesignData.address
    // );
    // const printSplitsData = await PrintSplitsData.deploy(
    //   printAccessControl.address
    // );
    // const nFTCreator = await NFTCreator.deploy(
    //   "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60"
    // );
    // const collectionCreator = await CollectionCreator.deploy(
    //   nFTCreator.address,
    //   "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //   "0xa6466180387940CAc6467CCc0242D4B19A24e6BE"
    // );
    // const marketCreator = await MarketCreator.deploy(
    //   "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //   "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //   "0x808602378312f34c53D806C3b4dEFBdF33245134",
    //   collectionCreator.address,
    //   "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   PKP_FIAT
    // );
    // const communityCreator = await CommunityCreator.deploy(
    //   "0x808602378312f34c53D806C3b4dEFBdF33245134",
    //   "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //   "0x597772c9c0EfE354976B0068296dFcb03583C2be"
    // );
    // const printCommunityData = await PrintCommunityData.deploy(
    //   "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //   "0x0cA150070b99B85B0AF48ed09BBe8a043E256b20"
    // );
    // const chromadinOpenAction = await ChromadinOpenAction.deploy(
    //   "mystringjsoninfo",
    //   HUB,
    //   MODULE,
    //   "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //   "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //   "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
    //   "0x54f621Eaa2a908B259B3c7a8d8afe3290a2e14F1",
    //   printCommunityData.address
    // );
    // const coinOpOpenAction = await CoinOpOpenAction.deploy(
    //   "mystringjsoninfo",
    //   HUB,
    //   MODULE,
    //   "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //   "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //   "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
    //   "0x54f621Eaa2a908B259B3c7a8d8afe3290a2e14F1",
    //   "0x8fEc6133D9Ba8BF2112f524081a6959a832613E4"
    // );
    // const listenerOpenAction = await ListenerOpenAction.deploy(
    //   "mystringjsoninfo",
    //   HUB,
    //   MODULE,
    //   "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //   "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //   "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
    //   "0x54f621Eaa2a908B259B3c7a8d8afe3290a2e14F1",
    //   "0x8fEc6133D9Ba8BF2112f524081a6959a832613E4"
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
    //   address: "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    // });
    // await run(`verify:verify`, {
    //   address: "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   constructorArguments: ["0xbC7CeB31979f2DbF77F4B3133366A0378C922B60"],
    // });
    // await run(`verify:verify`, {
    //   address: "0x808602378312f34c53D806C3b4dEFBdF33245134",
    //   constructorArguments: [
    //     "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //     "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //   constructorArguments: ["0xbC7CeB31979f2DbF77F4B3133366A0378C922B60"],
    // });
    // await run(`verify:verify`, {
    //   address: "0x54f621Eaa2a908B259B3c7a8d8afe3290a2e14F1",
    //   constructorArguments: [
    //     "0x5B714F8eb491453f9cb9D5c4Ba698b34E9b8c0f0",
    //     "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //     "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //     "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //   ],
    // });

    // await run(`verify:verify`, {
    //   address: "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
    //   constructorArguments: [
    //     "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //     "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //     "0x808602378312f34c53D806C3b4dEFBdF33245134",
    //     "0x54f621Eaa2a908B259B3c7a8d8afe3290a2e14F1",
    //     "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //     PKP_FIAT,
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x0cA150070b99B85B0AF48ed09BBe8a043E256b20",
    //   constructorArguments: [
    //     "0x808602378312f34c53D806C3b4dEFBdF33245134",
    //     "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //     "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x5B714F8eb491453f9cb9D5c4Ba698b34E9b8c0f0",
    //   constructorArguments: [
    //     "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //     "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x8fEc6133D9Ba8BF2112f524081a6959a832613E4",
    //   constructorArguments: [
    //     "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //     "0x0cA150070b99B85B0AF48ed09BBe8a043E256b20",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x23Bace2E9571B7A8598c3314e5f0d8C12DBc674A",
    //   constructorArguments: [
    //     "mystringjsoninfo",
    //     HUB,
    //     MODULE,
    //     "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
    //     "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //     "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //     "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
    //     "0x54f621Eaa2a908B259B3c7a8d8afe3290a2e14F1",
    //     "0x8fEc6133D9Ba8BF2112f524081a6959a832613E4",
    //   ],
    // });
    await run(`verify:verify`, {
      address: "0xB7F7cAAf50Bff0d53E5a66134ed218C3B77555F9",
      constructorArguments: [
        "mystringjsoninfo",
        HUB,
        MODULE,
        "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
        "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
        "0x597772c9c0EfE354976B0068296dFcb03583C2be",
        "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
        "0x54f621Eaa2a908B259B3c7a8d8afe3290a2e14F1",
        "0x8fEc6133D9Ba8BF2112f524081a6959a832613E4",
      ],
    });
    await run(`verify:verify`, {
      address: "0x9785444E0C3718B499226b89CFb002AB6F31Fc15",
      constructorArguments: [
        "mystringjsoninfo",
        HUB,
        MODULE,
        "0xbC7CeB31979f2DbF77F4B3133366A0378C922B60",
        "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
        "0x597772c9c0EfE354976B0068296dFcb03583C2be",
        "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
        "0x54f621Eaa2a908B259B3c7a8d8afe3290a2e14F1",
        "0x8fEc6133D9Ba8BF2112f524081a6959a832613E4",
      ],
    });
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
