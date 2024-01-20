import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";

describe("LegendOpenAction", () => {
  let legendAccessControl: Contract,
    legendOpenAction: Contract,
    legendMilestoneEscrow: Contract,
    machineAccessControl: Contract,
    legendMachineCreditSwap: Contract,
    legendData: Contract,
    grantee: Signer,
    granteeTwo: Signer,
    granteeThree: Signer,
    designer: Signer,
    admin: Signer,
    nonAdmin: Signer,
    nonDesigner: Signer,
    contributor: Signer,
    hub: Signer,
    pkpFiat: Signer,
    fulfiller: Signer,
    moduleGlobals: Signer,
    fulfillerTwo: Signer,
    designerTwo: Signer,
    marketCreator: Contract,
    communityCreator: Contract,
    printCommunityData: Contract,
    collectionCreator: Contract,
    printAccessControl: Contract,
    printDesignData: Contract,
    printOrderData: Contract,
    printSplitsData: Contract,
    nFTCreator: Contract,
    usdt: Contract,
    mona: Contract,
    matic: Contract,
    eth: Contract,
    coinOpOpenAction: Contract;

  before(async () => {
    [
      grantee,
      granteeTwo,
      granteeThree,
      designer,
      admin,
      nonAdmin,
      nonDesigner,
      hub,
      pkpFiat,
      moduleGlobals,
      contributor,
      fulfiller,
      fulfillerTwo,
      designerTwo,
    ] = await ethers.getSigners();

    /* deploy print library */
    /***************************************************/
    /***************************************************/
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
    const CoinOpOpenAction = await ethers.getContractFactory(
      "CoinOpOpenAction"
    );
    const PrintCommunityData = await ethers.getContractFactory(
      "PrintCommunityData"
    );
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
    communityCreator = await CommunityCreator.deploy(
      printOrderData.address,
      printAccessControl.address,
      printDesignData.address
    );
    printCommunityData = await PrintCommunityData.deploy(
      printAccessControl.address,
      communityCreator.address
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

    coinOpOpenAction = await CoinOpOpenAction.deploy(
      "mystringjsoninfo",
      await hub.getAddress(),
      await moduleGlobals.getAddress(),
      printAccessControl.address,
      printSplitsData.address,
      printDesignData.address,
      marketCreator.address,
      collectionCreator.address,
      printCommunityData.address
    );

    /***************************************************/
    /***************************************************/
    /***************************************************/

    const LegendAccessControl = await ethers.getContractFactory(
      "LegendAccessControl"
    );
    const MachineAccessControl = await ethers.getContractFactory(
      "MachineAccessControl"
    );
    const LegendMachineCreditSwap = await ethers.getContractFactory(
      "LegendMachineCreditSwap"
    );
    const LegendMilestoneEscrow = await ethers.getContractFactory(
      "LegendMilestoneEscrow"
    );
    const LegendData = await ethers.getContractFactory("LegendData");
    const LegendOpenAction = await ethers.getContractFactory(
      "LegendOpenAction"
    );

    machineAccessControl = await MachineAccessControl.deploy();
    legendMachineCreditSwap = await LegendMachineCreditSwap.deploy(
      machineAccessControl.address
    );
    legendAccessControl = await LegendAccessControl.deploy();
    legendData = await LegendData.deploy(legendAccessControl.address);
    legendMilestoneEscrow = await LegendMilestoneEscrow.deploy(
      legendData.address,
      legendAccessControl.address,
      legendMachineCreditSwap.address
    );
    legendOpenAction = await LegendOpenAction.deploy(
      "metadataDetails",
      await hub.getAddress(),
      await moduleGlobals.getAddress(),
      legendAccessControl.address,
      printSplitsData.address,
      printDesignData.address,
      marketCreator.address,
      legendMilestoneEscrow.address,
      legendData.address
    );

    await legendAccessControl.addOpenAction(legendOpenAction.address);
    await legendAccessControl.addGrantee(await grantee.getAddress());
    await legendAccessControl.addGrantee(await granteeThree.getAddress());

    await legendMachineCreditSwap.setLegendEscrowAddress(
      legendMilestoneEscrow.address
    );
    await legendMilestoneEscrow.setLegendOpenActionAddress(
      legendOpenAction.address
    );
    await legendData.setMilestoneEscrowAddress(legendMilestoneEscrow.address);
    await printAccessControl.addDesigner(await designer.getAddress());
    await printAccessControl.addDesigner(await designerTwo.getAddress());
    await printAccessControl.addFulfiller(await fulfiller.getAddress());
    await printAccessControl.addFulfiller(await fulfillerTwo.getAddress());
    await printAccessControl.addOpenAction(legendOpenAction.address);

    await printSplitsData.setFulfillerSplit(
      await fulfiller.getAddress(),
      3,
      "15000000000000000000"
    );
    await printSplitsData.setFulfillerBase(
      await fulfiller.getAddress(),
      3,
      "40000000000000000000"
    );
    await printSplitsData.setFulfillerSplit(
      await fulfiller.getAddress(),
      1,
      "10000000000000000000"
    );
    await printSplitsData.setFulfillerBase(
      await fulfiller.getAddress(),
      1,
      "10000000000000000000"
    );
    await printSplitsData.setFulfillerSplit(
      await fulfillerTwo.getAddress(),
      2,
      "20000000000000000000"
    );
    await printSplitsData.setFulfillerBase(
      await fulfillerTwo.getAddress(),
      2,
      "20000000000000000000"
    );
    const coinopData = ethers.utils.defaultAbiCoder.encode(
      [
        "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
        "uint8",
      ],
      [
        {
          prices: [
            "100000000000000000000",
            "120000000000000000000",
            "160000000000000000000",
            "200000000000000000000",
          ],
          communityIds: [],
          acceptedTokens: [usdt.address],
          uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
          fulfiller: await fulfiller.getAddress(),
          amount: 100,
          dropId: 1,
          unlimited: true,
          encrypted: false,
        },
        3,
      ]
    );

    await collectionCreator.connect(designer).createDrop("coinOpdrop");
    await collectionCreator.connect(designerTwo).createDrop("coinOpdrop2");

    await coinOpOpenAction
      .connect(hub)
      .initializePublicationAction(
        127,
        438,
        await designer.getAddress(),
        coinopData
      );

    const coinopDataTwo = ethers.utils.defaultAbiCoder.encode(
      [
        "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
        "uint8",
      ],
      [
        {
          prices: [
            "100000000000000000000",
            "120000000000000000000",
            "160000000000000000000",
            "200000000000000000000",
          ],
          communityIds: [],
          acceptedTokens: [usdt.address],
          uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
          fulfiller: await fulfiller.getAddress(),
          amount: 100,
          dropId: 1,
          unlimited: true,
          encrypted: false,
        },
        1,
      ]
    );

    const coinopDataThree = ethers.utils.defaultAbiCoder.encode(
      [
        "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
        "uint8",
      ],
      [
        {
          prices: [
            "100000000000000000000",
            "120000000000000000000",
            "160000000000000000000",
            "200000000000000000000",
          ],
          communityIds: [],
          acceptedTokens: [usdt.address],
          uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
          fulfiller: await fulfillerTwo.getAddress(),
          amount: 100,
          dropId: 2,
          unlimited: true,
          encrypted: false,
        },
        2,
      ]
    );

    await coinOpOpenAction
      .connect(hub)
      .initializePublicationAction(
        127,
        100,
        await designer.getAddress(),
        coinopDataTwo
      );

    await coinOpOpenAction
      .connect(hub)
      .initializePublicationAction(
        12,
        9,
        await designerTwo.getAddress(),
        coinopDataThree
      );
  });

  describe("Initialize Grant", () => {
    before(async () => {
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(tuple(uint256[] collectionIds, uint256[] amounts, uint8 level)[6] levelInfo, uint256[][3] goalToCurrency, address[] acceptedCurrencies, address[] granteeAddresses, uint256[] splitAmounts, uint256[3] submitBys)",
        ],
        [
          {
            levelInfo: [
              {
                collectionIds: [1],
                amounts: [1],
                level: 2,
              },
              {
                collectionIds: [2],
                amounts: [2],
                level: 3,
              },
              {
                collectionIds: [3],
                amounts: [3],
                level: 4,
              },
              {
                collectionIds: [4, 5],
                amounts: [1, 2],
                level: 5,
              },
              {
                collectionIds: [6, 7, 8],
                amounts: [1, 1, 1],
                level: 6,
              },
              {
                collectionIds: [1, 2, 3],
                amounts: [2, 3, 4],
                level: 7,
              },
            ],
            goalToCurrency: [["500000000"], ["100000000"], ["500000000"]],
            acceptedCurrencies: [usdt.address],
            granteeAddresses: [
              await grantee.getAddress(),
              await granteeTwo.getAddress(),
              await granteeThree.getAddress(),
            ],
            splitAmounts: [
              "50000000000000000000",
              "10000000000000000000",
              "40000000000000000000",
            ],
            submitBys: ["1705727127", "1705727127", "1705727127"],
          },
        ]
      );

      await legendOpenAction
        .connect(hub)
        .initializePublicationAction(
          50,
          10,
          await grantee.getAddress(),
          encodedData
        );
    });

    it("Sets the Initial Publication Data Quest", async () => {
      expect(await legendData.getGrantSupply()).to.equal(1);
      expect(await legendData.getGrantAddresses(1)).to.deep.equal([
        await grantee.getAddress(),
        await granteeTwo.getAddress(),
        await granteeThree.getAddress(),
      ]);
      expect(await legendData.getGrantPubId(1)).to.equal(10);
      expect(await legendData.getGrantProfileId(1)).to.equal(50);
      expect(await legendData.getGrantId(50, 10)).to.equal(1);
      expect(await legendData.getGrantLevelCollectionIds(1, 2)).to.deep.equal([
        1,
      ]);
      expect(await legendData.getGrantLevelCollectionIds(1, 3)).to.deep.equal([
        2,
      ]);
      expect(await legendData.getGrantLevelCollectionIds(1, 4)).to.deep.equal([
        3,
      ]);
      expect(await legendData.getGrantLevelCollectionIds(1, 5)).to.deep.equal([
        4, 5,
      ]);
      expect(await legendData.getGrantLevelCollectionIds(1, 6)).to.deep.equal([
        6, 7, 8,
      ]);
      expect(await legendData.getGrantLevelCollectionIds(1, 7)).to.deep.equal([
        1, 2, 3,
      ]);
      expect(await legendData.getGrantLevelAmounts(1, 2)).to.deep.equal([1]);
      expect(await legendData.getGrantLevelAmounts(1, 3)).to.deep.equal([2]);
      expect(await legendData.getGrantLevelAmounts(1, 4)).to.deep.equal([3]);
      expect(await legendData.getGrantLevelAmounts(1, 5)).to.deep.equal([1, 2]);
      expect(await legendData.getGrantLevelAmounts(1, 6)).to.deep.equal([
        1, 1, 1,
      ]);
      expect(await legendData.getGrantLevelAmounts(1, 7)).to.deep.equal([
        2, 3, 4,
      ]);
    });

    it("Sets the Initial Publication Data Milestone", async () => {
      expect(await legendData.getMilestoneStatus(1, 1)).to.equal(0);
      expect(await legendData.getMilestoneStatus(1, 2)).to.equal(0);
      expect(await legendData.getMilestoneStatus(1, 3)).to.equal(0);

      expect(await legendData.getMilestoneSubmitBy(1, 1)).to.equal(
        "1705727127"
      );
      expect(await legendData.getMilestoneSubmitBy(1, 2)).to.equal(
        "1705727127"
      );
      expect(await legendData.getMilestoneSubmitBy(1, 3)).to.equal(
        "1705727127"
      );

      expect(
        await legendData.getMilestoneGoalToCurrency(usdt.address, 1, 1)
      ).to.equal("500000000");
      expect(
        await legendData.getMilestoneGoalToCurrency(usdt.address, 1, 2)
      ).to.equal("100000000");
      expect(
        await legendData.getMilestoneGoalToCurrency(usdt.address, 1, 3)
      ).to.equal("500000000");

      expect(
        await legendData.getGranteeSplitAmount(await grantee.getAddress(), 1)
      ).to.equal("50000000000000000000");
      expect(
        await legendData.getGranteeSplitAmount(await granteeTwo.getAddress(), 1)
      ).to.equal("10000000000000000000");
      expect(
        await legendData.getGranteeSplitAmount(
          await granteeThree.getAddress(),
          1
        )
      ).to.equal("40000000000000000000");

      expect(await legendData.getAllClaimedMilestone(1, 1)).to.equal(false);
      expect(await legendData.getAllClaimedMilestone(1, 2)).to.equal(false);
      expect(await legendData.getAllClaimedMilestone(1, 3)).to.equal(false);

      expect(
        await legendData.getGranteeClaimedMilestone(
          await grantee.getAddress(),
          1,
          1
        )
      ).to.equal(false);
      expect(
        await legendData.getGranteeClaimedMilestone(
          await granteeTwo.getAddress(),
          1,
          1
        )
      ).to.equal(false);
      expect(
        await legendData.getGranteeClaimedMilestone(
          await granteeThree.getAddress(),
          1,
          1
        )
      ).to.equal(false);
      expect(
        await legendData.getGranteeClaimedMilestone(
          await grantee.getAddress(),
          1,
          2
        )
      ).to.equal(false);
      expect(
        await legendData.getGranteeClaimedMilestone(
          await granteeTwo.getAddress(),
          1,
          2
        )
      ).to.equal(false);
      expect(
        await legendData.getGranteeClaimedMilestone(
          await granteeThree.getAddress(),
          1,
          2
        )
      ).to.equal(false);
      expect(
        await legendData.getGranteeClaimedMilestone(
          await grantee.getAddress(),
          1,
          3
        )
      ).to.equal(false);
      expect(
        await legendData.getGranteeClaimedMilestone(
          await granteeTwo.getAddress(),
          1,
          3
        )
      ).to.equal(false);
      expect(
        await legendData.getGranteeClaimedMilestone(
          await granteeThree.getAddress(),
          1,
          3
        )
      ).to.equal(false);
    });

    it("Funds & Processes grant", async () => {
      await usdt.transfer(
        await contributor.getAddress(),
        ethers.utils.parseEther("300")
      );
      await usdt
        .connect(contributor)
        .approve(legendOpenAction.address, ethers.utils.parseEther("300"));

      // level 1
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        ["uint256[]", "string", "address", "uint8"],
        [[], "my fulfillment encrypted", usdt.address, 1]
      );

      const balanceEscrow = await usdt.balanceOf(legendMilestoneEscrow.address);
      const balanceContributor = await usdt.balanceOf(
        await contributor.getAddress()
      );

      await legendOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 50,
        publicationActedId: 10,
        actorProfileId: 400,
        actorProfileOwner: await contributor.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: encodedData,
      });

      expect(
        await legendData.getGrantAmountFundedByCurrency(usdt.address, 1)
      ).to.equal("1000000");
      expect(
        await legendData.getGrantAmountFundedByCurrency(matic.address, 1)
      ).to.equal("0");
      expect(await usdt.balanceOf(legendMilestoneEscrow.address)).to.equal(
        balanceEscrow.add("1000000")
      );
      expect(await usdt.balanceOf(await contributor.getAddress())).to.equal(
        balanceContributor.sub("1000000")
      );

      // level 2
      const secondData = ethers.utils.defaultAbiCoder.encode(
        ["uint256[]", "string", "address", "uint8"],
        [[0], "my fulfillment encrypted", usdt.address, 2]
      );

      const designerBalance = await usdt.balanceOf(await designer.getAddress());
      const fulfillerBalance = await usdt.balanceOf(
        await fulfiller.getAddress()
      );
      const escrowBalance = await usdt.balanceOf(legendMilestoneEscrow.address);
      const contributorBalance = await usdt.balanceOf(
        await contributor.getAddress()
      );

      await legendOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 50,
        publicationActedId: 10,
        actorProfileId: 400,
        actorProfileOwner: await contributor.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: secondData,
      });

      const totalPrice = ethers.BigNumber.from("100000000");
      const fulfillerB = ethers.BigNumber.from("40000000").add(
        totalPrice.mul(15).div(100)
      );
      const designerB = totalPrice.sub(fulfillerB).mul(30).div(100);

      expect(await usdt.balanceOf(await designer.getAddress())).to.equal(
        designerBalance.add(designerB)
      );
      expect(await usdt.balanceOf(await fulfiller.getAddress())).to.equal(
        fulfillerBalance.add(fulfillerB)
      );
      expect(await usdt.balanceOf(await contributor.getAddress())).to.equal(
        contributorBalance.sub(totalPrice)
      );
      expect(await usdt.balanceOf(legendMilestoneEscrow.address)).to.equal(
        escrowBalance.add(totalPrice.sub(fulfillerB).sub(designerB))
      );
      expect(
        await legendData.getGrantAmountFundedByCurrency(usdt.address, 1)
      ).to.equal(
        ethers.BigNumber.from("1000000").add(
          totalPrice.sub(fulfillerB).sub(designerB)
        )
      );

      // check with level 7 (multiple items)
      // level 2
      const sevenData = ethers.utils.defaultAbiCoder.encode(
        ["uint256[]", "string", "address", "uint8"],
        [[1, 2, 0], "my fulfillment encrypted", usdt.address, 7]
      );

      const designerBalance2 = await usdt.balanceOf(
        await designer.getAddress()
      );
      const fulfillerBalance2 = await usdt.balanceOf(
        await fulfiller.getAddress()
      );
      const secondDesignerBalance = await usdt.balanceOf(
        await designerTwo.getAddress()
      );
      const secondFulfillerBalance = await usdt.balanceOf(
        await fulfillerTwo.getAddress()
      );
      const escrowBalance2 = await usdt.balanceOf(
        legendMilestoneEscrow.address
      );
      const contributorBalance2 = await usdt.balanceOf(
        await contributor.getAddress()
      );

      await legendOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 50,
        publicationActedId: 10,
        actorProfileId: 400,
        actorProfileOwner: await contributor.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: sevenData,
      });

      const total_one = ethers.BigNumber.from("120000000").mul(2);
      const total_two = ethers.BigNumber.from("160000000").mul(3);
      const total_three = ethers.BigNumber.from("100000000").mul(4);

      const fulfillerB2 = ethers.BigNumber.from("40000000")
        .mul(2)
        .add(ethers.BigNumber.from("10000000").mul(3))
        .add(total_one.mul(15).div(100))
        .add(total_two.mul(10).div(100));

      const secondFulfillerB = ethers.BigNumber.from("20000000")
        .mul(4)
        .add(total_three.mul(20).div(100));

      const designerB2 = total_one
        .sub(ethers.BigNumber.from("40000000").mul(2))
        .sub(total_one.mul(15).div(100))
        .mul(30)
        .div(100)
        .add(
          total_two
            .sub(ethers.BigNumber.from("10000000").mul(3))
            .sub(total_two.mul(10).div(100))
            .mul(30)
            .div(100)
        );

      const secondDesignerB = total_three
        .sub(ethers.BigNumber.from("20000000").mul(4))
        .sub(total_three.mul(20).div(100))
        .mul(30)
        .div(100);

      expect(await usdt.balanceOf(await designer.getAddress())).to.equal(
        designerBalance2.add(designerB2)
      );
      expect(await usdt.balanceOf(await fulfiller.getAddress())).to.equal(
        fulfillerBalance2.add(fulfillerB2)
      );
      expect(await usdt.balanceOf(await designerTwo.getAddress())).to.equal(
        secondDesignerBalance.add(secondDesignerB)
      );
      expect(await usdt.balanceOf(await fulfillerTwo.getAddress())).to.equal(
        secondFulfillerBalance.add(secondFulfillerB)
      );
      expect(await usdt.balanceOf(await contributor.getAddress())).to.equal(
        contributorBalance2.sub(total_one.add(total_two).add(total_three))
      );
      expect(await usdt.balanceOf(legendMilestoneEscrow.address)).to.equal(
        escrowBalance2.add(
          total_one
            .add(total_two)
            .add(total_three)
            .sub(secondFulfillerB)
            .sub(secondDesignerB)
            .sub(fulfillerB2)
            .sub(designerB2)
        )
      );
      expect(
        await legendData.getGrantAmountFundedByCurrency(usdt.address, 1)
      ).to.equal(
        ethers.BigNumber.from("1000000")
          .add(totalPrice.sub(fulfillerB).sub(designerB))
          .add(
            total_one
              .add(total_two)
              .add(total_three)
              .sub(secondFulfillerB)
              .sub(secondDesignerB)
              .sub(fulfillerB2)
              .sub(designerB2)
          )
      );
    });

    it("Delete Grant Without Funding", async () => {
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(tuple(uint256[] collectionIds, uint256[] amounts, uint8 level)[6] levelInfo, uint256[][3] goalToCurrency, address[] acceptedCurrencies, address[] granteeAddresses, uint256[] splitAmounts, uint256[3] submitBys)",
        ],
        [
          {
            levelInfo: [
              {
                collectionIds: [1],
                amounts: [1],
                level: 2,
              },
              {
                collectionIds: [2],
                amounts: [2],
                level: 3,
              },
              {
                collectionIds: [3],
                amounts: [3],
                level: 4,
              },
              {
                collectionIds: [4, 5],
                amounts: [1, 2],
                level: 5,
              },
              {
                collectionIds: [6, 7, 8],
                amounts: [1, 1, 1],
                level: 6,
              },
              {
                collectionIds: [1, 2, 3],
                amounts: [2, 3, 4],
                level: 7,
              },
            ],
            goalToCurrency: [["500000000"], ["100000000"], ["500000000"]],
            acceptedCurrencies: [usdt.address],
            granteeAddresses: [
              await grantee.getAddress(),
              await granteeTwo.getAddress(),
              await granteeThree.getAddress(),
            ],
            splitAmounts: [
              "50000000000000000000",
              "10000000000000000000",
              "40000000000000000000",
            ],
            submitBys: ["1705727127", "1705727127", "1705727127"],
          },
        ]
      );

      await legendOpenAction
        .connect(hub)
        .initializePublicationAction(
          52,
          11,
          await granteeThree.getAddress(),
          encodedData
        );

      expect(await legendData.getGrantSupply()).to.equal(2);

      try {
        await legendData.connect(admin).deleteGrant(2);
      } catch (err: any) {
        expect(err.message).to.include("InvalidAddress");
      }

      await legendData.connect(granteeThree).deleteGrant(2);
      expect(await legendData.getGrantId(52, 11)).to.equal(0);

      await legendOpenAction
        .connect(hub)
        .initializePublicationAction(
          52,
          13,
          await granteeThree.getAddress(),
          encodedData
        );

      const secondData = ethers.utils.defaultAbiCoder.encode(
        ["uint256[]", "string", "address", "uint8"],
        [[], "my fulfillment encrypted", usdt.address, 1]
      );

      await legendOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 52,
        publicationActedId: 13,
        actorProfileId: 400,
        actorProfileOwner: await contributor.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: secondData,
      });

      try {
        await legendData.connect(granteeThree).deleteGrant(3);
      } catch (err: any) {
        expect(err.message).to.include("InvalidDelete()");
      }
    });

    it("Milestone Claim", async () => {
      try {
        await legendMilestoneEscrow
          .connect(nonAdmin)
          .initiateMilestoneClaim(1, 1);
      } catch (err: any) {
        expect(err.message).to.include("GranteeNotRegistered()");
      }

      const granteeBalance = await usdt.balanceOf(await grantee.getAddress());
      const granteeTwoBalance = await usdt.balanceOf(
        await granteeTwo.getAddress()
      );
      const granteeThreeBalance = await usdt.balanceOf(
        await granteeThree.getAddress()
      );
      const escrowBalance = await usdt.balanceOf(legendMilestoneEscrow.address);

      await legendMilestoneEscrow.connect(grantee).initiateMilestoneClaim(1, 1);
      await legendMilestoneEscrow
        .connect(granteeThree)
        .initiateMilestoneClaim(1, 1);

      expect(await usdt.balanceOf(await grantee.getAddress())).to.equal(
        granteeBalance.add(ethers.BigNumber.from("500000000").mul(50).div(100))
      );
      expect(await usdt.balanceOf(await granteeThree.getAddress())).to.equal(
        granteeThreeBalance.add(
          ethers.BigNumber.from("500000000").mul(40).div(100)
        )
      );

      try {
        await legendMilestoneEscrow
          .connect(grantee)
          .initiateMilestoneClaim(1, 1);
      } catch (err: any) {
        expect(err.message).to.include("AlreadyClaimed()");
      }
      try {
        await legendMilestoneEscrow
          .connect(granteeThree)
          .initiateMilestoneClaim(1, 1);
      } catch (err: any) {
        expect(err.message).to.include("AlreadyClaimed()");
      }

      await legendMilestoneEscrow
        .connect(granteeTwo)
        .initiateMilestoneClaim(1, 1);
      expect(await usdt.balanceOf(await granteeTwo.getAddress())).to.equal(
        granteeTwoBalance.add(
          ethers.BigNumber.from("500000000").mul(10).div(100)
        )
      );
      expect(await usdt.balanceOf(legendMilestoneEscrow.address)).to.equal(
        escrowBalance.sub("500000000")
      );

      try {
        await legendMilestoneEscrow
          .connect(granteeThree)
          .initiateMilestoneClaim(1, 1);
      } catch (err: any) {
        expect(err.message).to.include("InvalidClaim()");
      }
    });
  });
});
