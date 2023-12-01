import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  NFTOnlyOrderCreated,
  OrderCreated,
  SubOrderIsFulfilled,
  UpdateNFTOnlyOrderMessage,
  UpdateOrderDetails,
  UpdateOrderMessage,
  UpdateSubOrderStatus
} from "../generated/PrintOrderData/PrintOrderData"

export function createNFTOnlyOrderCreatedEvent(
  orderId: BigInt,
  totalPrice: BigInt,
  currency: Address,
  pubId: BigInt,
  profileId: BigInt,
  buyer: Address
): NFTOnlyOrderCreated {
  let nftOnlyOrderCreatedEvent = changetype<NFTOnlyOrderCreated>(newMockEvent())

  nftOnlyOrderCreatedEvent.parameters = new Array()

  nftOnlyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  nftOnlyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalPrice",
      ethereum.Value.fromUnsignedBigInt(totalPrice)
    )
  )
  nftOnlyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  )
  nftOnlyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam("pubId", ethereum.Value.fromUnsignedBigInt(pubId))
  )
  nftOnlyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "profileId",
      ethereum.Value.fromUnsignedBigInt(profileId)
    )
  )
  nftOnlyOrderCreatedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return nftOnlyOrderCreatedEvent
}

export function createOrderCreatedEvent(
  orderId: BigInt,
  totalPrice: BigInt,
  currency: Address,
  pubId: BigInt,
  profileId: BigInt,
  buyer: Address
): OrderCreated {
  let orderCreatedEvent = changetype<OrderCreated>(newMockEvent())

  orderCreatedEvent.parameters = new Array()

  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalPrice",
      ethereum.Value.fromUnsignedBigInt(totalPrice)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("currency", ethereum.Value.fromAddress(currency))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("pubId", ethereum.Value.fromUnsignedBigInt(pubId))
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "profileId",
      ethereum.Value.fromUnsignedBigInt(profileId)
    )
  )
  orderCreatedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )

  return orderCreatedEvent
}

export function createSubOrderIsFulfilledEvent(
  subOrderId: BigInt
): SubOrderIsFulfilled {
  let subOrderIsFulfilledEvent = changetype<SubOrderIsFulfilled>(newMockEvent())

  subOrderIsFulfilledEvent.parameters = new Array()

  subOrderIsFulfilledEvent.parameters.push(
    new ethereum.EventParam(
      "subOrderId",
      ethereum.Value.fromUnsignedBigInt(subOrderId)
    )
  )

  return subOrderIsFulfilledEvent
}

export function createUpdateNFTOnlyOrderMessageEvent(
  orderId: BigInt,
  newMessageDetails: string
): UpdateNFTOnlyOrderMessage {
  let updateNftOnlyOrderMessageEvent = changetype<UpdateNFTOnlyOrderMessage>(
    newMockEvent()
  )

  updateNftOnlyOrderMessageEvent.parameters = new Array()

  updateNftOnlyOrderMessageEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  updateNftOnlyOrderMessageEvent.parameters.push(
    new ethereum.EventParam(
      "newMessageDetails",
      ethereum.Value.fromString(newMessageDetails)
    )
  )

  return updateNftOnlyOrderMessageEvent
}

export function createUpdateOrderDetailsEvent(
  orderId: BigInt,
  newOrderDetails: string
): UpdateOrderDetails {
  let updateOrderDetailsEvent = changetype<UpdateOrderDetails>(newMockEvent())

  updateOrderDetailsEvent.parameters = new Array()

  updateOrderDetailsEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  updateOrderDetailsEvent.parameters.push(
    new ethereum.EventParam(
      "newOrderDetails",
      ethereum.Value.fromString(newOrderDetails)
    )
  )

  return updateOrderDetailsEvent
}

export function createUpdateOrderMessageEvent(
  orderId: BigInt,
  newMessageDetails: string
): UpdateOrderMessage {
  let updateOrderMessageEvent = changetype<UpdateOrderMessage>(newMockEvent())

  updateOrderMessageEvent.parameters = new Array()

  updateOrderMessageEvent.parameters.push(
    new ethereum.EventParam(
      "orderId",
      ethereum.Value.fromUnsignedBigInt(orderId)
    )
  )
  updateOrderMessageEvent.parameters.push(
    new ethereum.EventParam(
      "newMessageDetails",
      ethereum.Value.fromString(newMessageDetails)
    )
  )

  return updateOrderMessageEvent
}

export function createUpdateSubOrderStatusEvent(
  subOrderId: BigInt,
  newSubOrderStatus: i32
): UpdateSubOrderStatus {
  let updateSubOrderStatusEvent = changetype<UpdateSubOrderStatus>(
    newMockEvent()
  )

  updateSubOrderStatusEvent.parameters = new Array()

  updateSubOrderStatusEvent.parameters.push(
    new ethereum.EventParam(
      "subOrderId",
      ethereum.Value.fromUnsignedBigInt(subOrderId)
    )
  )
  updateSubOrderStatusEvent.parameters.push(
    new ethereum.EventParam(
      "newSubOrderStatus",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(newSubOrderStatus))
    )
  )

  return updateSubOrderStatusEvent
}
