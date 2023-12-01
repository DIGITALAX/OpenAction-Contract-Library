import { ethers, run } from "hardhat";

const HUB_MUMBAI = "0x4fbffF20302F3326B20052ab9C217C44F6480900";
const HUB = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
const MODULE_MUMBAI = "0x4BeB63842BB800A1Da77a62F2c74dE3CA39AF7C0";
const MODULE = "0x1eD5983F0c883B96f7C35528a1e22EEA67DE3Ff9";
const PKP_FIAT = "0xA1f096b5E04b89f6FF191fEe23Af01e79f1bd84e";
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
    //   "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //   "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7"
    // );
    // const collectionCreator = await CollectionCreator.deploy(
    //   nFTCreator.address,
    //   "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //   "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //   "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A"
    // );
    // const marketCreator = await MarketCreator.deploy(
    //   "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //   "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A",
    //   "0xa6be95a639Ab4bEbb8D1b9203FC4cED7db23D4c2",
    //   collectionCreator.address,
    //   "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //   PKP_FIAT
    // );
    // const communityCreator = await CommunityCreator.deploy(
    //   "0xa6be95a639Ab4bEbb8D1b9203FC4cED7db23D4c2",
    //   "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //   "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F"
    // );
    // const printCommunityData = await PrintCommunityData.deploy(
    //   "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //   "0x64c86C41144839fA957DDD953348B011c1FF440b"
    // );
    // const chromadinOpenAction = await ChromadinOpenAction.deploy(
    //   "Chromadin Open Action",
    //   HUB,
    //   MODULE,
    //   "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //   "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A",
    //   "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //   "0x21607110b7E588d15701B3873cd0b48406427655",
    //   "0x79bd5f61dC3f0B33Cba544FDEBAC00Ce0d1a4e04",
    //   printCommunityData.address
    // );
    // const coinOpOpenAction = await CoinOpOpenAction.deploy(
    //   "Coin Op Open Action",
    //   HUB,
    //   MODULE,
    //   "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //   "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A",
    //   "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //   "0x21607110b7E588d15701B3873cd0b48406427655",
    //   "0x79bd5f61dC3f0B33Cba544FDEBAC00Ce0d1a4e04",
    //   "0x2D861E653314f74746Ae1aE86cf3f84B884fbEd9"
    // );
    // const listenerOpenAction = await ListenerOpenAction.deploy(
    //   "Lit Listener Open Action",
    //   HUB,
    //   MODULE,
    //   "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //   "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A",
    //   "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //   "0x21607110b7E588d15701B3873cd0b48406427655",
    //   "0x79bd5f61dC3f0B33Cba544FDEBAC00Ce0d1a4e04",
    //   "0x2D861E653314f74746Ae1aE86cf3f84B884fbEd9"
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
    //   address: "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    // });
    // await run(`verify:verify`, {
    //   address: "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //   constructorArguments: ["0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7"],
    // });
    // await run(`verify:verify`, {
    //   address: "0xa6be95a639Ab4bEbb8D1b9203FC4cED7db23D4c2",
    //   constructorArguments: [
    //     "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //     "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A",
    //   constructorArguments: ["0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7"],
    // });
    // await run(`verify:verify`, {
    //   address: "0x3D92B16Bb20A740C5dDcaEda305A7c16B2DdC580",
    //   constructorArguments: [
    //     "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //     "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x79bd5f61dC3f0B33Cba544FDEBAC00Ce0d1a4e04",
    //   constructorArguments: [
    //     "0x3D92B16Bb20A740C5dDcaEda305A7c16B2DdC580",
    //     "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //     "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //     "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x21607110b7E588d15701B3873cd0b48406427655",
    //   constructorArguments: [
    //     "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //     "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A",
    //     "0xa6be95a639Ab4bEbb8D1b9203FC4cED7db23D4c2",
    //     "0x79bd5f61dC3f0B33Cba544FDEBAC00Ce0d1a4e04",
    //     "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //     PKP_FIAT,
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x64c86C41144839fA957DDD953348B011c1FF440b",
    //   constructorArguments: [
    //     "0xa6be95a639Ab4bEbb8D1b9203FC4cED7db23D4c2",
    //     "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //     "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //   ],
    // });

    // await run(`verify:verify`, {
    //   address: "0x2D861E653314f74746Ae1aE86cf3f84B884fbEd9",
    //   constructorArguments: [
    //     "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //     "0x64c86C41144839fA957DDD953348B011c1FF440b",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x5a2C88948Ce8d9ba7a5EE8185cC60c70E4e9029a",
    //   constructorArguments: [
    //     "Chromadin Open Action",
    //     HUB,
    //     MODULE,
    //     "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
    //     "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A",
    //     "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //     "0x21607110b7E588d15701B3873cd0b48406427655",
    //     "0x79bd5f61dC3f0B33Cba544FDEBAC00Ce0d1a4e04",
    //     "0x2D861E653314f74746Ae1aE86cf3f84B884fbEd9"
    //   ],
    // });
    await run(`verify:verify`, {
      address: "0x5515aEc4dE195Fd7effEA443b7A5D39025Effc0f",
      constructorArguments: [
        "Coin Op Open Action",
        HUB,
        MODULE,
        "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
        "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A",
        "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
        "0x21607110b7E588d15701B3873cd0b48406427655",
        "0x79bd5f61dC3f0B33Cba544FDEBAC00Ce0d1a4e04",
        "0x2D861E653314f74746Ae1aE86cf3f84B884fbEd9",
      ],
    });
    await run(`verify:verify`, {
      address: "0x897fD9cBC9b5aC57F2594231F25EB24BcF577ea2",
      constructorArguments: [
        "Lit Listener Open Action",
        HUB,
        MODULE,
        "0xBA362C1c23cA0F69E5926e64145cBBf06a46A1B7",
        "0x546Ca148D2d63Ab3d269a8eFea871961C4EbB34A",
        "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
        "0x21607110b7E588d15701B3873cd0b48406427655",
        "0x79bd5f61dC3f0B33Cba544FDEBAC00Ce0d1a4e04",
        "0x2D861E653314f74746Ae1aE86cf3f84B884fbEd9",
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
