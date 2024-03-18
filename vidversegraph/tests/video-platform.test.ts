import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { CreatedStream } from "../generated/schema"
import { CreatedStream as CreatedStreamEvent } from "../generated/VideoPlatform/VideoPlatform"
import { handleCreatedStream } from "../src/video-platform"
import { createCreatedStreamEvent } from "./video-platform-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let owner = Address.fromString("0x0000000000000000000000000000000000000001")
    let stramName = "Example string value"
    let description = "Example string value"
    let playBackId = "Example string value"
    let status = "boolean Not implemented"
    let streamKey = "Example string value"
    let streamID = "Example string value"
    let newCreatedStreamEvent = createCreatedStreamEvent(
      id,
      owner,
      stramName,
      description,
      playBackId,
      status,
      streamKey,
      streamID
    )
    handleCreatedStream(newCreatedStreamEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CreatedStream created and stored", () => {
    assert.entityCount("CreatedStream", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CreatedStream",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "owner",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CreatedStream",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "stramName",
      "Example string value"
    )
    assert.fieldEquals(
      "CreatedStream",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "description",
      "Example string value"
    )
    assert.fieldEquals(
      "CreatedStream",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "playBackId",
      "Example string value"
    )
    assert.fieldEquals(
      "CreatedStream",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "status",
      "boolean Not implemented"
    )
    assert.fieldEquals(
      "CreatedStream",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "streamKey",
      "Example string value"
    )
    assert.fieldEquals(
      "CreatedStream",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "streamID",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
