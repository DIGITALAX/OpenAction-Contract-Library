import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  AllClaimedMilestone,
  GrantCreated,
  GrantDeleted,
  GrantFunded,
  MilestoneClaimed,
  MilestoneStatusUpdated
} from "../generated/LegendData/LegendData"

export function createAllClaimedMilestoneEvent(
  grantId: BigInt,
  milestone: i32
): AllClaimedMilestone {
  let allClaimedMilestoneEvent = changetype<AllClaimedMilestone>(newMockEvent())

  allClaimedMilestoneEvent.parameters = new Array()

  allClaimedMilestoneEvent.parameters.push(
    new ethereum.EventParam(
      "grantId",
      ethereum.Value.fromUnsignedBigInt(grantId)
    )
  )
  allClaimedMilestoneEvent.parameters.push(
    new ethereum.EventParam(
      "milestone",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(milestone))
    )
  )

  return allClaimedMilestoneEvent
}

export function createGrantCreatedEvent(
  grantId: BigInt,
  creator: Address,
  pubId: BigInt,
  profileId: BigInt
): GrantCreated {
  let grantCreatedEvent = changetype<GrantCreated>(newMockEvent())

  grantCreatedEvent.parameters = new Array()

  grantCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "grantId",
      ethereum.Value.fromUnsignedBigInt(grantId)
    )
  )
  grantCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  grantCreatedEvent.parameters.push(
    new ethereum.EventParam("pubId", ethereum.Value.fromUnsignedBigInt(pubId))
  )
  grantCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "profileId",
      ethereum.Value.fromUnsignedBigInt(profileId)
    )
  )

  return grantCreatedEvent
}

export function createGrantDeletedEvent(
  grantId: BigInt,
  deleter: Address
): GrantDeleted {
  let grantDeletedEvent = changetype<GrantDeleted>(newMockEvent())

  grantDeletedEvent.parameters = new Array()

  grantDeletedEvent.parameters.push(
    new ethereum.EventParam(
      "grantId",
      ethereum.Value.fromUnsignedBigInt(grantId)
    )
  )
  grantDeletedEvent.parameters.push(
    new ethereum.EventParam("deleter", ethereum.Value.fromAddress(deleter))
  )

  return grantDeletedEvent
}

export function createGrantFundedEvent(
  currency: Address,
  grantId: BigInt,
  amount: BigInt
): GrantFunded {
  let grantFundedEvent = changetype<GrantFunded>(newMockEvent())

  grantFundedEvent.parameters = new Array()

  grantFundedEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  )
  grantFundedEvent.parameters.push(
    new ethereum.EventParam(
      "grantId",
      ethereum.Value.fromUnsignedBigInt(grantId)
    )
  )
  grantFundedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return grantFundedEvent
}

export function createMilestoneClaimedEvent(
  claimer: Address,
  milestone: i32,
  grantId: BigInt
): MilestoneClaimed {
  let milestoneClaimedEvent = changetype<MilestoneClaimed>(newMockEvent())

  milestoneClaimedEvent.parameters = new Array()

  milestoneClaimedEvent.parameters.push(
    new ethereum.EventParam("claimer", ethereum.Value.fromAddress(claimer))
  )
  milestoneClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "milestone",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(milestone))
    )
  )
  milestoneClaimedEvent.parameters.push(
    new ethereum.EventParam(
      "grantId",
      ethereum.Value.fromUnsignedBigInt(grantId)
    )
  )

  return milestoneClaimedEvent
}

export function createMilestoneStatusUpdatedEvent(
  updater: Address,
  grantId: BigInt,
  milestone: i32,
  status: i32
): MilestoneStatusUpdated {
  let milestoneStatusUpdatedEvent = changetype<MilestoneStatusUpdated>(
    newMockEvent()
  )

  milestoneStatusUpdatedEvent.parameters = new Array()

  milestoneStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam("updater", ethereum.Value.fromAddress(updater))
  )
  milestoneStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "grantId",
      ethereum.Value.fromUnsignedBigInt(grantId)
    )
  )
  milestoneStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "milestone",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(milestone))
    )
  )
  milestoneStatusUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return milestoneStatusUpdatedEvent
}
