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
    // const LegendMachineCreditSwap = await ethers.getContractFactory(
    //   "LegendMachineCreditSwap"
    // );
    // const LegendMilestoneEscrow = await ethers.getContractFactory(
    //   "LegendMilestoneEscrow"
    // );
    // const LegendData = await ethers.getContractFactory("LegendData");
    // const LegendOpenAction = await ethers.getContractFactory(
    //   "LegendOpenAction"
    // );

    // const machineAccessControl = await MachineAccessControl.deploy();
    // const legendMachineCreditSwap = await LegendMachineCreditSwap.deploy(
    //   machineAccessControl.address,
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
    //   legendAccessControl.address,
    //   "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
    //   "0x597772c9c0EfE354976B0068296dFcb03583C2be",
    //   "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
    //   legendMilestoneEscrow.address,
    //   legendData.address
    // );

    // const WAIT_BLOCK_CONFIRMATIONS = 20;

    // legendData.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendMilestoneEscrow.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // machineAccessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendMachineCreditSwap.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendAccessControl.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);
    // legendOpenAction.deployTransaction.wait(WAIT_BLOCK_CONFIRMATIONS);

    // console.log(`LegendData deployed at\n${legendData.address}`);
    // console.log(
    //   `LegendMilestoneEscrow deployed at\n${legendMilestoneEscrow.address}`
    // );
    // console.log(`LegendOpenAction deployed at\n${legendOpenAction.address}`);
    // console.log(
    //   `MachineAccessControl deployed at\n${machineAccessControl.address}`
    // );
    // console.log(
    //   `LegendAccessControl deployed at\n${legendAccessControl.address}`
    // );
    // console.log(
    //   `MachineCreditSwap deployed at\n${legendMachineCreditSwap.address}`
    // );

    await run(`verify:verify`, {
      address: "0x04D891EDD599DE3a19bBA5A3a180479b658908AC",
      constructorArguments: ["0xC23150522E366DD884729754ebAD412A2EdF0c24"],
    });
    await run(`verify:verify`, {
      address: "0xC23150522E366DD884729754ebAD412A2EdF0c24",
      constructorArguments: [],
    });
    await run(`verify:verify`, {
      address: "0x6592b20e44C1E6A49E156d43CDF9b85fadAEfBD8",
      constructorArguments: [],
    });
    await run(`verify:verify`, {
      address: "0xdFFC4a7136a44261Bd7562B84de1c2312C4B2C6b",
      constructorArguments: [
        "0x6592b20e44C1E6A49E156d43CDF9b85fadAEfBD8",
        ROUTER_MUMBAI,
      ],
    });
    await run(`verify:verify`, {
      address: "0xf340B1610FeE6c0e6b19299403CAb40b6BDE65b2",
      constructorArguments: [
        "0x04D891EDD599DE3a19bBA5A3a180479b658908AC",
        "0xC23150522E366DD884729754ebAD412A2EdF0c24",
        '0xdFFC4a7136a44261Bd7562B84de1c2312C4B2C6b'
      ],
    });
    await run(`verify:verify`, {
      address: "0x639b8178DCf393Fb37B2212a0C2431A262622f98",
      constructorArguments: [
        "metadataDetails",
        HUB_MUMBAI,
        MODULE_MUMBAI,
        "0xC23150522E366DD884729754ebAD412A2EdF0c24",
        "0xa6466180387940CAc6467CCc0242D4B19A24e6BE",
        "0x597772c9c0EfE354976B0068296dFcb03583C2be",
        "0x2aFf9F385Fb865a8cd8fdE810d43a0dB8f3cD699",
        "0xf340B1610FeE6c0e6b19299403CAb40b6BDE65b2",
        "0x04D891EDD599DE3a19bBA5A3a180479b658908AC"
      ],
    });

  } catch (err: any) {
    console.error(err.message);
  }
};

main();
