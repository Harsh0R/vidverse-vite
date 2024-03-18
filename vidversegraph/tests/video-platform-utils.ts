import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CreatedStream,
  StreamStopped,
  VideoTipped,
  VideoUploaded
} from "../generated/VideoPlatform/VideoPlatform"

export function createCreatedStreamEvent(
  id: BigInt,
  owner: Address,
  stramName: string,
  description: string,
  playBackId: string,
  status: boolean
): CreatedStream {
  let createdStreamEvent = changetype<CreatedStream>(newMockEvent())

  createdStreamEvent.parameters = new Array()

  createdStreamEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  createdStreamEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  createdStreamEvent.parameters.push(
    new ethereum.EventParam("stramName", ethereum.Value.fromString(stramName))
  )
  createdStreamEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  createdStreamEvent.parameters.push(
    new ethereum.EventParam("playBackId", ethereum.Value.fromString(playBackId))
  )
  createdStreamEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromBoolean(status))
  )

  return createdStreamEvent
}

export function createStreamStoppedEvent(
  id: BigInt,
  owner: Address
): StreamStopped {
  let streamStoppedEvent = changetype<StreamStopped>(newMockEvent())

  streamStoppedEvent.parameters = new Array()

  streamStoppedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  streamStoppedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )

  return streamStoppedEvent
}

export function createVideoTippedEvent(
  videoId: BigInt,
  owner: Address,
  tipper: Address,
  amount: BigInt,
  newTipAmount: BigInt
): VideoTipped {
  let videoTippedEvent = changetype<VideoTipped>(newMockEvent())

  videoTippedEvent.parameters = new Array()

  videoTippedEvent.parameters.push(
    new ethereum.EventParam(
      "videoId",
      ethereum.Value.fromUnsignedBigInt(videoId)
    )
  )
  videoTippedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  videoTippedEvent.parameters.push(
    new ethereum.EventParam("tipper", ethereum.Value.fromAddress(tipper))
  )
  videoTippedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  videoTippedEvent.parameters.push(
    new ethereum.EventParam(
      "newTipAmount",
      ethereum.Value.fromUnsignedBigInt(newTipAmount)
    )
  )

  return videoTippedEvent
}

export function createVideoUploadedEvent(
  id: BigInt,
  owner: Address,
  title: string,
  description: string,
  ipfsHash: string
): VideoUploaded {
  let videoUploadedEvent = changetype<VideoUploaded>(newMockEvent())

  videoUploadedEvent.parameters = new Array()

  videoUploadedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  videoUploadedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  videoUploadedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  videoUploadedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )
  videoUploadedEvent.parameters.push(
    new ethereum.EventParam("ipfsHash", ethereum.Value.fromString(ipfsHash))
  )

  return videoUploadedEvent
}
