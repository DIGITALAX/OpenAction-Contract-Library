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
    //   "ipfs://QmYemvjEvqAf47QkiMrBh3p2s8vj534yfyvcyBQf5HiSZN",
    //   HUB,
    //   MODULE,
    //   legendAccessControl.address,
    //   "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
    //   "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
    //   "0xc86f5C3101b64A8873842A26A78dB399e827855e",
    //   legendMilestoneEscrow.address,
    //   legendData.address
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

    await run(`verify:verify`, {
      address: "0xC685EC7Cf754592F34d66C459ad5F794AED8c5A5",
      constructorArguments: ["0x5663f8021E84059B54ae5579bb72dFD36B14231E"],
    });
    await run(`verify:verify`, {
      address: "0x5663f8021E84059B54ae5579bb72dFD36B14231E",
      constructorArguments: [],
    });
    await run(`verify:verify`, {
      address: "0x37Ee8f4276B2927d003569C739825dd7bB7393C8",
      constructorArguments: [],
    });
    await run(`verify:verify`, {
      address: "0xA5BD34FA61E929a63Be55C959da3b69378c885fb",
      constructorArguments: [
        "0x37Ee8f4276B2927d003569C739825dd7bB7393C8",
        ROUTER,
      ],
    });
    await run(`verify:verify`, {
      address: "0x8B47314AEa356050c78A5f2400723315Fca24F93",
      constructorArguments: [
        "0xC685EC7Cf754592F34d66C459ad5F794AED8c5A5",
        "0x5663f8021E84059B54ae5579bb72dFD36B14231E",
        "0xA5BD34FA61E929a63Be55C959da3b69378c885fb",
      ],
    });
    await run(`verify:verify`, {
      address: "0x632940ECecacb413371163a208Fc4926BD566352",
      constructorArguments: [
        "ipfs://QmYemvjEvqAf47QkiMrBh3p2s8vj534yfyvcyBQf5HiSZN",
        HUB,
        MODULE,
        "0x5663f8021E84059B54ae5579bb72dFD36B14231E",
        "0x5A4A9a99d4736aE024044d17AA989426C76fafFD",
        "0x86B39A6D9AD0DDEBC53928e7150003e7C76F42bf",
        "0xc86f5C3101b64A8873842A26A78dB399e827855e",
        "0x8B47314AEa356050c78A5f2400723315Fca24F93",
        "0xC685EC7Cf754592F34d66C459ad5F794AED8c5A5",
      ],
    });
  } catch (err: any) {
    console.error(err.message);
  }
};

main();
