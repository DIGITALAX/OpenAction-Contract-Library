import {
  CollectionCreated as CollectionCreatedEvent,
  CollectionDeleted as CollectionDeletedEvent,
  CollectionMintedTokensSet as CollectionMintedTokensSetEvent,
  CollectionTokenIdsSet as CollectionTokenIdsSetEvent,
  DropCollectionsUpdated as DropCollectionsUpdatedEvent,
  DropCreated as DropCreatedEvent,
  DropDeleted as DropDeletedEvent,
  TokensMinted as TokensMintedEvent
} from "../generated/PrintDesignData/PrintDesignData"
import {
  CollectionCreated,
  CollectionDeleted,
  CollectionMintedTokensSet,
  CollectionTokenIdsSet,
  DropCollectionsUpdated,
  DropCreated,
  DropDeleted,
  TokensMinted
} from "../generated/schema"

export function handleCollectionCreated(event: CollectionCreatedEvent): void {
  let entity = new CollectionCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.collectionId = event.params.collectionId
  entity.pubId = event.params.pubId
  entity.profileId = event.params.profileId
  entity.uri = event.params.uri
  entity.amount = event.params.amount
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionDeleted(event: CollectionDeletedEvent): void {
  let entity = new CollectionDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.collectionId = event.params.collectionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionMintedTokensSet(
  event: CollectionMintedTokensSetEvent
): void {
  let entity = new CollectionMintedTokensSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.collectionId = event.params.collectionId
  entity.mintedTokensAmount = event.params.mintedTokensAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCollectionTokenIdsSet(
  event: CollectionTokenIdsSetEvent
): void {
  let entity = new CollectionTokenIdsSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.collectionId = event.params.collectionId
  entity.tokenIds = event.params.tokenIds

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDropCollectionsUpdated(
  event: DropCollectionsUpdatedEvent
): void {
  let entity = new DropCollectionsUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dropId = event.params.dropId
  entity.collectionIds = event.params.collectionIds
  entity.oldCollectionIds = event.params.oldCollectionIds
  entity.uri = event.params.uri

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDropCreated(event: DropCreatedEvent): void {
  let entity = new DropCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dropId = event.params.dropId
  entity.uri = event.params.uri
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDropDeleted(event: DropDeletedEvent): void {
  let entity = new DropDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.dropId = event.params.dropId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTokensMinted(event: TokensMintedEvent): void {
  let entity = new TokensMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.collectionId = event.params.collectionId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
