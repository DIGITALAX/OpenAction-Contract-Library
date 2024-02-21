import { ethers, run } from "hardhat";

const HUB_MUMBAI = "0x4fbffF20302F3326B20052ab9C217C44F6480900";
const HUB = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";
const MODULE_MUMBAI = "0x4BeB63842BB800A1Da77a62F2c74dE3CA39AF7C0";
const MODULE = "0x1eD5983F0c883B96f7C35528a1e22EEA67DE3Ff9";
const ROUTER_MUMBAI = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const main = async () => {
  try {
    // const LegendAccessControl = await ethers.getContractFactory(
    //   "LegendAccessControl"
    // );
    // const MachineAccessControl = await ethers.getContractFactory(
    //   "MachineAccessControl"
    // );
    const LegendMachineCreditSwap = await ethers.getContractFactory(
      "LegendMachineCreditSwap"
    );
    // const LegendMilestoneEscrow = await ethers.getContractFactory(
    //   "LegendMilestoneEscrow"
    // );
    // const LegendData = await ethers.getContractFactory("LegendData");
    // const LegendOpenAction = await ethers.getContractFactory(
    //   "LegendOpenAction"
    // );

    // const machineAccessControl = await MachineAccessControl.deploy();
    // const legendMachineCreditSwap = await LegendMachineCreditSwap.deploy(
    //   "0x66063E2039582605395af6a0D76B301dfeB7be6E",
    //   ROUTER_MUMBAI
    // );
    // const legendAccessControl = await LegendAccessControl.deploy();
    // const legendData = await LegendData.deploy(legendAccessControl.address);
    // const legendMilestoneEscrow = await LegendMilestoneEscrow.deploy(
    //   legendData.address,
    //   legendAccessControl.address,
    //   legendMachineCreditSwap.address
    // );
    // const legendOpenAction = await LegendOpenAction.deploy(
    //   "metadataDetails",
    //   HUB_MUMBAI,
    //   MODULE_MUMBAI,
    //   "0x10633a3d3F11961720174c91d1CD486F268a0DA1",
    //   "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //   "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
    //   "0xF28DeC032760312A4C998935839b1589437Ab5aB",
    //   "0x3e67D114560ef87FBeDf07E631336cd1F3e002fD"
    // );

    const WAIT_BLOCK_CONFIRMATIONS = 20;

    // legendData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendMilestoneEscrow.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // machineAccessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendMachineCreditSwap.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendAccessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

    // console.log(
    //   `LegendAccessControl deployed at\n${legendAccessControl.address}`
    // );
    // console.log(`LegendData deployed at\n${legendData.address}`);
    // console.log(
    //   `LegendMilestoneEscrow deployed at\n${legendMilestoneEscrow.address}`
    // );
    // console.log(`LegendOpenAction deployed at\n${legendOpenAction.address}`);
    // console.log(
    //   `MachineAccessControl deployed at\n${machineAccessControl.address}`
    // );
    // console.log(
    //   `MachineCreditSwap deployed at\n${legendMachineCreditSwap.address}`
    // );

    // await run(`verify:verify`, {
    //   address: "0x3e67D114560ef87FBeDf07E631336cd1F3e002fD",
    //   constructorArguments: ["0x10633a3d3F11961720174c91d1CD486F268a0DA1"],
    // });
    // await run(`verify:verify`, {
    //   address: "0x10633a3d3F11961720174c91d1CD486F268a0DA1",
    //   constructorArguments: [],
    // });
    // await run(`verify:verify`, {
    //   address: "0x66063E2039582605395af6a0D76B301dfeB7be6E",
    //   constructorArguments: [],
    // });
    await run(`verify:verify`, {
      address: "0x3620615BC68104a10be709CE48fA1F490885b3e2",
      constructorArguments: [
        "0x66063E2039582605395af6a0D76B301dfeB7be6E",
        ROUTER_MUMBAI,
      ],
    });
    // await run(`verify:verify`, {
    //   address: "0xF28DeC032760312A4C998935839b1589437Ab5aB",
    //   constructorArguments: [
    //     "0x3e67D114560ef87FBeDf07E631336cd1F3e002fD",
    //     "0x10633a3d3F11961720174c91d1CD486F268a0DA1",
    //     "0x3620615BC68104a10be709CE48fA1F490885b3e2",
    //   ],
    // });
    // await run(`verify:verify`, {
    //   address: "0xDa633112663a3639904Cf8629E72b77FDbeFD610",
    //   constructorArguments: [
    //     "metadataDetails",
    //     HUB_MUMBAI,
    //     MODULE_MUMBAI,
    //     "0x10633a3d3F11961720174c91d1CD486F268a0DA1",
    //     "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //     "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //     "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
    //     "0xF28DeC032760312A4C998935839b1589437Ab5aB",
    //     "0x3e67D114560ef87FBeDf07E631336cd1F3e002fD"
    //   ],
    // });
  } catch (err: any) {
    console.error(err.message);
  }
};

main();
