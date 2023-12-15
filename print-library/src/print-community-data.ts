import { Address, BigInt, ByteArray, Bytes } from "@graphprotocol/graph-ts";
import { CommunityMetadata as CommunityMetadataTemplate } from "../generated/templates";
import {
  CommunityCreated as CommunityCreatedEvent,
  CommunityMemberAdded as CommunityMemberAddedEvent,
  CommunityMemberRemoved as CommunityMemberRemovedEvent,
  CommunityUpdated as CommunityUpdatedEvent,
  PrintCommunityData,
} from "../generated/PrintCommunityData/PrintCommunityData";
import {
  CommunityCreated,
  CommunityMemberAdded,
  CommunityMemberRemoved,
  CommunityUpdated,
} from "../generated/schema";

export function handleCommunityCreated(event: CommunityCreatedEvent): void {
  let entity = new CommunityCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.communityId)
  );
  entity.communityId = event.params.communityId;
  entity.steward = event.params.steward;
  entity.uri = event.params.uri;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let ipfsHash = event.params.uri.split("/").pop();

  if (ipfsHash != null) {
    entity.communityMetadata = ipfsHash;
    CommunityMetadataTemplate.create(ipfsHash);
  }

  let community = PrintCommunityData.bind(
    Address.fromString("0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60")
  );

  entity.validPrintTypes = community
    .getCommunityValidPrintTypeKeys(entity.communityId)
    .map<string>((item) => item.toString());
  entity.validOrigins = community
    .getCommunityValidOriginKeys(entity.communityId)
    .map<string>((item) => item.toString());
  entity.validCreators = community
    .getCommunityValidCreatorKeys(entity.communityId)
    .map<string>((target) => target.toString());
  entity.valid20Tokens = community
    .getCommunityValid20AddressKeys(entity.communityId)
    .map<string>((target) => target.toString());

  let valid20Tokens = entity.valid20Tokens;
  if (Array.isArray(valid20Tokens)) {
    if (valid20Tokens) {
      let thresholds: Array<BigInt> = [];

      for (let i = 0; i < (<Array<string>>valid20Tokens).length; i++) {
        let token = <String | null>valid20Tokens[i];
        if (token !== null) {
          const amount = community.getCommunityValid20Threshold(
            Address.fromString(<string>token),
            entity.communityId
          );
          thresholds.push(amount);
        }
      }

      entity.valid20Thresholds = thresholds;
    }
  }

  entity.members = community
    .getCommunityMembers(entity.communityId)
    .map<string>((item) => item.memberProfileId.toString());

  entity.save();
}

export function handleCommunityMemberAdded(
  event: CommunityMemberAddedEvent
): void {
  let entity = new CommunityMemberAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.communityId)
  );
  entity.communityId = event.params.communityId;
  entity.memberAddress = event.params.memberAddress;
  entity.memberProfileId = event.params.memberProfileId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let entityOrder = CommunityCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(entity.communityId))
  );

  if (entityOrder) {
    let newMembers: Array<string> | null = entityOrder.members;
    if (!newMembers) {
      newMembers = [];
    }
    newMembers.push(entity.memberProfileId.toString());
    entityOrder.members = newMembers;
    entityOrder.save();
  }

  entity.save();
}

export function handleCommunityMemberRemoved(
  event: CommunityMemberRemovedEvent
): void {
  let entity = new CommunityMemberRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.communityId)
  );
  entity.communityId = event.params.communityId;
  entity.memberProfileId = event.params.memberProfileId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let entityOrder = CommunityCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(entity.communityId))
  );

  if (entityOrder) {
    let newMembers: Array<string> = [];

    let currentMembers = entityOrder.members;
    if (Array.isArray(currentMembers)) {
      if (currentMembers) {
        for (let i = 0; i < (<Array<String>>currentMembers).length; i++) {
          let member = <String | null>currentMembers[i];
          if (member !== null) {
            if (member != entity.memberProfileId.toString()) {
              newMembers.push(<string>member);
            }
          }
        }
      }

      entityOrder.members = newMembers;
      entityOrder.save();
    }
  }

  entity.save();
}

export function handleCommunityUpdated(event: CommunityUpdatedEvent): void {
  let entity = new CommunityUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.communityId)
  );
  entity.communityId = event.params.communityId;
  entity.steward = event.params.steward;
  entity.uri = event.params.uri;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let ipfsHash = event.params.uri.split("/").pop();

  let entityOrder = CommunityCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(entity.communityId))
  );

  if (entityOrder) {
    if (ipfsHash != null) {
      entityOrder.communityMetadata = ipfsHash;
      CommunityMetadataTemplate.create(ipfsHash);
    }

    let community = PrintCommunityData.bind(
      Address.fromString("0x8fAA6114f8345672DE9e4e4302aD497a52a2fd60")
    );

    entityOrder.validPrintTypes = community
      .getCommunityValidPrintTypeKeys(entityOrder.communityId)
      .map<string>((item) => item.toString());
    entityOrder.validOrigins = community
      .getCommunityValidOriginKeys(entityOrder.communityId)
      .map<string>((item) => item.toString());
    entityOrder.validCreators = community
      .getCommunityValidCreatorKeys(entityOrder.communityId)
      .map<string>((target) => target.toString());
    entityOrder.valid20Tokens = community
      .getCommunityValid20AddressKeys(entityOrder.communityId)
      .map<string>((target) => target.toString());

    let thresholds: Array<BigInt> = [];
    let valid20Tokens = entityOrder.valid20Tokens;
    if (Array.isArray(valid20Tokens)) {
      if (valid20Tokens) {
        for (let i = 0; i < (<Array<String>>valid20Tokens).length; i++) {
          let token = <String | null>valid20Tokens[i];
          if (token) {
            const amount = community.getCommunityValid20Threshold(
              Address.fromString(<string>token),
              entityOrder.communityId
            );
            thresholds.push(amount);
          }
        }
      }

      entityOrder.valid20Thresholds = thresholds;
    }

    entityOrder.members = community
      .getCommunityMembers(entityOrder.communityId)
      .map<string>((item) => item.memberProfileId.toString());

    entityOrder.save();
  }

  entity.save();
}
