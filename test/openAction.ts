import { expect } from "chai";
import { Contract, Signer } from "ethers";
import { ethers } from "hardhat";

describe("ChromadinOpenAction", () => {
  let chromadinOpenAction: Contract,
    listenerOpenAction: Contract,
    coinOpOpenAction: Contract,
    marketCreator: Contract,
    collectionCreator: Contract,
    printAccessControl: Contract,
    printDesignData: Contract,
    printOrderData: Contract,
    printSplitsData: Contract,
    nFTCreator: Contract,
    communityCreator: Contract,
    printCommunityData: Contract,
    usdt: Contract,
    mona: Contract,
    matic: Contract,
    eth: Contract,
    admin: Signer,
    hub: Signer,
    module: Signer,
    pkpFiat: Signer,
    creator: Signer,
    creatorTwo: Signer,
    creatorListener: Signer,
    fulfiller: Signer,
    otherBuyer: Signer,
    creatorCoinOp: Signer,
    fulfillerCoinOp: Signer,
    buyer: Signer;

  before(async () => {
    [
      admin,
      hub,
      module,
      pkpFiat,
      creator,
      creatorTwo,
      buyer,
      creatorListener,
      fulfiller,
      otherBuyer,
      creatorCoinOp,
      fulfillerCoinOp,
    ] = await ethers.getSigners();

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
    const PrintCommunityData = await ethers.getContractFactory(
      "PrintCommunityData"
    );
    const CommunityCreator = await ethers.getContractFactory(
      "CommunityCreator"
    );
    const ChromadinOpenAction = await ethers.getContractFactory(
      "ChromadinOpenAction"
    );
    const ListenerOpenAction = await ethers.getContractFactory(
      "ListenerOpenAction"
    );
    const CoinOpOpenAction = await ethers.getContractFactory(
      "CoinOpOpenAction"
    );

    await PrintLibrary.deploy();
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
    chromadinOpenAction = await ChromadinOpenAction.deploy(
      "mystringjsoninfo",
      await hub.getAddress(),
      await module.getAddress(),
      printAccessControl.address,
      printSplitsData.address,
      printDesignData.address,
      marketCreator.address,
      collectionCreator.address,
      printCommunityData.address
    );
    listenerOpenAction = await ListenerOpenAction.deploy(
      "mystringjsoninfo",
      await hub.getAddress(),
      await module.getAddress(),
      printAccessControl.address,
      printSplitsData.address,
      printDesignData.address,
      marketCreator.address,
      collectionCreator.address,
      printCommunityData.address
    );
    coinOpOpenAction = await CoinOpOpenAction.deploy(
      "mystringjsoninfo",
      await hub.getAddress(),
      await module.getAddress(),
      printAccessControl.address,
      printSplitsData.address,
      printDesignData.address,
      marketCreator.address,
      collectionCreator.address,
      printCommunityData.address
    );

    await printAccessControl.addDesigner(await creator.getAddress());
    await printAccessControl.addOpenAction(chromadinOpenAction.address);
    await printAccessControl.addDesigner(await creatorListener.getAddress());
    await printAccessControl.addOpenAction(listenerOpenAction.address);
    await printAccessControl.addOpenAction(coinOpOpenAction.address);
    await printAccessControl.addFulfiller(await fulfiller.getAddress());
    await printAccessControl.addDesigner(await creatorCoinOp.getAddress());
    await printAccessControl.addFulfiller(await fulfillerCoinOp.getAddress());

    await printDesignData.setCollectionCreatorAddress(
      collectionCreator.address
    );
    await printDesignData.setNFTCreatorAddress(nFTCreator.address);
    await printOrderData.setMarketCreatorAddress(marketCreator.address);
    await nFTCreator.setCollectionCreatorAddress(collectionCreator.address);
    await collectionCreator.setMarketCreatorAddress(marketCreator.address);
    await communityCreator.setPrintCommunityDataAddress(
      printCommunityData.address
    );

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
  });

  describe("initializePublicationAction", () => {
    before(async () => {
      await collectionCreator.connect(creator).createDrop("mydropuri");
    });

    it("should correctly initialize a publication action", async () => {
      const encodedData = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, address creatorAddress, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
        ],
        [
          {
            prices: ["100000000000000000000"],
            communityIds: [],
            acceptedTokens: [
              mona.address,
              matic.address,
              eth.address,
              usdt.address,
            ],
            uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
            fulfiller: "0x0000000000000000000000000000000000000000",
            creatorAddress: await creator.getAddress(),
            amount: 6,
            dropId: 1,
            unlimited: false,
            encrypted: false,
          },
        ]
      );

      await chromadinOpenAction
        .connect(hub)
        .initializePublicationAction(
          50,
          10,
          await hub.getAddress(),
          encodedData
        );

      expect(await printDesignData.getCollectionCreator(1)).to.equal(
        await creator.getAddress()
      );
      expect(await printDesignData.getCollectionCommunityIds(1)).to.deep.equal(
        []
      );
      expect(
        await printDesignData.getCollectionAcceptedTokens(1)
      ).to.deep.equal([mona.address, matic.address, eth.address, usdt.address]);
      expect(
        await printDesignData.getIsCollectionTokenAccepted(1, matic.address)
      ).to.be.true;
      expect(
        await printDesignData.getIsCollectionTokenAccepted(1, mona.address)
      ).to.be.true;
      expect(await printDesignData.getIsCollectionTokenAccepted(1, eth.address))
        .to.be.true;
      expect(
        await printDesignData.getIsCollectionTokenAccepted(1, usdt.address)
      ).to.be.true;

      expect(await printDesignData.getCollectionOrigin(1)).to.equal(1);
      expect(await printDesignData.getCollectionDropId(1)).to.equal(1);
      expect(await printDesignData.getCollectionURI(1)).to.equal(
        "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk"
      );
      expect(await printDesignData.getCollectionPrices(1)).to.deep.equal([
        "100000000000000000000",
      ]);
      expect(await printDesignData.getCollectionPrintType(1)).to.equal(6);
      expect(await printDesignData.getCollectionFulfiller(1)).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(await printDesignData.getCollectionAmount(1)).to.equal(6);
      expect(await printDesignData.getCollectionUnlimited(1)).to.be.false;
      expect(await printDesignData.getCollectionEncrypted(1)).to.be.false;
      expect(await printDesignData.getCollectionTokenIds(1)).to.deep.equal([]);
      expect(await printDesignData.getCollectionTokensMinted(1)).to.equal(0);
      expect(await printDesignData.getCollectionProfileId(1)).to.equal(50);
      expect(await printDesignData.getCollectionPubId(1)).to.equal(10);

      expect(await printDesignData.getCollectionSupply()).to.equal(1);
      expect(await printDesignData.getTokenSupply()).to.equal(0);
      expect(await printDesignData.getDropSupply()).to.equal(1);
    });

    it("Edit the drop and then delete it and update the collection", async () => {
      expect(await printDesignData.getDropURI(1)).to.equal("mydropuri");
      expect(await printDesignData.getDropCreator(1)).to.equal(
        await creator.getAddress()
      );
      expect(await printDesignData.getDropCollectionIds(1)).to.deep.equal([1]);

      try {
        await collectionCreator.updateDrop([], "mynewdrop", 1);
      } catch (err: any) {
        expect(err.message).to.include("InvalidUpdate");
      }

      await collectionCreator.connect(creator).updateDrop([], "mynewdrop", 1);

      expect(await printDesignData.getDropURI(1)).to.equal("mynewdrop");
      expect(await printDesignData.getDropCreator(1)).to.equal(
        await creator.getAddress()
      );
      expect(await printDesignData.getDropCollectionIds(1)).to.deep.equal([]);

      expect(await printDesignData.getCollectionDropId(1)).to.equal(0);

      await collectionCreator.connect(creator).updateDrop([1], "mynewdrop", 1);
      expect(await printDesignData.getDropCollectionIds(1)).to.deep.equal([1]);

      try {
        expect(await collectionCreator.removeDrop(1));
      } catch (err: any) {
        expect(err.message).to.include("AddressNotDesigner");
      }

      await collectionCreator.connect(creator).removeDrop(1);

      expect(await printDesignData.getDropURI(1)).to.equal("");
      expect(await printDesignData.getDropCreator(1)).to.equal(
        "0x0000000000000000000000000000000000000000"
      );
      expect(await printDesignData.getDropCollectionIds(1)).to.deep.equal([]);
    });

    it("Adds collection to a new drop", async () => {
      await collectionCreator.connect(creator).createDrop("mydropuri");

      await collectionCreator
        .connect(creator)
        .updateDrop([1], "anotherdropinstance", 2);

      expect(await printDesignData.getCollectionDropId(1)).to.equal(2);
    });

    it("Mint more collections and drops", async () => {
      await printAccessControl.addDesigner(await creatorTwo.getAddress());
      await collectionCreator
        .connect(creatorTwo)
        .createDrop("mysecondcreatordrop");

      const encodedData = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, address creatorAddress, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
        ],
        [
          {
            prices: ["200000000000000000000", "500000"],
            communityIds: [],
            acceptedTokens: [mona.address, usdt.address],
            uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
            fulfiller: "0x0000000000000000000000000000000000000000",
            creatorAddress: await creatorTwo.getAddress(),
            amount: 100,
            dropId: 3,
            unlimited: true,
            encrypted: false,
          },
        ]
      );

      await chromadinOpenAction
        .connect(hub)
        .initializePublicationAction(
          20,
          10,
          await hub.getAddress(),
          encodedData
        );

      await chromadinOpenAction
        .connect(hub)
        .initializePublicationAction(
          4001,
          10,
          await hub.getAddress(),
          encodedData
        );

      await collectionCreator.connect(creator).createDrop("mydropuri");

      try {
        await collectionCreator
          .connect(creator)
          .updateDrop([2, 3], "anotherdropinstance", 2);
      } catch (err: any) {
        expect(err.message).to.include("AddressNotDesigner");
      }

      expect(await printDesignData.getCollectionDropId(2)).to.equal(3);
      expect(await printDesignData.getCollectionDropId(3)).to.equal(3);
      expect(await printDesignData.getDropCollectionIds(3)).to.deep.equal([
        2, 3,
      ]);
    });

    it("Remove collection and updates drop", async () => {
      try {
        await collectionCreator.removeCollection(2);
      } catch (err: any) {
        expect(err.message).to.include("AddressNotDesigner");
      }
      expect(await printDesignData.getCollectionURI(2)).to.equal(
        "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk"
      );
      expect(await printDesignData.getCollectionPrices(2)).to.deep.equal([
        "200000000000000000000",
        "500000",
      ]);

      await collectionCreator.connect(creatorTwo).removeCollection(2);

      expect(await printDesignData.getCollectionURI(2)).to.equal("");
      expect(await printDesignData.getCollectionPrices(2)).to.deep.equal([]);
      expect(await printDesignData.getDropCollectionIds(3)).to.deep.equal([3]);
    });

    it("purchase a collection", async () => {
      const encodedDataOne = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [matic.address, 2]
      );

      await matic.transfer(
        await buyer.getAddress(),
        ethers.utils.parseEther("260")
      );

      await matic
        .connect(buyer)
        .approve(chromadinOpenAction.address, ethers.utils.parseEther("260"));

      const balanceCreator = await matic.balanceOf(await creator.getAddress());
      const balanceBuyer = await matic.balanceOf(await buyer.getAddress());

      await chromadinOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 50,
        publicationActedId: 10,
        actorProfileId: 1000,
        actorProfileOwner: await buyer.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: encodedDataOne,
      });

      expect(await matic.balanceOf(await creator.getAddress())).to.equal(
        balanceCreator.add("259000259000259000259")
      );
      expect(await matic.balanceOf(await buyer.getAddress())).to.equal(
        balanceBuyer.sub("259000259000259000259")
      );

      await matic.transfer(
        await buyer.getAddress(),
        ethers.utils.parseEther("660")
      );

      await matic
        .connect(buyer)
        .approve(chromadinOpenAction.address, ethers.utils.parseEther("660"));

      try {
        const encodedDataTwo = ethers.utils.defaultAbiCoder.encode(
          ["address", "uint256"],
          [matic.address, 5]
        );
        await chromadinOpenAction.connect(hub).processPublicationAction({
          publicationActedProfileId: 50,
          publicationActedId: 10,
          actorProfileId: 1000,
          actorProfileOwner: await buyer.getAddress(),
          transactionExecutor: await hub.getAddress(),
          referrerProfileIds: [],
          referrerPubIds: [],
          referrerPubTypes: [],
          actionModuleData: encodedDataTwo,
        });
      } catch (err: any) {
        expect(err.message).to.include("ExceedAmount");
      }

      await usdt.transfer(
        await buyer.getAddress(),
        ethers.utils.parseEther("300")
      );

      await usdt
        .connect(buyer)
        .approve(chromadinOpenAction.address, ethers.utils.parseEther("300"));

      const encodedDataThree = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [usdt.address, 1]
      );

      await chromadinOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 4001,
        publicationActedId: 10,
        actorProfileId: 1000,
        actorProfileOwner: await buyer.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: encodedDataThree,
      });

      expect(await printOrderData.getOrderSupply()).to.equal(0);
      expect(await printOrderData.getSubOrderSupply()).to.equal(0);
      expect(await printOrderData.getNFTOnlyOrderSupply()).to.equal(2);

      expect(await printOrderData.getNFTOnlyOrderPubId(2)).to.equal(10);
      expect(await printOrderData.getNFTOnlyOrderProfileId(2)).to.equal(4001);
      expect(await printOrderData.getNFTOnlyOrderChosenCurrency(2)).to.equal(
        usdt.address
      );
      expect(await printOrderData.getNFTOnlyOrderChosenCurrency(2)).to.equal(
        usdt.address
      );
      expect(await printOrderData.getNFTOnlyOrderMessages(2)).to.deep.equal([]);
      expect(await printOrderData.getNFTOnlyOrderTotalPrice(2)).to.equal(
        "200000000000000000000"
      );
      expect(await printOrderData.getNFTOnlyOrderCollectionId(2)).to.equal(3);
      expect(await printOrderData.getNFTOnlyOrderBuyer(2)).to.equal(
        await buyer.getAddress()
      );
      expect(await printOrderData.getNFTOnlyOrderTokenIds(2)).to.deep.equal([
        3,
      ]);
      expect(await printOrderData.getNFTOnlyOrderBuyerProfileId(2)).to.equal(
        1000
      );
      expect(
        await printOrderData.getAddressToNFTOnlyOrderIds(
          await buyer.getAddress()
        )
      ).to.deep.equal([1, 2]);

      try {
        await printOrderData
          .connect(creator)
          .setNFTOnlyOrderMessage("some first message", 2);
      } catch (err: any) {
        expect(err.message).to.include("InvalidAddress");
      }

      await printOrderData
        .connect(creatorTwo)
        .setNFTOnlyOrderMessage("some first message", 2);
      expect(await printOrderData.getNFTOnlyOrderMessages(2)).to.deep.equal([
        "some first message",
      ]);
      await printOrderData
        .connect(creatorTwo)
        .setNFTOnlyOrderMessage("some other message", 2);
      expect(await printOrderData.getNFTOnlyOrderMessages(2)).to.deep.equal([
        "some first message",
        "some other message",
      ]);
    });

    it("Test community functions", async () => {
      await printAccessControl.addCommunitySteward(await creator.getAddress());

      await communityCreator.connect(creator).createNewCommunity({
        validCreators: [
          await creator.getAddress(),
          await creatorTwo.getAddress(),
        ],
        validOrigins: [1],
        validPrintTypes: [6],
        valid20Addresses: [usdt.address],
        valid20Thresholds: ["200000000000000000000"],
        uri: "myurihere",
        steward: await creator.getAddress(),
      });

      expect(await printCommunityData.getCommunitySupply()).to.equal(1);
      expect(await printCommunityData.getCommunitySteward(1)).to.equal(
        await creator.getAddress()
      );
      expect(await printCommunityData.getCommunityURI(1)).to.equal("myurihere");
      expect(await printCommunityData.getCommunityMembers(1)).to.deep.equal([]);
      expect(
        await printCommunityData.getCommunityValidOriginKeys(1)
      ).to.deep.equal([1]);
      expect(
        await printCommunityData.getCommunityValidCreatorKeys(1)
      ).to.deep.equal([
        await creator.getAddress(),
        await creatorTwo.getAddress(),
      ]);
      expect(
        await printCommunityData.getCommunityValidPrintTypeKeys(1)
      ).to.deep.equal([6]);
      expect(
        await printCommunityData.getCommunityValid20AddressKeys(1)
      ).to.deep.equal([usdt.address]);
      expect(
        await printCommunityData.getCommunityIsValidCreator(
          await creator.getAddress(),
          1
        )
      ).to.be.true;
      expect(
        await printCommunityData.getCommunityIsValidCreator(
          await buyer.getAddress(),
          1
        )
      ).to.be.false;
      expect(await printCommunityData.getCommunityIsValidOrigin(1, 1)).to.be
        .true;
      expect(await printCommunityData.getCommunityIsValidOrigin(0, 1)).to.be
        .false;
      expect(await printCommunityData.getCommunityIsValidPrintType(3, 1)).to.be
        .false;
      expect(await printCommunityData.getCommunityIsValidPrintType(6, 1)).to.be
        .true;
      expect(
        await printCommunityData.getCommunityValid20Threshold(usdt.address, 1)
      ).to.equal("200000000000000000000");

      // update community
      await communityCreator.connect(creator).updateExistingCommunity(
        {
          validCreators: [await creator.getAddress(), await buyer.getAddress()],
          validOrigins: [1, 2, 3],
          validPrintTypes: [6, 5, 4],
          valid20Addresses: [eth.address, mona.address],
          valid20Thresholds: ["500000000000000000000", "100"],
          uri: "mynewurihere",
          steward: await creator.getAddress(),
        },
        1
      );

      expect(await printCommunityData.getCommunitySteward(1)).to.equal(
        await creator.getAddress()
      );
      expect(await printCommunityData.getCommunityURI(1)).to.equal(
        "mynewurihere"
      );
      expect(
        await printCommunityData.getCommunityValidOriginKeys(1)
      ).to.deep.equal([1, 2, 3]);
      expect(
        await printCommunityData.getCommunityValidCreatorKeys(1)
      ).to.deep.equal([await creator.getAddress(), await buyer.getAddress()]);
      expect(
        await printCommunityData.getCommunityValidPrintTypeKeys(1)
      ).to.deep.equal([6, 5, 4]);
      expect(
        await printCommunityData.getCommunityValid20AddressKeys(1)
      ).to.deep.equal([eth.address, mona.address]);
      expect(
        await printCommunityData.getCommunityIsValidCreator(
          await creator.getAddress(),
          1
        )
      ).to.be.true;
      expect(
        await printCommunityData.getCommunityIsValidCreator(
          await buyer.getAddress(),
          1
        )
      ).to.be.true;
      expect(await printCommunityData.getCommunityIsValidOrigin(1, 1)).to.be
        .true;
      expect(await printCommunityData.getCommunityIsValidOrigin(0, 1)).to.be
        .false;
      expect(await printCommunityData.getCommunityIsValidPrintType(3, 1)).to.be
        .false;
      expect(await printCommunityData.getCommunityIsValidPrintType(6, 1)).to.be
        .true;
      expect(
        await printCommunityData.getCommunityValid20Threshold(eth.address, 1)
      ).to.equal("500000000000000000000");
      expect(
        await printCommunityData.getCommunityValid20Threshold(mona.address, 1)
      ).to.equal("100");

      await mona.transfer(await buyer.getAddress(), "100");

      await communityCreator.joinCommunity(await buyer.getAddress(), 1, 535);

      const member = (await printCommunityData.getCommunityMembers(1))[0];

      expect(member.memberAddress).to.equal(await buyer.getAddress());
      expect(member.memberProfileId).to.equal(535);
      expect(await printCommunityData.getIsCommunityMember(1, 535)).to.be.true;

      try {
        await communityCreator.leaveCommunity(1, 535);
      } catch (err: any) {
        expect(err.message).to.include("InvalidAddress");
      }

      await communityCreator.connect(buyer).leaveCommunity(1, 535);

      expect(await printCommunityData.getCommunityMembers(1)).to.deep.equal([]);

      await communityCreator.joinCommunity(await buyer.getAddress(), 1, 535);
      const newMember = (await printCommunityData.getCommunityMembers(1))[0];

      expect(newMember.memberAddress).to.equal(await buyer.getAddress());
      expect(newMember.memberProfileId).to.equal(535);
      expect(await printCommunityData.getIsCommunityMember(1, 535)).to.be.true;

      await collectionCreator
        .connect(creatorTwo)
        .createDrop("newcommunitydrop");
      const myEncodedData = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, address creatorAddress, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
        ],
        [
          {
            prices: ["1000000"],
            communityIds: [1],
            acceptedTokens: [
              mona.address,
              matic.address,
              eth.address,
              usdt.address,
            ],
            uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
            fulfiller: "0x0000000000000000000000000000000000000000",
            creatorAddress: await creatorTwo.getAddress(),
            amount: 1,
            dropId: 5,
            unlimited: false,
            encrypted: false,
          },
        ]
      );

      await chromadinOpenAction
        .connect(hub)
        .initializePublicationAction(
          100,
          10,
          await hub.getAddress(),
          myEncodedData
        );

      expect(await printDesignData.getCollectionCommunityIds(4)).to.deep.equal([
        1,
      ]);

      const encodedDataOne = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256"],
        [matic.address, 1]
      );

      await matic
        .connect(admin)
        .approve(chromadinOpenAction.address, "100000000000000");

      try {
        await chromadinOpenAction.connect(hub).processPublicationAction({
          publicationActedProfileId: 100,
          publicationActedId: 10,
          actorProfileId: 40,
          actorProfileOwner: await admin.getAddress(),
          transactionExecutor: await hub.getAddress(),
          referrerProfileIds: [],
          referrerPubIds: [],
          referrerPubTypes: [],
          actionModuleData: encodedDataOne,
        });
      } catch (err: any) {
        expect(err.message).to.include("InvalidCommunityMember");
      }

      await matic.transfer(await buyer.getAddress(), "100000000000000");

      await matic
        .connect(buyer)
        .approve(chromadinOpenAction.address, "100000000000000");

      await chromadinOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 100,
        publicationActedId: 10,
        actorProfileId: 535,
        actorProfileOwner: await buyer.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: encodedDataOne,
      });

      expect(
        await printOrderData.getAddressToNFTOnlyOrderIds(
          await buyer.getAddress()
        )
      ).to.deep.equal([1, 2, 3]);
    });

    it("Tests listener open action", async () => {
      await collectionCreator
        .connect(creatorListener)
        .createDrop("listenerdrop");
      const myEncodedData = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, address creatorAddress, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
          "uint8",
        ],
        [
          {
            prices: ["1000000", "4000000", "540000000000000000"],
            communityIds: [],
            acceptedTokens: [
              mona.address,
              matic.address,
              eth.address,
              usdt.address,
            ],
            uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
            fulfiller: await fulfiller.getAddress(),
            creatorAddress: await creatorListener.getAddress(),
            amount: 1,
            dropId: 6,
            unlimited: false,
            encrypted: false,
          },
          3,
        ]
      );

      await listenerOpenAction
        .connect(hub)
        .initializePublicationAction(
          454,
          4789,
          await hub.getAddress(),
          myEncodedData
        );

      expect(await printDesignData.getCollectionSupply()).to.equal(5);
      expect(await printDesignData.getCollectionPrices(5)).to.deep.equal([
        "1000000",
        "4000000",
        "540000000000000000",
      ]);
      expect(await printDesignData.getCollectionFulfiller(5)).to.equal(
        await fulfiller.getAddress()
      );
      expect(await printDesignData.getCollectionPrintType(5)).to.equal(3);

      await usdt.transfer(await otherBuyer.getAddress(), "540000000000000000");

      await usdt
        .connect(otherBuyer)
        .approve(listenerOpenAction.address, "540000000000000000");

      const encodedDataOne = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "string", "address", "bool"],
        [2, 1, "myencrypteddetails", usdt.address, false]
      );
      await listenerOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 454,
        publicationActedId: 4789,
        actorProfileId: 20,
        actorProfileOwner: await otherBuyer.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: encodedDataOne,
      });

      expect(await printOrderData.getOrderSupply()).to.equal(1);
      expect(await printOrderData.getSubOrderSupply()).to.equal(1);
      expect(await printOrderData.getOrderDetails(1)).to.equal(
        "myencrypteddetails"
      );
      expect(await printOrderData.getOrderBuyer(1)).to.equal(
        await otherBuyer.getAddress()
      );
      expect(await printOrderData.getOrderChosenCurrency(1)).to.equal(
        usdt.address
      );
      expect(await printOrderData.getOrderTotalPrice(1)).to.equal(
        "540000000000000000"
      );

      try {
        expect(await printOrderData.setOrderDetails("myneworderdetails", 1));
      } catch (err: any) {
        expect(err.message).to.include("InvalidAddress");
      }
      expect(
        await printOrderData
          .connect(otherBuyer)
          .setOrderDetails("myneworderdetails", 1)
      );
      expect(await printOrderData.getOrderDetails(1)).to.equal(
        "myneworderdetails"
      );

      try {
        expect(await printOrderData.setOrderMessage("mymessage", 1));
      } catch (err: any) {
        expect(err.message).to.include("InvalidFulfiller");
      }

      expect(
        await printOrderData.connect(fulfiller).setOrderMessage("mymessage", 1)
      );
      expect(await printOrderData.getOrderMessages(1)).to.deep.equal([
        "mymessage",
      ]);

      expect(await printOrderData.getSubOrderStatus(1)).to.equal(3);
      expect(await printOrderData.getSubOrderIsFulfilled(1)).to.be.false;
      expect(await printOrderData.getSubOrderOrderId(1)).to.equal(1);
      expect(await printOrderData.getSubOrderFulfiller(1)).to.equal(
        await fulfiller.getAddress()
      );
      expect(await printOrderData.getSubOrderCollectionId(1)).to.equal(5);
      expect(await printOrderData.getSubOrderAmount(1)).to.equal(1);
      expect(await printOrderData.getSubOrderPrice(1)).to.equal(
        "540000000000000000"
      );
      expect(await printOrderData.getOrderSubOrders(1)).to.deep.equal([1]);
      expect(
        await printOrderData.getAddressToOrderIds(await otherBuyer.getAddress())
      ).to.deep.equal([1]);

      try {
        await printOrderData.setSubOrderStatus(1, 2);
      } catch (err: any) {
        expect(err.message).to.include("InvalidFulfiller");
      }

      await printOrderData.connect(fulfiller).setSubOrderStatus(1, 2);
      expect(await printOrderData.getSubOrderStatus(1)).to.equal(2);

      try {
        await printOrderData.setSubOrderisFulfilled(1);
      } catch (err: any) {
        expect(err.message).to.include("InvalidFulfiller");
      }
      await printOrderData.connect(fulfiller).setSubOrderisFulfilled(1);
      expect(await printOrderData.getSubOrderIsFulfilled(1)).to.be.true;

      const communityEncoded = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, address creatorAddress, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
          "uint8",
        ],
        [
          {
            prices: ["400990000", "400990000", "400990000"],
            communityIds: [2],
            acceptedTokens: [
              mona.address,
              matic.address,
              eth.address,
              usdt.address,
            ],
            uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
            fulfiller: await fulfiller.getAddress(),
            creatorAddress: await creatorListener.getAddress(),
            amount: 5,
            dropId: 6,
            unlimited: false,
            encrypted: false,
          },
          3,
        ]
      );

      await listenerOpenAction
        .connect(hub)
        .initializePublicationAction(
          124,
          1337,
          await hub.getAddress(),
          communityEncoded
        );

      await communityCreator.connect(creator).createNewCommunity({
        validCreators: [await creatorListener.getAddress()],
        validOrigins: [0, 1, 2, 3, 4],
        validPrintTypes: [3],
        valid20Addresses: [eth.address],
        valid20Thresholds: ["20000"],
        uri: "myurihere",
        steward: await creator.getAddress(),
      });

      await eth.transfer(await otherBuyer.getAddress(), "10000000000");

      await eth
        .connect(otherBuyer)
        .approve(listenerOpenAction.address, "10000000000");

      await communityCreator.joinCommunity(
        await otherBuyer.getAddress(),
        2,
        20
      );

      const encodedDataTwo = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "string", "address", "bool"],
        [0, 2, "myencrypteddetails", eth.address, false]
      );
      await listenerOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 124,
        publicationActedId: 1337,
        actorProfileId: 20,
        actorProfileOwner: await otherBuyer.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: encodedDataTwo,
      });

      expect(await printOrderData.getOrderSupply()).to.equal(2);
      expect(await printOrderData.getSubOrderSupply()).to.equal(2);
      expect(await printOrderData.getSubOrderAmount(2)).to.equal(2);
      expect(await printOrderData.getSubOrderPrice(2)).to.equal("801980000");
    });

    it("Tests coin op open action", async () => {
      await printSplitsData.setFulfillerSplit(
        await fulfillerCoinOp.getAddress(),
        3,
        "15000000000000000000"
      ); //15%
      await printSplitsData.setFulfillerBase(
        await fulfillerCoinOp.getAddress(),
        3,
        "40000000000000000000"
      );
      await collectionCreator.connect(creatorCoinOp).createDrop("coinOpdrop");
      const myEncodedData = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, address creatorAddress, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
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
            acceptedTokens: [mona.address],
            uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
            fulfiller: await fulfillerCoinOp.getAddress(),
            creatorAddress: await creatorCoinOp.getAddress(),
            amount: 100,
            dropId: 7,
            unlimited: true,
            encrypted: false,
          },
          3,
        ]
      );

      await coinOpOpenAction
        .connect(hub)
        .initializePublicationAction(
          127,
          438,
          await hub.getAddress(),
          myEncodedData
        );

      expect(await printDesignData.getCollectionFulfiller(7)).to.equal(
        await fulfillerCoinOp.getAddress()
      );
      expect(
        await printSplitsData.getFulfillerBase(
          await fulfillerCoinOp.getAddress(),
          3
        )
      ).to.equal("40000000000000000000");
      expect(
        await printSplitsData.getFulfillerSplit(
          await fulfillerCoinOp.getAddress(),
          3
        )
      ).to.equal("15000000000000000000");

      expect(
        await printSplitsData.getFulfillerBase(
          await fulfillerCoinOp.getAddress(),
          4
        )
      ).to.equal(0);
      expect(
        await printSplitsData.getFulfillerSplit(
          await fulfillerCoinOp.getAddress(),
          1
        )
      ).to.equal(0);

      try {
        const encodedDataTwo = ethers.utils.defaultAbiCoder.encode(
          ["uint256", "uint256", "string", "address", "bool"],
          [1, 6, "mycoinopencrypteddetails", eth.address, false]
        );
        await coinOpOpenAction.connect(hub).processPublicationAction({
          publicationActedProfileId: 127,
          publicationActedId: 438,
          actorProfileId: 862,
          actorProfileOwner: await otherBuyer.getAddress(),
          transactionExecutor: await hub.getAddress(),
          referrerProfileIds: [],
          referrerPubIds: [],
          referrerPubTypes: [],
          actionModuleData: encodedDataTwo,
        });
      } catch (err: any) {
        expect(err.message).to.include("CurrencyNotWhitelisted");
      }

      await mona.transfer(
        await otherBuyer.getAddress(),
        ethers.utils.parseEther("120").mul(6)
      );

      await mona
        .connect(otherBuyer)
        .approve(
          coinOpOpenAction.address,
          ethers.utils.parseEther("120").mul(6)
        );

      const balanceCreator = await mona.balanceOf(
        await creatorCoinOp.getAddress()
      );
      const balanceBuyer = await mona.balanceOf(await otherBuyer.getAddress());
      const balanceFulfiller = await mona.balanceOf(
        await fulfillerCoinOp.getAddress()
      );

      const encodedDataThree = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "string", "address", "bool"],
        [1, 6, "mycoinopencrypteddetails", mona.address, false]
      );
      await coinOpOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 127,
        publicationActedId: 438,
        actorProfileId: 862,
        actorProfileOwner: await otherBuyer.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: encodedDataThree,
      });

      const exchangeRate = await printSplitsData.getRateByCurrency(
        mona.address
      );
      const weiDivisor = await printSplitsData.getWeiByCurrency(mona.address);

      const totalAmount = ethers.utils
        .parseEther("120")
        .mul(6)
        .mul(weiDivisor)
        .div(exchangeRate);

      const fBase = ethers.utils
        .parseEther("40")
        .mul(6)
        .mul(weiDivisor)
        .div(exchangeRate);

      const fulfillerAmount = fBase.add(
        totalAmount
          .mul("15000000000000000000")
          .div(ethers.utils.parseUnits("1", 20))
      );

      const designerAmount = totalAmount.sub(fulfillerAmount);

      expect(await mona.balanceOf(await otherBuyer.getAddress())).to.equal(
        balanceBuyer.sub(totalAmount)
      );
      expect(await mona.balanceOf(await fulfillerCoinOp.getAddress())).to.equal(
        balanceFulfiller.add(fulfillerAmount)
      );
      expect(await mona.balanceOf(await creatorCoinOp.getAddress())).to.equal(
        balanceCreator.add(designerAmount)
      );

      try {
        await collectionCreator.connect(creatorCoinOp).removeCollection(7);
      } catch (err: any) {
        expect(err.message).to.include("InvalidRemoval");
      }

      await mona.transfer(
        await buyer.getAddress(),
        ethers.utils.parseEther("200")
      );

      await mona
        .connect(buyer)
        .approve(coinOpOpenAction.address, ethers.utils.parseEther("200"));

      const encodedDataFour = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "string", "address", "bool"],
        [3, 1, "mycoinopencrypteddetails", mona.address, false]
      );
      await coinOpOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 127,
        publicationActedId: 438,
        actorProfileId: 195,
        actorProfileOwner: await buyer.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: encodedDataFour,
      });

      expect(await printDesignData.getCollectionSupply()).to.equal(7);
      expect(await printOrderData.getOrderSupply()).to.equal(4);
      expect(await printOrderData.getOrderBuyer(4)).to.equal(
        await buyer.getAddress()
      );
      expect(await printOrderData.getOrderTotalPrice(4)).to.equal(
        ethers.utils.parseEther("200")
      );

      const comEncoded = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, address creatorAddress, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
          "uint8",
        ],
        [
          {
            prices: [
              "200000000000000000000",
              "200000000000000000000",
              "200000000000000000000",
            ],
            communityIds: [2],
            acceptedTokens: [
              mona.address,
              matic.address,
              eth.address,
              usdt.address,
            ],
            uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
            fulfiller: await fulfillerCoinOp.getAddress(),
            creatorAddress: await creatorCoinOp.getAddress(),
            amount: 10,
            dropId: 7,
            unlimited: true,
            encrypted: false,
          },
          5,
        ]
      );

      await coinOpOpenAction
        .connect(hub)
        .initializePublicationAction(
          19,
          13,
          await hub.getAddress(),
          comEncoded
        );

      await eth.transfer(
        await otherBuyer.getAddress(),
        ethers.utils.parseEther("200")
      );

      await eth
        .connect(otherBuyer)
        .approve(coinOpOpenAction.address, "200000000000000000000");

      const encodedDataTwo = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "string", "address", "bool"],
        [0, 1, "myencrypteddetails", eth.address, false]
      );
      await coinOpOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 19,
        publicationActedId: 13,
        actorProfileId: 20,
        actorProfileOwner: await otherBuyer.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: encodedDataTwo,
      });

      const fiatSkip = ethers.utils.defaultAbiCoder.encode(
        ["uint256", "uint256", "string", "address", "bool"],
        [0, 1, "myencrypteddetails", eth.address, true]
      );

      await printAccessControl.addVerifiedFiat(
        await otherBuyer.getAddress(),
        13,
        19
      );

      await coinOpOpenAction.connect(hub).processPublicationAction({
        publicationActedProfileId: 19,
        publicationActedId: 13,
        actorProfileId: 20,
        actorProfileOwner: await otherBuyer.getAddress(),
        transactionExecutor: await hub.getAddress(),
        referrerProfileIds: [],
        referrerPubIds: [],
        referrerPubTypes: [],
        actionModuleData: fiatSkip,
      });

      const fiatEncoded = ethers.utils.defaultAbiCoder.encode(
        [
          "tuple(uint256[] prices, uint256[] communityIds, address[] acceptedTokens, string uri, address fulfiller, address creatorAddress, uint256 amount, uint256 dropId, bool unlimited, bool encrypted)",
          "uint8",
        ],
        [
          {
            prices: [
              "200000000000000000000",
              "200000000000000000000",
              "200000000000000000000",
            ],
            communityIds: [],
            acceptedTokens: [
              mona.address,
              matic.address,
              eth.address,
              usdt.address,
            ],
            uri: "ipfs://QmVY1588Y98iMKeaDskCq7R3GrbTBSLpoCrzgC1MgXUkgk",
            fulfiller: await fulfillerCoinOp.getAddress(),
            creatorAddress: await creatorCoinOp.getAddress(),
            amount: 10,
            dropId: 7,
            unlimited: true,
            encrypted: false,
          },
          5,
        ]
      );

      await coinOpOpenAction
        .connect(hub)
        .initializePublicationAction(1, 2, await hub.getAddress(), fiatEncoded);

      try {
        await coinOpOpenAction.connect(hub).processPublicationAction({
          publicationActedProfileId: 1,
          publicationActedId: 2,
          actorProfileId: 75,
          actorProfileOwner: await buyer.getAddress(),
          transactionExecutor: await hub.getAddress(),
          referrerProfileIds: [],
          referrerPubIds: [],
          referrerPubTypes: [],
          actionModuleData: fiatSkip,
        });
      } catch (err: any) {
        expect(err.message).to.include("ERC20: insufficient allowance")
      }
    });
  });
});
