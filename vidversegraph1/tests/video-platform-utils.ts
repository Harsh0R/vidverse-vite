import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import {
  CreatedStream,
  StreamStopped,
  StreamTipped,
  SubscribedToCreator,
  UnsubscribedFromCreator,
  UserRegistered,
  VideoTipped,
  VideoUploaded
} from "../generated/VideoPlatform/VideoPlatform"

export function createCreatedStreamEvent(
  id: BigInt,
  owner: Address,
  stramName: string,
  description: string,
  playBackId: string,
  status: boolean,
  streamKey: string,
  streamID: string
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
  createdStreamEvent.parameters.push(
    new ethereum.EventParam("streamKey", ethereum.Value.fromString(streamKey))
  )
  createdStreamEvent.parameters.push(
    new ethereum.EventParam("streamID", ethereum.Value.fromString(streamID))
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

export function createStreamTippedEvent(
  streamId: BigInt,
  owner: Address,
  tipper: Address,
  amount: BigInt,
  newTipAmount: BigInt
): StreamTipped {
  let streamTippedEvent = changetype<StreamTipped>(newMockEvent())

  streamTippedEvent.parameters = new Array()

  streamTippedEvent.parameters.push(
    new ethereum.EventParam(
      "streamId",
      ethereum.Value.fromUnsignedBigInt(streamId)
    )
  )
  streamTippedEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  streamTippedEvent.parameters.push(
    new ethereum.EventParam("tipper", ethereum.Value.fromAddress(tipper))
  )
  streamTippedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  streamTippedEvent.parameters.push(
    new ethereum.EventParam(
      "newTipAmount",
      ethereum.Value.fromUnsignedBigInt(newTipAmount)
    )
  )

  return streamTippedEvent
}

export function createSubscribedToCreatorEvent(
  subscriber: Address,
  creator: Address
): SubscribedToCreator {
  let subscribedToCreatorEvent = changetype<SubscribedToCreator>(newMockEvent())

  subscribedToCreatorEvent.parameters = new Array()

  subscribedToCreatorEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )
  subscribedToCreatorEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return subscribedToCreatorEvent
}

export function createUnsubscribedFromCreatorEvent(
  subscriber: Address,
  creator: Address
): UnsubscribedFromCreator {
  let unsubscribedFromCreatorEvent = changetype<UnsubscribedFromCreator>(
    newMockEvent()
  )

  unsubscribedFromCreatorEvent.parameters = new Array()

  unsubscribedFromCreatorEvent.parameters.push(
    new ethereum.EventParam(
      "subscriber",
      ethereum.Value.fromAddress(subscriber)
    )
  )
  unsubscribedFromCreatorEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )

  return unsubscribedFromCreatorEvent
}

export function createUserRegisteredEvent(
  userAddress: Address,
  username: string
): UserRegistered {
  let userRegisteredEvent = changetype<UserRegistered>(newMockEvent())

  userRegisteredEvent.parameters = new Array()

  userRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "userAddress",
      ethereum.Value.fromAddress(userAddress)
    )
  )
  userRegisteredEvent.parameters.push(
    new ethereum.EventParam("username", ethereum.Value.fromString(username))
  )

  return userRegisteredEvent
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
