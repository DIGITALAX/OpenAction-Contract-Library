import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AllClaimedMilestone } from "../generated/schema"
import { AllClaimedMilestone as AllClaimedMilestoneEvent } from "../generated/LegendData/LegendData"
import { handleAllClaimedMilestone } from "../src/legend-data"
import { createAllClaimedMilestoneEvent } from "./legend-data-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let grantId = BigInt.fromI32(234)
    let milestone = 123
    let newAllClaimedMilestoneEvent = createAllClaimedMilestoneEvent(
      grantId,
      milestone
    )
    handleAllClaimedMilestone(newAllClaimedMilestoneEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AllClaimedMilestone created and stored", () => {
    assert.entityCount("AllClaimedMilestone", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AllClaimedMilestone",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "grantId",
      "234"
    )
    assert.fieldEquals(
      "AllClaimedMilestone",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "milestone",
      "123"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
