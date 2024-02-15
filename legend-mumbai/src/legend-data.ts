import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  store,
} from "@graphprotocol/graph-ts";
import {
  AllClaimedMilestone as AllClaimedMilestoneEvent,
  GrantCreated as GrantCreatedEvent,
  GrantDeleted as GrantDeletedEvent,
  GrantFunded as GrantFundedEvent,
  LegendData,
  MilestoneClaimed as MilestoneClaimedEvent,
  MilestoneStatusUpdated as MilestoneStatusUpdatedEvent,
} from "../generated/LegendData/LegendData";
import {
  AllClaimedMilestone,
  CollectionGrantId,
  CurrencyGoal,
  Funded,
  GrantCreated,
  GrantDeleted,
  GrantFunded,
  LevelInfo,
  Milestone,
  MilestoneClaimed,
  MilestoneStatusUpdated,
} from "../generated/schema";
import { GrantMetadata as GrantMetadataTemplate } from "../generated/templates";

export function handleAllClaimedMilestone(
  event: AllClaimedMilestoneEvent
): void {
  let entity = new AllClaimedMilestone(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.grantId = event.params.grantId;
  entity.milestone = event.params.milestone;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleGrantCreated(event: GrantCreatedEvent): void {
  let entity = new GrantCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(ByteArray.fromBigInt(event.params.grantId));
  entity.grantId = event.params.grantId;
  entity.creator = event.params.creator;
  entity.pubId = event.params.pubId;
  entity.profileId = event.params.profileId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let data = LegendData.bind(
    Address.fromString("0x04D891EDD599DE3a19bBA5A3a180479b658908AC")
  );

  let ipfsHash = data.getGrantURI(entity.grantId);
  if (ipfsHash != null) {
    if (ipfsHash.includes("/")) {
      ipfsHash = ipfsHash.split("/").pop();
    }
    if (ipfsHash) {
      entity.uri = ipfsHash;
      GrantMetadataTemplate.create(ipfsHash);
    }
  }

  entity.acceptedCurrencies = data
    .getGrantAcceptedCurrencies(entity.grantId)
    .map<Bytes>((target: Bytes) => target);
  entity.granteeAddresses = data
    .getGrantAddresses(entity.grantId)
    .map<Bytes>((target: Bytes) => target);

  let splits: Array<BigInt> = [];
  for (let h = 0; h < entity.granteeAddresses.length; h++) {
    splits.push(
      data.getGranteeSplitAmount(
        Address.fromBytes(entity.granteeAddresses[h]),
        entity.grantId
      )
    );
  }
  entity.splits = splits;

  let milestones: Array<string> = [];

  for (let i = 0; i < 3; i++) {
    let milestoneId = entity.grantId.toString() + ipfsHash + (i + 1).toString();
    let milestone = new Milestone(milestoneId);
    let currencyGoals: Array<string> = [];
    if (<Array<Bytes> | null>entity.acceptedCurrencies !== null) {
      for (
        let j = 0;
        j < (<Array<Bytes>>entity.acceptedCurrencies).length;
        j++
      ) {
        let address: string = (<Bytes>(
          entity.acceptedCurrencies[j]
        )).toHexString();
        let currencyId =
          entity.grantId.toString() +
          ipfsHash +
          (i + 1).toString() +
          address +
          j.toString();
        let currencyGoal = new CurrencyGoal(currencyId);
        currencyGoal.amount = data.getMilestoneGoalToCurrency(
          Address.fromBytes(entity.acceptedCurrencies[j]),
          entity.grantId,
          i + 1
        );
        currencyGoal.currency = entity.acceptedCurrencies[j];

        currencyGoal.save();
        currencyGoals.push(currencyId);
      }
    }

    milestone.currencyGoal = currencyGoals;
    milestone.allClaimed = data.getAllClaimedMilestone(entity.grantId, i + 1);
    milestone.submitBy = data.getMilestoneSubmitBy(entity.grantId, i + 1);
    milestone.status = BigInt.fromI32(
      data.getMilestoneStatus(entity.grantId, i + 1)
    );

    milestone.save();
    milestones.push(milestoneId);
  }

  let levelInfos: Array<string> = [];

  for (let i = 0; i < 6; i++) {
    let levelInfoId = (i + 2).toString() + entity.grantId.toString() + ipfsHash;
    let levelInfo = new LevelInfo(levelInfoId);

    levelInfo.amounts = data.getGrantLevelAmounts(entity.grantId, i + 2);
    levelInfo.collectionIds = data.getGrantLevelCollectionIds(
      entity.grantId,
      i + 2
    );

    const collections: Array<BigInt> | null = levelInfo.collectionIds;

    if (collections !== null) {
      for (let k = 0; k < collections.length; k++) {
        let collectionGrant = CollectionGrantId.load(collections[k].toString());

        if (collectionGrant !== null) {
          let grants = collectionGrant.grants;

          if (!grants.includes(entity.grantId)) {
            grants.push(entity.grantId);
          }
          collectionGrant.grants = grants;
        } else {
          collectionGrant = new CollectionGrantId(collections[k].toString());
          collectionGrant.collectionId = collections[k];
          collectionGrant.grants = [entity.grantId];
        }

        collectionGrant.save();
      }
    }

    levelInfo.level = BigInt.fromI32(i + 2);

    levelInfo.save();
    levelInfos.push(levelInfoId);
  }

  entity.levelInfo = levelInfos;

  entity.milestones = milestones;
  entity.save();
}

export function handleGrantDeleted(event: GrantDeletedEvent): void {
  let entity = new GrantDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.grantId = event.params.grantId;
  entity.deleter = event.params.deleter;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let grantEntity = GrantCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.grantId))
  );

  if (grantEntity !== null) {
    if (grantEntity.levelInfo) {
      for (let i = 0; i < 6; i++) {
        if (<string>grantEntity.levelInfo[i] !== null) {
          store.remove("LevelInfo", <string>grantEntity.levelInfo[i]);
        }
      }
    }

    if (grantEntity.milestones) {
      for (let i = 0; i < 3; i++) {
        if (<string | null>grantEntity.milestones[i] !== null) {
          let milestone = Milestone.load(<string>grantEntity.milestones[i]);

          if (<Milestone | null>milestone !== null) {
            let goals: Array<string> | null = (<Milestone>milestone)
              .currencyGoal;

            if (goals) {
              for (let k = 0; k < (<Array<string>>goals).length; k++) {
                if (<string | null>goals[k] !== null) {
                  store.remove("CurrencyGoal", <string>goals[k]);
                }
              }
            }
          }

          store.remove("Milestone", <string>grantEntity.milestones[i]);
        }
      }
    }

    if (<string | null>grantEntity.grantMetadata !== null) {
      store.remove("GrantMetadata", <string>grantEntity.grantMetadata);
    }

    store.remove(
      "GrantCreated",
      Bytes.fromByteArray(
        ByteArray.fromBigInt(event.params.grantId)
      ).toHexString()
    );
  }

  entity.save();
}

