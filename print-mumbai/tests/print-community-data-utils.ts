import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CommunityCreated,
  CommunityMemberAdded,
  CommunityMemberRemoved,
  CommunityUpdated
} from "../generated/PrintCommunityData/PrintCommunityData"

export function createCommunityCreatedEvent(
  communityId: BigInt,
  steward: Address,
  uri: string
): CommunityCreated {
  let communityCreatedEvent = changetype<CommunityCreated>(newMockEvent())

  communityCreatedEvent.parameters = new Array()

  communityCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "communityId",
      ethereum.Value.fromUnsignedBigInt(communityId)
    )
  )
  communityCreatedEvent.parameters.push(
    new ethereum.EventParam("steward", ethereum.Value.fromAddress(steward))
  )
  communityCreatedEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )

  return communityCreatedEvent
}

export function createCommunityMemberAddedEvent(
  communityId: BigInt,
  memberAddress: Address,
  memberProfileId: BigInt
): CommunityMemberAdded {
  let communityMemberAddedEvent = changetype<CommunityMemberAdded>(
    newMockEvent()
  )

  communityMemberAddedEvent.parameters = new Array()

  communityMemberAddedEvent.parameters.push(
    new ethereum.EventParam(
      "communityId",
      ethereum.Value.fromUnsignedBigInt(communityId)
    )
  )
  communityMemberAddedEvent.parameters.push(
    new ethereum.EventParam(
      "memberAddress",
      ethereum.Value.fromAddress(memberAddress)
    )
  )
  communityMemberAddedEvent.parameters.push(
    new ethereum.EventParam(
      "memberProfileId",
      ethereum.Value.fromUnsignedBigInt(memberProfileId)
    )
  )

  return communityMemberAddedEvent
}

export function createCommunityMemberRemovedEvent(
  communityId: BigInt,
  memberProfileId: BigInt
): CommunityMemberRemoved {
  let communityMemberRemovedEvent = changetype<CommunityMemberRemoved>(
    newMockEvent()
  )

  communityMemberRemovedEvent.parameters = new Array()

  communityMemberRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "communityId",
      ethereum.Value.fromUnsignedBigInt(communityId)
    )
  )
  communityMemberRemovedEvent.parameters.push(
    new ethereum.EventParam(
      "memberProfileId",
      ethereum.Value.fromUnsignedBigInt(memberProfileId)
    )
  )

  return communityMemberRemovedEvent
}

export function createCommunityUpdatedEvent(
  communityId: BigInt,
  steward: Address,
  uri: string
): CommunityUpdated {
  let communityUpdatedEvent = changetype<CommunityUpdated>(newMockEvent())

  communityUpdatedEvent.parameters = new Array()

  communityUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "communityId",
      ethereum.Value.fromUnsignedBigInt(communityId)
    )
  )
  communityUpdatedEvent.parameters.push(
    new ethereum.EventParam("steward", ethereum.Value.fromAddress(steward))
  )
  communityUpdatedEvent.parameters.push(
    new ethereum.EventParam("uri", ethereum.Value.fromString(uri))
  )

  return communityUpdatedEvent
}
