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
    const F3MOpenAction = await ethers.getContractFactory("F3MOpenAction");

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
    //   printDesignData.address,
    //   printAccessControl.address
    // );
    // const collectionCreator = await CollectionCreator.deploy(
    //   nFTCreator.address,
    //   printDesignData.address,
    //   printAccessControl.address,
    //   printSplitsData.address
    // );
    // const marketCreator = await MarketCreator.deploy(
    //   printAccessControl.address,
    //   printSplitsData.address,
    //   printOrderData.address,
    //   collectionCreator.address,
    //   printDesignData.address,
    //   PKP_FIAT
    // );
    // const communityCreator = await CommunityCreator.deploy(
    //   printOrderData.address,
    //   printAccessControl.address,
    //   printDesignData.address
    // );
    // const printCommunityData = await PrintCommunityData.deploy(
    //   printAccessControl.address,
    //   communityCreator.address
    // );
    // const chromadinOpenAction = await ChromadinOpenAction.deploy(
    //   "ipfs://QmX5reN5N4D9Rqnxog3RxTRyyP3zhiYactF4PHfQkFgGZr",
    //   HUB,
    //   MODULE,
    //   "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //   "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //   "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //   "0xA604aEaDC1D0B7110Dba550e2941f599d0fcB9Fe",
    //   "0x0c585F09765DF503Bf3C83457bC5834FB761E411",
    //   "0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60"
    // );
    // const coinOpOpenAction = await CoinOpOpenAction.deploy(
    //   "ipfs://Qmeq5kckAsaqKJxMPz3GDAMTCbda8LMxX4S1dgVFFSNyb4",
    //   HUB,
    //   MODULE,
    //   "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //   "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //   "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //   "0xA604aEaDC1D0B7110Dba550e2941f599d0fcB9Fe",
    //   "0x0c585F09765DF503Bf3C83457bC5834FB761E411",
    //   "0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60"
    // );
    // const listenerOpenAction = await ListenerOpenAction.deploy(
    //   "ipfs://QmY1Y4hG1DZCGAm6VVCZSjVKS6rkZaQ3nVYqCTmTazmT6E",
    //   HUB,
    //   MODULE,
    //   "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //   "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //   "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //   "0xA604aEaDC1D0B7110Dba550e2941f599d0fcB9Fe",
    //   "0x0c585F09765DF503Bf3C83457bC5834FB761E411",
    //   "0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60"
    // );
    // const f3MOpenAction = await F3MOpenAction.deploy(
    //   "ipfs://QmZ69yjcqwYgU3PmcsjWaaE8CiwXBg66uLZuJyGm8Yu7HM",
    //   HUB,
    //   MODULE,
    //   "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //   "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //   "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //   "0xA604aEaDC1D0B7110Dba550e2941f599d0fcB9Fe",
    //   "0x0c585F09765DF503Bf3C83457bC5834FB761E411",
    //   "0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60"
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
    // f3MOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

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
    // console.log(`F3MOpenAction deployed at\n${f3MOpenAction.address}`);
    // console.log(`LegendRegister deployed at\n${legendRegister.address}`);
    // console.log(`LegendMilestone deployed at\n${legendMilestone.address}`);
    // console.log(`LegendOpenAction deployed at\n${legendOpenAction.address}`);

    // await run(`verify:verify`, {
    //   address: "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    // });
    // await run(`verify:verify`, {
    //   address: "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //   constructorArguments: ["0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E"],
    // });
    // await run(`verify:verify`, {
    //   address: "0xe52255fc34d15BA807D4f2eb0e022cD97aDA7767",
    //   constructorArguments: [
    //     "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //     "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //   constructorArguments: ["0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E"],
    // });
    // await run(`verify:verify`, {
    //   address: "0x0147435c505390Bb1E657c8EBc373DcEdfDe0F08",
    //   constructorArguments: [
    //     "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //     "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x0c585F09765DF503Bf3C83457bC5834FB761E411",
    //   constructorArguments: [
    //     "0x0147435c505390Bb1E657c8EBc373DcEdfDe0F08",
    //     "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //     "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //     "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xA604aEaDC1D0B7110Dba550e2941f599d0fcB9Fe",
    //   constructorArguments: [
    //     "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //     "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //     "0xe52255fc34d15BA807D4f2eb0e022cD97aDA7767",
    //     "0x0c585F09765DF503Bf3C83457bC5834FB761E411",
    //     "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //     PKP_FIAT,
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xECfcE204821c52C58CCdB5FE44852058B906a0b3",
    //   constructorArguments: [
    //     "0xe52255fc34d15BA807D4f2eb0e022cD97aDA7767",
    //     "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //     "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //   ],
    // });

    // await run(`verify:verify`, {
    //   address: "0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60",
    //   constructorArguments: [
    //     "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //     "0xECfcE204821c52C58CCdB5FE44852058B906a0b3",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x98E067473497B7E7A979A7Fe0D1026D9aeDF3bc3",
    //   constructorArguments: [
    //     "ipfs://QmX5reN5N4D9Rqnxog3RxTRyyP3zhiYactF4PHfQkFgGZr",
    //     HUB,
    //     MODULE,
    //     "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //     "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //     "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //     "0xA604aEaDC1D0B7110Dba550e2941f599d0fcB9Fe",
    //     "0x0c585F09765DF503Bf3C83457bC5834FB761E411",
    //     "0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x179ACb90575CfF001c6c767b197FFe100B6ADc3a",
    //   constructorArguments: [
    //     "ipfs://Qmeq5kckAsaqKJxMPz3GDAMTCbda8LMxX4S1dgVFFSNyb4",
    //     HUB,
    //     MODULE,
    //     "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //     "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //     "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //     "0xA604aEaDC1D0B7110Dba550e2941f599d0fcB9Fe",
    //     "0x0c585F09765DF503Bf3C83457bC5834FB761E411",
    //     "0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xF1e111fD643954234d6C8482fFa5f4dE778e7aD6",
    //   constructorArguments: [
    //     "ipfs://QmY1Y4hG1DZCGAm6VVCZSjVKS6rkZaQ3nVYqCTmTazmT6E",
    //     HUB,
    //     MODULE,
    //     "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //     "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //     "0x062aA8B94a308fE84bE7974bAC758bC574145907",
    //     "0xA604aEaDC1D0B7110Dba550e2941f599d0fcB9Fe",
    //     "0x0c585F09765DF503Bf3C83457bC5834FB761E411",
    //     "0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xb92725B5Bea87C7Ed856898AaC3122548aBA6349",
    //   constructorArguments: [
    //     "ipfs://QmZ69yjcqwYgU3PmcsjWaaE8CiwXBg66uLZuJyGm8Yu7HM",
    //     HUB,
    //     MODULE,
    //     "0x4931896d9bF48C670FAb6f1b6189DDC122Ff7e2E",
    //     "0xeB5116025E17D2E6E27126C104cb455dCa63460D",
    //     "0x75657a8cddF42Fd6BA01Ec5C4eA2C276efb9438F",
    //     "0xA604aEaDC1D0B7110Dba550e2941f599d0fcB9Fe",
    //     "0x0c585F09765DF503Bf3C83457bC5834FB761E411",
    //     "0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60",
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
