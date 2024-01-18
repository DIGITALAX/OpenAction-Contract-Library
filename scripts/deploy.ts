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
    // const LegendData = await ethers.getContractFactory("LegendData");

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
    //   "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //   "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //   "0xB2855fC6577CBbd9f71A6A8e992a71e4eEB19809",
    //   "0xBa75ec6B4660063817C190e08AC635d174076D0B",
    //   "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //   PKP_FIAT
    // );
    // const communityCreator = await CommunityCreator.deploy(
    //   "0xB2855fC6577CBbd9f71A6A8e992a71e4eEB19809",
    //   "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //   "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    // );
    // const printCommunityData = await PrintCommunityData.deploy(
    //   "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //   communityCreator.address
    // );
    // const chromadinOpenAction = await ChromadinOpenAction.deploy(
    //   "ipfs://QmdRqPYtBP1Vkxy6tLmfUmrYR31xawrxcYnhFjY9q1hF4g",
    //   HUB,
    //   MODULE,
    //   "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //   "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //   "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //   "0xc86f5C3101b64A8873842A26A78dB399e827855e",
    //   "0xBa75ec6B4660063817C190e08AC635d174076D0B",
    //   "0x747f62E5A7DEC0f3B20326a78AfC2A30d2478433"
    // );
    // const coinOpOpenAction = await CoinOpOpenAction.deploy(
    //   "ipfs://QmTrXPiMHYVtHNaMQ7LpfQkBJUe8uyHyjzxh9f8kdXsqyU",
    //   HUB,
    //   MODULE,
    //   "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //   "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //   "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //   "0xc86f5C3101b64A8873842A26A78dB399e827855e",
    //   "0xBa75ec6B4660063817C190e08AC635d174076D0B",
    //   "0x747f62E5A7DEC0f3B20326a78AfC2A30d2478433"
    // );
    // const listenerOpenAction = await ListenerOpenAction.deploy(
    //   "ipfs://QmTMDXC3Sd1ViFNLWNpRg6KdRsDoZYFQ97gmuoJjHJHevS",
    //   HUB,
    //   MODULE,
    //   "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //   "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //   "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //   "0xc86f5C3101b64A8873842A26A78dB399e827855e",
    //   "0xBa75ec6B4660063817C190e08AC635d174076D0B",
    //   "0x747f62E5A7DEC0f3B20326a78AfC2A30d2478433"
    // );
    // const f3MOpenAction = await F3MOpenAction.deploy(
    //   "ipfs://QmdfoEvX3DJPGc6SJhSMfUmDhi8S5QsWfJ4R9pqetL1jiK",
    //   HUB,
    //   MODULE,
    //   "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //   "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //   "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //   "0xc86f5C3101b64A8873842A26A78dB399e827855e",
    //   "0xBa75ec6B4660063817C190e08AC635d174076D0B",
    //   "0x747f62E5A7DEC0f3B20326a78AfC2A30d2478433"
    // );
    // const legendData = await LegendData.deploy(
    //   "0xCF96CeeB6745a9374A8391ED51aF02CddFFacAf4"
    // );
    // const legendMilestone = await LegendMilestone.deploy(
    //   legendData.address,
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
    //   legendData.address
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

    // legendData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
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
    // console.log(`LegendData deployed at\n${legendData.address}`);
    // console.log(`LegendMilestone deployed at\n${legendMilestone.address}`);
    // console.log(`LegendOpenAction deployed at\n${legendOpenAction.address}`);

    // await run(`verify:verify`, {
    //   address: "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    // });
    // await run(`verify:verify`, {
    //   address: "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //   constructorArguments: ["0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55"],
    // });
    // await run(`verify:verify`, {
    //   address: "0xB2855fC6577CBbd9f71A6A8e992a71e4eEB19809",
    //   constructorArguments: [
    //     "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //     "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //   constructorArguments: ["0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55"],
    // });
    // await run(`verify:verify`, {
    //   address: "0x63D98B34BbED5D924E30A84018E860AF75431356",
    //   constructorArguments: [
    //     "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //     "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xBa75ec6B4660063817C190e08AC635d174076D0B",
    //   constructorArguments: [
    //     "0x63D98B34BbED5D924E30A84018E860AF75431356",
    //     "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //     "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //     "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xc86f5C3101b64A8873842A26A78dB399e827855e",
    //   constructorArguments: [
    //     "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //     "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //     "0xB2855fC6577CBbd9f71A6A8e992a71e4eEB19809",
    //     "0xBa75ec6B4660063817C190e08AC635d174076D0B",
    //     "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //     PKP_FIAT,
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x1fD1f5aC83Beeac86452Eb8D6C87df43C7a826d0",
    //   constructorArguments: [
    //     "0xB2855fC6577CBbd9f71A6A8e992a71e4eEB19809",
    //     "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //     "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //   ],
    // });

    // await run(`verify:verify`, {
    //   address: "0x747f62E5A7DEC0f3B20326a78AfC2A30d2478433",
    //   constructorArguments: [
    //     "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //     "0x1fD1f5aC83Beeac86452Eb8D6C87df43C7a826d0",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x9A94C316F644D10641A528904e4a030a77498160",
    //   constructorArguments: [
    //     "ipfs://QmdRqPYtBP1Vkxy6tLmfUmrYR31xawrxcYnhFjY9q1hF4g",
    //     HUB,
    //     MODULE,
    //     "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //     "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //     "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //     "0xc86f5C3101b64A8873842A26A78dB399e827855e",
    //     "0xBa75ec6B4660063817C190e08AC635d174076D0B",
    //     "0x747f62E5A7DEC0f3B20326a78AfC2A30d2478433",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x3710f718f9E78a58FEcfF5Cd9cc41a4b7466BB14",
    //   constructorArguments: [
    //     "ipfs://QmTrXPiMHYVtHNaMQ7LpfQkBJUe8uyHyjzxh9f8kdXsqyU",
    //     HUB,
    //     MODULE,
    //     "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //     "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //     "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //     "0xc86f5C3101b64A8873842A26A78dB399e827855e",
    //     "0xBa75ec6B4660063817C190e08AC635d174076D0B",
    //     "0x747f62E5A7DEC0f3B20326a78AfC2A30d2478433",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x06BB03BAe0dE9A6808cd9AF9c9C3ec8F59e6FE39",
    //   constructorArguments: [
    //     "ipfs://QmTMDXC3Sd1ViFNLWNpRg6KdRsDoZYFQ97gmuoJjHJHevS",
    //     HUB,
    //     MODULE,
    //     "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
    //     "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //     "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //     "0xc86f5C3101b64A8873842A26A78dB399e827855e",
    //     "0xBa75ec6B4660063817C190e08AC635d174076D0B",
    //     "0x747f62E5A7DEC0f3B20326a78AfC2A30d2478433",
    //   ],
    // });
    await run(`verify:verify`, {
      address: "0xba6a85811336781Bad55E624C40Dc1D5615243C7",
      constructorArguments: [
        "ipfs://QmdfoEvX3DJPGc6SJhSMfUmDhi8S5QsWfJ4R9pqetL1jiK",
        HUB,
        MODULE,
        "0xd1e60b639e3c67b64e6f5de44aa079cf9b79ac55",
        "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
        "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
        "0xc86f5C3101b64A8873842A26A78dB399e827855e",
        "0xBa75ec6B4660063817C190e08AC635d174076D0B",
        "0x747f62E5A7DEC0f3B20326a78AfC2A30d2478433",
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
