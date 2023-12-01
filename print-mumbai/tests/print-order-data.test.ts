import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { NFTOnlyOrderCreated } from "../generated/schema"
import { NFTOnlyOrderCreated as NFTOnlyOrderCreatedEvent } from "../generated/PrintOrderData/PrintOrderData"
import { handleNFTOnlyOrderCreated } from "../src/print-order-data"
import { createNFTOnlyOrderCreatedEvent } from "./print-order-data-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let orderId = BigInt.fromI32(234)
    let totalPrice = BigInt.fromI32(234)
    let currency = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let pubId = BigInt.fromI32(234)
    let profileId = BigInt.fromI32(234)
    let buyer = Address.fromString("0x0000000000000000000000000000000000000001")
    let newNFTOnlyOrderCreatedEvent = createNFTOnlyOrderCreatedEvent(
      orderId,
      totalPrice,
      currency,
      pubId,
      profileId,
      buyer
    )
    handleNFTOnlyOrderCreated(newNFTOnlyOrderCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NFTOnlyOrderCreated created and stored", () => {
    assert.entityCount("NFTOnlyOrderCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NFTOnlyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "orderId",
      "234"
    )
    assert.fieldEquals(
      "NFTOnlyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "totalPrice",
      "234"
    )
    assert.fieldEquals(
      "NFTOnlyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "currency",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "NFTOnlyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "pubId",
      "234"
    )
    assert.fieldEquals(
      "NFTOnlyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "profileId",
      "234"
    )
    assert.fieldEquals(
      "NFTOnlyOrderCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "buyer",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
