import {
  Address,
  BigInt,
  ByteArray,
  Bytes,
  ipfs,
  log,
  store,
} from "@graphprotocol/graph-ts";
import {
  CollectionCreated as CollectionCreatedEvent,
  CollectionDeleted as CollectionDeletedEvent,
  CollectionMintedTokensSet as CollectionMintedTokensSetEvent,
  CollectionTokenIdsSet as CollectionTokenIdsSetEvent,
  DropCollectionsUpdated as DropCollectionsUpdatedEvent,
  DropCreated as DropCreatedEvent,
  DropDeleted as DropDeletedEvent,
  PrintDesignData,
  TokensMinted as TokensMintedEvent,
} from "../generated/PrintDesignData/PrintDesignData";
import {
  CollectionMetadata as CollectionMetadataTemplate,
  DropMetadata as DropMetadataTemplate,
} from "../generated/templates";
import {
  CollectionCreated,
  CollectionDeleted,
  CollectionMintedTokensSet,
  CollectionTokenIdsSet,
  DropCollectionsUpdated,
  DropCreated,
  DropDeleted,
  PrintTypeCollectionRegistry,
  TokensMinted,
} from "../generated/schema";
import { PrintSplitData } from "../generated/PrintSplitData/PrintSplitData";

export function handleCollectionCreated(event: CollectionCreatedEvent): void {
  let entity = new CollectionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.collectionId)
  );
  entity.collectionId = event.params.collectionId;
  entity.pubId = event.params.pubId;
  entity.profileId = event.params.profileId;
  entity.uri = event.params.uri;
  entity.amount = event.params.amount;
  entity.owner = event.params.owner;

  let design = PrintDesignData.bind(
    Address.fromString("0x597772c9c0EfE354976B0068296dFcb03583C2be")
  );
  let splits = PrintSplitData.bind(
    Address.fromString("0xa6466180387940CAc6467CCc0242D4B19A24e6BE")
  );

  let ipfsHash = event.params.uri.split("/").pop();
  if (ipfsHash != null) {
    entity.collectionMetadata = ipfsHash;
    CollectionMetadataTemplate.create(ipfsHash);
  }

  entity.encrypted = design.getCollectionEncrypted(entity.collectionId);
  entity.dropId = design.getCollectionDropId(entity.collectionId);

  if (entity.dropId !== null) {
    let dropHash = design.getDropURI(<BigInt>entity.dropId);

    if (dropHash !== null) {
      let hash = dropHash.split("/").pop();
      entity.dropMetadata = hash;
      DropMetadataTemplate.create(hash);
    }
  }

  entity.prices = design.getCollectionPrices(entity.collectionId);
  const printType = design.getCollectionPrintType(entity.collectionId);
  entity.printType = printType.toString();
  entity.fulfiller = design.getCollectionFulfiller(entity.collectionId);
  const origin = design.getCollectionOrigin(entity.collectionId);
  entity.origin = origin.toString();
  entity.profileId = design.getCollectionProfileId(entity.collectionId);
  entity.acceptedTokens = design
    .getCollectionAcceptedTokens(entity.collectionId)
    .map<Bytes>((target: Bytes) => target);
  entity.pubId = design.getCollectionPubId(entity.collectionId);
  entity.unlimited = design.getCollectionUnlimited(entity.collectionId);
  entity.fulfillerPercent = splits.getFulfillerSplit(
    Address.fromBytes(entity.fulfiller),
    printType
  );
  entity.fulfillerBase = splits.getFulfillerBase(
    Address.fromBytes(entity.fulfiller),
    printType
  );
  entity.designerPercent = splits.getDesignerSplit(
    Address.fromBytes(entity.owner),
    printType
  );

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let registryId = Bytes.fromByteArray(ByteArray.fromBigInt(new BigInt(13)));
  let registry = PrintTypeCollectionRegistry.load(registryId);

  if (!registry) {
    registry = new PrintTypeCollectionRegistry(registryId);
    registry.id = registryId;
    registry.collectionIds0 = [];
    registry.collectionIds1 = [];
    registry.collectionIds2 = [];
    registry.collectionIds3 = [];
  }

  switch (printType) {
    case 0:
      if (<Array<BigInt> | null>registry.collectionIds0) {
        registry.collectionIds0 = (registry.collectionIds0 as Array<
          BigInt
        >).concat([entity.collectionId]);
      }
      break;

    case 1:
      if (<Array<BigInt> | null>registry.collectionIds1) {
        registry.collectionIds1 = <Array<BigInt>>(
          (registry.collectionIds1 as Array<BigInt>).concat([
            entity.collectionId,
          ])
        );
      }
      break;

    case 2:
      if (<Array<BigInt> | null>registry.collectionIds2) {
        registry.collectionIds2 = (registry.collectionIds2 as Array<
          BigInt
        >).concat([entity.collectionId]);
      }
      break;

    case 3:
      if (<Array<BigInt>>registry.collectionIds3 != null) {
        registry.collectionIds3 = (registry.collectionIds3 as Array<
          BigInt
        >).concat([entity.collectionId]);
      }
      break;
  }

  registry.save();
  entity.save();
}

