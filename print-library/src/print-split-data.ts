import { Address, BigInt, ByteArray, Bytes } from "@graphprotocol/graph-ts";
import {
  CurrencyAdded as CurrencyAddedEvent,
  CurrencyRemoved as CurrencyRemovedEvent,
  DesignerSplitSet as DesignerSplitSetEvent,
  FulfillerBaseSet as FulfillerBaseSetEvent,
  FulfillerSplitSet as FulfillerSplitSetEvent,
  OracleUpdated as OracleUpdatedEvent,
  PrintSplitData,
  TreasurySplitSet as TreasurySplitSetEvent,
} from "../generated/PrintSplitData/PrintSplitData";
import {
  CollectionCreated,
  CurrencyAdded,
  CurrencyRemoved,
  DesignerSplitSet,
  FulfillerBaseSet,
  FulfillerSplitSet,
  OracleUpdated,
  PrintTypeCollectionRegistry,
  TreasurySplitSet,
} from "../generated/schema";

export function handleCurrencyAdded(event: CurrencyAddedEvent): void {
  let entity = new CurrencyAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = event.params.currency;
  entity.currency = event.params.currency;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let splits = PrintSplitData.bind(
    Address.fromString("0xeB5116025E17D2E6E27126C104cb455dCa63460D")
  );

  const currency = Address.fromBytes(event.params.currency);

  if (currency) {
    const wei = splits.getWeiByCurrency(currency);
    if (wei) {
      entity.wei = wei;
    }
  }

  entity.save();
}

export function handleCurrencyRemoved(event: CurrencyRemovedEvent): void {
  let entity = new CurrencyRemoved(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.currency = event.params.currency;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleDesignerSplitSet(event: DesignerSplitSetEvent): void {
  let entity = new DesignerSplitSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = event.params.designer.concat(new Bytes(event.params.printType));
  entity.designer = event.params.designer;
  entity.printType = event.params.printType;
  entity.split = event.params.split;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let registryId = Bytes.fromByteArray(ByteArray.fromBigInt(new BigInt(13)));
  let registry = PrintTypeCollectionRegistry.load(registryId);

  if (registry) {
    switch (entity.printType) {
      case 0:
        if (<Array<BigInt> | null>registry.collectionIds0) {
          for (
            let i = 0;
            i < (registry.collectionIds0 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds0 as Array<BigInt>)[i]
                )
              )
            );

            if (entityOrder) {
              if (event.params.designer == entityOrder.owner) {
                entityOrder.designerPercent = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
      case 1:
        if (<Array<BigInt> | null>registry.collectionIds1) {
          for (
            let i = 0;
            i < (registry.collectionIds1 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds1 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.designer == entityOrder.owner) {
                entityOrder.designerPercent = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
      case 2:
        if (<Array<BigInt> | null>registry.collectionIds2) {
          for (
            let i = 0;
            i < (registry.collectionIds2 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds2 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.designer == entityOrder.owner) {
                entityOrder.designerPercent = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
      case 3:
        if (<Array<BigInt> | null>registry.collectionIds3) {
          for (
            let i = 0;
            i < (registry.collectionIds3 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds3 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.designer == entityOrder.owner) {
                entityOrder.designerPercent = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
    }
  }

  entity.save();
}

export function handleFulfillerBaseSet(event: FulfillerBaseSetEvent): void {
  let entity = new FulfillerBaseSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = event.params.fulfiller.concat(new Bytes(event.params.printType));
  entity.fulfiller = event.params.fulfiller;
  entity.printType = event.params.printType;
  entity.split = event.params.split;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let registryId = Bytes.fromByteArray(ByteArray.fromBigInt(new BigInt(13)));
  let registry = PrintTypeCollectionRegistry.load(registryId);

  if (registry) {
    switch (entity.printType) {
      case 0:
        if (<Array<BigInt> | null>registry.collectionIds0) {
          for (
            let i = 0;
            i < (registry.collectionIds0 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds0 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.fulfiller == entityOrder.fulfiller) {
                entityOrder.fulfillerBase = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
      case 1:
        if (<Array<BigInt> | null>registry.collectionIds1) {
          for (
            let i = 0;
            i < (registry.collectionIds1 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds1 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.fulfiller == entityOrder.fulfiller) {
                entityOrder.fulfillerBase = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
      case 2:
        if (<Array<BigInt> | null>registry.collectionIds2) {
          for (
            let i = 0;
            i < (registry.collectionIds2 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds2 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.fulfiller == entityOrder.fulfiller) {
                entityOrder.fulfillerBase = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
      case 3:
        if (<Array<BigInt> | null>registry.collectionIds3) {
          for (
            let i = 0;
            i < (registry.collectionIds3 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds3 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.fulfiller == entityOrder.fulfiller) {
                entityOrder.fulfillerBase = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
    }
  }

  entity.save();
}

export function handleFulfillerSplitSet(event: FulfillerSplitSetEvent): void {
  let entity = new FulfillerSplitSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.id = event.params.fulfiller.concat(new Bytes(event.params.printType));
  entity.fulfiller = event.params.fulfiller;
  entity.printType = event.params.printType;
  entity.split = event.params.split;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  let registryId = Bytes.fromByteArray(ByteArray.fromBigInt(new BigInt(13)));
  let registry = PrintTypeCollectionRegistry.load(registryId);
  if (registry) {
    switch (entity.printType) {
      case 0:
        if (<Array<BigInt> | null>registry.collectionIds0) {
          for (
            let i = 0;
            i < (registry.collectionIds0 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds0 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.fulfiller == entityOrder.fulfiller) {
                entityOrder.fulfillerPercent = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
      case 1:
        if (<Array<BigInt> | null>registry.collectionIds1) {
          for (
            let i = 0;
            i < (registry.collectionIds1 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds1 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.fulfiller == entityOrder.fulfiller) {
                entityOrder.fulfillerPercent = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
      case 2:
        if (<Array<BigInt> | null>registry.collectionIds2) {
          for (
            let i = 0;
            i < (registry.collectionIds2 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds2 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.fulfiller == entityOrder.fulfiller) {
                entityOrder.fulfillerPercent = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
      case 3:
        if (registry.collectionIds3) {
          for (
            let i = 0;
            i < (registry.collectionIds3 as Array<BigInt>).length;
            i++
          ) {
            let entityOrder = CollectionCreated.load(
              Bytes.fromByteArray(
                ByteArray.fromBigInt(
                  (registry.collectionIds3 as Array<BigInt>)[i]
                )
              )
            );
            if (entityOrder) {
              if (event.params.fulfiller == entityOrder.fulfiller) {
                entityOrder.fulfillerPercent = event.params.split;
                entityOrder.save();
              }
            }
          }
        }
        break;
    }
  }

  entity.save();
}

export function handleOracleUpdated(event: OracleUpdatedEvent): void {
  let entity = new OracleUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.currency = event.params.currency;
  entity.rate = event.params.rate;

  let entityOrder = CurrencyAdded.load(event.params.currency);

  if (entityOrder) {
    entityOrder.rate = entity.rate;
    entityOrder.save();
  }

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTreasurySplitSet(event: TreasurySplitSetEvent): void {
  let entity = new TreasurySplitSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.treasury = event.params.treasury;
  entity.printType = event.params.printType;
  entity.split = event.params.split;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