export function handleGrantFunded(event: GrantFundedEvent): void {
  let entity = new GrantFunded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );

  entity.currency = event.params.currency;
  entity.grantId = event.params.grantId;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let grantEntity = GrantCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.grantId))
  );

  if (grantEntity !== null) {
    let fundedId = entity.grantId.toString() + entity.currency.toString();

    let funded = Funded.load(fundedId);

    if (funded !== null) {
      funded.funded = funded.funded.plus(entity.amount);
      funded.save();
    } else {
      let fundedAmounts: Array<string> = [];
      if (grantEntity.fundedAmount !== null) {
        fundedAmounts = <Array<string>>grantEntity.fundedAmount;
      }

      let funded = new Funded(fundedId);
      funded.currency = entity.currency;
      funded.funded = entity.amount;
      funded.save();

      fundedAmounts.push(fundedId);

      grantEntity.fundedAmount = fundedAmounts;
    }

    grantEntity.save();
  }

  entity.save();
}

export function handleMilestoneClaimed(event: MilestoneClaimedEvent): void {
  let entity = new MilestoneClaimed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.claimer = event.params.claimer;
  entity.milestone = event.params.milestone;
  entity.grantId = event.params.grantId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMilestoneStatusUpdated(
  event: MilestoneStatusUpdatedEvent
): void {
  let entity = new MilestoneStatusUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.updater = event.params.updater;
  entity.grantId = event.params.grantId;
  entity.milestone = event.params.milestone;
  entity.status = event.params.status;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