export function handleCollectionDeleted(event: CollectionDeletedEvent): void {
  let entity = new CollectionDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.collectionId)
  );
  entity.collectionId = event.params.collectionId;

  let entityCollection = CollectionCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.collectionId))
  );

  if (entityCollection) {
    store.remove(
      "CollectionCreated",
      Bytes.fromByteArray(
        ByteArray.fromBigInt(event.params.collectionId)
      ).toHexString()
    );
  }

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleCollectionMintedTokensSet(
  event: CollectionMintedTokensSetEvent
): void {
  let entity = new CollectionMintedTokensSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.collectionId)
  );
  entity.collectionId = event.params.collectionId;
  entity.mintedTokensAmount = event.params.mintedTokensAmount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let entityCollection = CollectionCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.collectionId))
  );

  if (entityCollection) {
    entityCollection.soldTokens = event.params.mintedTokensAmount;

    entityCollection.save();
  }

  entity.save();
}

export function handleCollectionTokenIdsSet(
  event: CollectionTokenIdsSetEvent
): void {
  let entity = new CollectionTokenIdsSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.collectionId)
  );
  entity.collectionId = event.params.collectionId;
  entity.tokenIds = event.params.tokenIds;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDropCollectionsUpdated(
  event: DropCollectionsUpdatedEvent
): void {
  let entity = new DropCollectionsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(ByteArray.fromBigInt(event.params.dropId));
  entity.dropId = event.params.dropId;
  entity.collectionIds = event.params.collectionIds;
  entity.oldCollectionIds = event.params.oldCollectionIds;
  entity.uri = event.params.uri;

  let entityDrop = DropCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.dropId))
  );

  let oldIds = entity.oldCollectionIds;
  if (oldIds) {
    for (let j = 0; j < oldIds.length; j++) {
      let oldId = oldIds[j];
      if (oldId) {
        let entityCollection = CollectionCreated.load(
          Bytes.fromByteArray(ByteArray.fromBigInt(oldId))
        );

        if (entityCollection) {
          entityCollection.dropMetadata = null;
          entityCollection.dropId = null;
          entityCollection.save();
        }
      }
    }
  }

  if (entityDrop) {
    entityDrop.uri = event.params.uri;
    entityDrop.collectionIds = event.params.collectionIds;

    let ipfsHash = event.params.uri.split("/").pop();

    if (ipfsHash != null) {
      let metadata = ipfs.cat(ipfsHash);

      if (metadata) {
        entityDrop.dropDetails = ipfsHash;
        DropMetadataTemplate.create(ipfsHash);

        let collectionIds = entityDrop.collectionIds;


        if (collectionIds) {
          for (let i = 0; i < collectionIds.length; i++) {
            let collectionId = collectionIds[i];
            if (collectionId) {
              let entityCollection = CollectionCreated.load(
                Bytes.fromByteArray(ByteArray.fromBigInt(collectionId))
              );

              if (entityCollection) {
                entityCollection.dropMetadata = ipfsHash;
                entityCollection.dropId = entity.dropId;
                entityCollection.save();
              }
            }
          }
        }
      }
    }

    entityDrop.save();
  }

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDropCreated(event: DropCreatedEvent): void {
  let entity = new DropCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(ByteArray.fromBigInt(event.params.dropId));
  entity.dropId = event.params.dropId;
  entity.uri = event.params.uri;
  entity.creator = event.params.creator;

  let ipfsHash = event.params.uri.split("/").pop();
  if (ipfsHash != null) {
    if (ipfsHash != null) {
      entity.dropDetails = ipfsHash;
      DropMetadataTemplate.create(ipfsHash);
    }
  }

  let design = PrintDesignData.bind(
    Address.fromString("0x597772c9c0EfE354976B0068296dFcb03583C2be")
  );
  entity.collectionIds = design.getDropCollectionIds(<BigInt>entity.dropId);

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDropDeleted(event: DropDeletedEvent): void {
  let entity = new DropDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(ByteArray.fromBigInt(event.params.dropId));
  entity.dropId = event.params.dropId;

  let entityDrop = DropCreated.load(
    Bytes.fromByteArray(ByteArray.fromBigInt(event.params.dropId))
  );
  let design = PrintDesignData.bind(
    Address.fromString("0x597772c9c0EfE354976B0068296dFcb03583C2be")
  );
  let collectionIds = design.getDropCollectionIds(event.params.dropId);

  if (collectionIds) {
    for (let i = 0; i < collectionIds.length; i++) {
      let collectionId = collectionIds[i];
      if (collectionId) {
        let entityCollection = CollectionCreated.load(
          Bytes.fromByteArray(ByteArray.fromBigInt(collectionId))
        );

        if (entityCollection) {
          entityCollection.dropId = null;
          entityCollection.save();
        }
      }
    }
  }

  if (entityDrop) {
    store.remove(
      "DropCreated",
      Bytes.fromByteArray(
        ByteArray.fromBigInt(event.params.dropId)
      ).toHexString()
    );
  }

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTokensMinted(event: TokensMintedEvent): void {
  let entity = new TokensMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = Bytes.fromByteArray(
    ByteArray.fromBigInt(event.params.collectionId)
  );
  entity.tokenId = event.params.tokenId;
  entity.collectionId = event.params.collectionId;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
