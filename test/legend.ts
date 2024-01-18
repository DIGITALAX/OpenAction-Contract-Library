import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";

describe("LegendOpenAction", () => {
  let legendAccessControl: Contract,
    legendOpenAction: Contract,
    legendMilestoneClaim: Contract,
    legendRegister: Contract,
    grantee: Signer,
    designer: Signer,
    admin: Signer,
    nonAdmin: Signer,
    nonDesigner: Signer,
    hub: Signer,
    pkpFiat: Signer,
    moduleGlobals: Signer,
    marketCreator: Contract,
    collectionCreator: Contract,
    printAccessControl: Contract,
    printDesignData: Contract,
    printOrderData: Contract,
    printSplitsData: Contract,
    nFTCreator: Contract,
    usdt: Contract,
    mona: Contract,
    matic: Contract,
    eth: Contract;

  before(async () => {
    [admin, grantee, designer, nonAdmin, nonDesigner, hub, moduleGlobals] =
      await ethers.getSigners();

    /* deploy print library */
    /***************************************************/
    /***************************************************/
    const PrintAccessControl = await ethers.getContractFactory(
      "PrintAccessControl"
    );
    const PrintLibrary = await ethers.getContractFactory("PrintLibrary");
    const PrintDesignData = await ethers.getContractFactory("PrintDesignData");
    const PrintOrderData = await ethers.getContractFactory("PrintOrderData");
    const PrintSplitsData = await ethers.getContractFactory("PrintSplitsData");
    const NFTCreator = await ethers.getContractFactory("NFTCreator");
    const CollectionCreator = await ethers.getContractFactory(
      "CollectionCreator"
    );
    const MarketCreator = await ethers.getContractFactory("MarketCreator");
    const CommunityCreator = await ethers.getContractFactory(
      "CommunityCreator"
    );

    printAccessControl = await PrintAccessControl.deploy();
    printDesignData = await PrintDesignData.deploy(printAccessControl.address);
    printOrderData = await PrintOrderData.deploy(
      printAccessControl.address,
      printDesignData.address
    );
    printSplitsData = await PrintSplitsData.deploy(printAccessControl.address);
    nFTCreator = await NFTCreator.deploy(
      printDesignData.address,
      printAccessControl.address
    );
    collectionCreator = await CollectionCreator.deploy(
      nFTCreator.address,
      printDesignData.address,
      printAccessControl.address,
      printSplitsData.address
    );
    marketCreator = await MarketCreator.deploy(
      printAccessControl.address,
      printSplitsData.address,
      printOrderData.address,
      collectionCreator.address,
      printDesignData.address,
      await pkpFiat.getAddress()
    );
    await printDesignData.setCollectionCreatorAddress(
      collectionCreator.address
    );
    await printDesignData.setNFTCreatorAddress(nFTCreator.address);
    await printOrderData.setMarketCreatorAddress(marketCreator.address);
    await nFTCreator.setCollectionCreatorAddress(collectionCreator.address);
    await collectionCreator.setMarketCreatorAddress(marketCreator.address);

    const ERC20 = await ethers.getContractFactory("TestToken");
    matic = await ERC20.deploy();
    await matic.deployed();
    mona = await ERC20.deploy();
    await mona.deployed();
    eth = await ERC20.deploy();
    await eth.deployed();
    usdt = await ERC20.deploy();
    await usdt.deployed();

    await printSplitsData.addCurrency(matic.address, "1000000000000000000");
    await printSplitsData.addCurrency(mona.address, "1000000000000000000");
    await printSplitsData.addCurrency(eth.address, "1000000000000000000");
    await printSplitsData.addCurrency(usdt.address, "1000000");

    await printSplitsData.setOraclePriceUSD(
      matic.address,
      "772200000000000000"
    );
    await printSplitsData.setOraclePriceUSD(
      mona.address,
      "411150300000000000000"
    );
    await printSplitsData.setOraclePriceUSD(
      eth.address,
      "2077490000000000000000"
    );
    await printSplitsData.setOraclePriceUSD(
      usdt.address,
      "1000000000000000000"
    );
    /***************************************************/
    /***************************************************/
    /***************************************************/

    const LegendAccessControl = await ethers.getContractFactory(
      "LegendAccessControl"
    );
    const LegendMilestoneClaim = await ethers.getContractFactory(
      "LegendMilestoneClaim"
    );
    const LegendRegister = await ethers.getContractFactory("LegendRegister");
    const LegendOpenAction = await ethers.getContractFactory(
      "LegendOpenAction"
    );

    legendAccessControl = await LegendAccessControl.deploy();
    legendMilestoneClaim = await LegendMilestoneClaim.deploy(
      legendAccessControl.address
    );
    legendRegister = await LegendRegister.deploy(legendAccessControl.address);
    legendOpenAction = await LegendOpenAction.deploy(
      "metadataDetails",
      await hub.getAddress(),
      await moduleGlobals.getAddress(),
      legendAccessControl.address,
      printSplitsData.address,
      printDesignData.address,
      marketCreator.address,
      legendMilestoneClaim.address,
      legendRegister.address
    );

    await legendAccessControl.addOpenAction(legendOpenAction.address);
  });

  describe("Initialize Grant", () => {});
});
