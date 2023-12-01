import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CollectionCreated,
  CollectionDeleted,
  CollectionMintedTokensSet,
  CollectionTokenIdsSet,
  DropCollectionsUpdated,
  DropCreated,
  DropDeleted,
  TokensMinted
} from "../generated/PrintDesignData/PrintDesignData"

export function createCollectionCreatedEvent(
  collectionId: BigInt,
  pubId: BigInt,
  profileId: BigInt,
  uri: string,
  amount: BigInt,
  owner: Address
): CollectionCreated {
  let collectionCreatedEvent = changetype<CollectionCreated>(newMockEvent())

  collectionCreatedEvent.parameters = new Array()

  collectionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionCreatedEvent.parameters.push(
    new ethereum.EventParam("pubId", ethereum.Value.fromUnsignedBigInt(pubId))
  )
  collectionCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "profileId",
      ethereum.Value.fromUnsignedBigInt(profileId)
    )
  )
  collectionCreatedEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )
  collectionCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  collectionCreatedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return collectionCreatedEvent
}

export function createCollectionDeletedEvent(
  collectionId: BigInt
): CollectionDeleted {
  let collectionDeletedEvent = changetype<CollectionDeleted>(newMockEvent())

  collectionDeletedEvent.parameters = new Array()

  collectionDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )

  return collectionDeletedEvent
}

export function createCollectionMintedTokensSetEvent(
  collectionId: BigInt,
  mintedTokensAmount: BigInt
): CollectionMintedTokensSet {
  let collectionMintedTokensSetEvent = changetype<CollectionMintedTokensSet>(
    newMockEvent()
  )

  collectionMintedTokensSetEvent.parameters = new Array()

  collectionMintedTokensSetEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionMintedTokensSetEvent.parameters.push(
    new ethereum.EventParam(
      "mintedTokensAmount",
      ethereum.Value.fromUnsignedBigInt(mintedTokensAmount)
    )
  )

  return collectionMintedTokensSetEvent
}

export function createCollectionTokenIdsSetEvent(
  collectionId: BigInt,
  tokenIds: Array<BigInt>
): CollectionTokenIdsSet {
  let collectionTokenIdsSetEvent = changetype<CollectionTokenIdsSet>(
    newMockEvent()
  )

  collectionTokenIdsSetEvent.parameters = new Array()

  collectionTokenIdsSetEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )
  collectionTokenIdsSetEvent.parameters.push(
    new ethereum.EventParam(
      "tokenIds",
      ethereum.Value.fromUnsignedBigIntArray(tokenIds)
    )
  )

  return collectionTokenIdsSetEvent
}

export function createDropCollectionsUpdatedEvent(
  dropId: BigInt,
  collectionIds: Array<BigInt>,
  uri: string
): DropCollectionsUpdated {
  let dropCollectionsUpdatedEvent = changetype<DropCollectionsUpdated>(
    newMockEvent()
  )

  dropCollectionsUpdatedEvent.parameters = new Array()

  dropCollectionsUpdatedEvent.parameters.push(
    new ethereum.EventParam("dropId", ethereum.Value.fromUnsignedBigInt(dropId))
  )
  dropCollectionsUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionIds",
      ethereum.Value.fromUnsignedBigIntArray(collectionIds)
    )
  )
  dropCollectionsUpdatedEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )

  return dropCollectionsUpdatedEvent
}

export function createDropCreatedEvent(
  dropId: BigInt,
  uri: string,
  creator: Address
): DropCreated {
  let dropCreatedEvent = changetype<DropCreated>(newMockEvent())

  dropCreatedEvent.parameters = new Array()

  dropCreatedEvent.parameters.push(
    new ethereum.EventParam("dropId", ethereum.Value.fromUnsignedBigInt(dropId))
  )
  dropCreatedEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )
  dropCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return dropCreatedEvent
}

export function createDropDeletedEvent(dropId: BigInt): DropDeleted {
  let dropDeletedEvent = changetype<DropDeleted>(newMockEvent())

  dropDeletedEvent.parameters = new Array()

  dropDeletedEvent.parameters.push(
    new ethereum.EventParam("dropId", ethereum.Value.fromUnsignedBigInt(dropId))
  )

  return dropDeletedEvent
}

export function createTokensMintedEvent(
  tokenId: BigInt,
  collectionId: BigInt
): TokensMinted {
  let tokensMintedEvent = changetype<TokensMinted>(newMockEvent())

  tokensMintedEvent.parameters = new Array()

  tokensMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  tokensMintedEvent.parameters.push(
    new ethereum.EventParam(
      "collectionId",
      ethereum.Value.fromUnsignedBigInt(collectionId)
    )
  )

  return tokensMintedEvent
}
