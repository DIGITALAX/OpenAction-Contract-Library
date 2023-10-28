import { ethers, run } from "hardhat";

const HUB = "0xC1E77eE73403B8a7478884915aA599932A677870";
const MODULE = "0x8834aE494ADD3C56d274Fe88243526DBAB15dEF8";
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
    // const LegendOpenAction = await ethers.getContractFactory(
    //   "LegendOpenAction"
    // );
    // const LegendMilestone = await ethers.getContractFactory("LegendMilestone");
    // const LegendRegister = await ethers.getContractFactory("LegendRegister");

    // const printAccessControl = await PrintAccessControl.deploy();
    // const printLibrary = await PrintLibrary.deploy();
    // const printDesignData = await PrintDesignData.deploy(
    //   "0x8489b67f528De6270173ad261B53dFdd533D7419"
    // );
    // const printOrderData = await PrintOrderData.deploy(
    //   printAccessControl.address
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
    //   printAccessControl.address
    // );
    // const marketCreator = await MarketCreator.deploy(
    //   printAccessControl.address,
    //   printSplitsData.address,
    //   printOrderData.address,
    //   collectionCreator.address,
    //   printDesignData.address
    // );
    // const legendRegister = await LegendRegister.deploy(
    //   printAccessControl.address
    // );
    // const legendMilestone = await LegendMilestone.deploy(
    //   legendRegister.address,
    //   printAccessControl.address,
    //   printSplitsData.address
    // );
    // const legendOpenAction = await LegendOpenAction.deploy(
    //   HUB,
    //   MODULE,
    //   "0x8489b67f528De6270173ad261B53dFdd533D7419",
    //   "0x6603eE13D851Fa4A74A99854dc17cD7192e0A21E",
    //   "0xfC043AB048b9C1b359857C89E8aE1a9eeac6c8E2",
    //   "0x543c3556970eb140C61Af964Dd6454811b65cDa7",
    //   "0xa6931B10156721F55e6bd7D8A980254952A78BaA",
    //   "0xDCA5f61037d77188439D519117261ACbC14c3D7D"
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
    // legendRegister.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendMilestone.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

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
    // console.log(`LegendRegister deployed at\n${legendRegister.address}`);
    // console.log(`LegendMilestone deployed at\n${legendMilestone.address}`);
    // console.log(`LegendOpenAction deployed at\n${legendOpenAction.address}`);

    // await run(`verify:verify`, {
    //   address: "0x8489b67f528De6270173ad261B53dFdd533D7419",
    // });
    // await run(`verify:verify`, {
    //   address: "0xD45d47eAb081BBbE07cE4836D48bc768b442E86C",
    // });
    // await run(`verify:verify`, {
    //   address: "0xfC043AB048b9C1b359857C89E8aE1a9eeac6c8E2",
    //   constructorArguments: ["0x8489b67f528De6270173ad261B53dFdd533D7419"],
    // });
    // await run(`verify:verify`, {
    //   address: "0xF7f852c6fB32b780A75B5D965F7D52aF2F560F12",
    //   constructorArguments: ["0x8489b67f528De6270173ad261B53dFdd533D7419"],
    // });
    // await run(`verify:verify`, {
    //   address: "0x6603eE13D851Fa4A74A99854dc17cD7192e0A21E",
    //   constructorArguments: ["0x8489b67f528De6270173ad261B53dFdd533D7419"],
    // });
    // await run(`verify:verify`, {
    //   address: "0xb3a97960B47a3a5480143BB8b91E7260b85E7A2e",
    //   constructorArguments: [
    //     "0x8562907F56E7Af91afb23D13E9DCBCEFbB89cE50",
    //     "0x8489b67f528De6270173ad261B53dFdd533D7419",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0x37d93046Bf2b1D2fEC8F2559f421682491d8C7Ba",
    //   constructorArguments: [
    //     "0xb3a97960B47a3a5480143BB8b91E7260b85E7A2e",
    //     "0x8562907F56E7Af91afb23D13E9DCBCEFbB89cE50",
    //     "0x8489b67f528De6270173ad261B53dFdd533D7419",
    //   ],
    // });
    //  await run(`verify:verify`, {
    //   address: "0x543c3556970eb140C61Af964Dd6454811b65cDa7",
    //   constructorArguments: [
    //     "0x8489b67f528De6270173ad261B53dFdd533D7419",
    //     "0x6603eE13D851Fa4A74A99854dc17cD7192e0A21E",
    //     "0xF7f852c6fB32b780A75B5D965F7D52aF2F560F12",
    //     "0x37d93046Bf2b1D2fEC8F2559f421682491d8C7Ba",
    //     "0x8562907F56E7Af91afb23D13E9DCBCEFbB89cE50",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xDCA5f61037d77188439D519117261ACbC14c3D7D",
    //   constructorArguments: ["0x8489b67f528De6270173ad261B53dFdd533D7419"],
    // });
    // await run(`verify:verify`, {
    //   address: "0xa6931B10156721F55e6bd7D8A980254952A78BaA",
    //   constructorArguments: [
    //     "0xDCA5f61037d77188439D519117261ACbC14c3D7D",
    //     "0x8489b67f528De6270173ad261B53dFdd533D7419",
    //     "0x6603eE13D851Fa4A74A99854dc17cD7192e0A21E",
    //   ],
    // });
    await run(`verify:verify`, {
      address: "0x0eb82Cc9df6DB90fb05aD515B53eC9C5222A08F0",
      constructorArguments: [
        HUB,
        MODULE,
        "0x8489b67f528De6270173ad261B53dFdd533D7419",
        "0x6603eE13D851Fa4A74A99854dc17cD7192e0A21E",
        "0xfC043AB048b9C1b359857C89E8aE1a9eeac6c8E2",
        "0x543c3556970eb140C61Af964Dd6454811b65cDa7",
        "0xa6931B10156721F55e6bd7D8A980254952A78BaA",
        "0xDCA5f61037d77188439D519117261ACbC14c3D7D",
      ],
    });
  } catch (err: any) {
    console.error(err.message);
  }
};

main();
