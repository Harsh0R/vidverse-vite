import {
  CreatedStream as CreatedStreamEvent,
  StreamStopped as StreamStoppedEvent,
  StreamTipped as StreamTippedEvent,
  SubscribedToCreator as SubscribedToCreatorEvent,
  UnsubscribedFromCreator as UnsubscribedFromCreatorEvent,
  UserRegistered as UserRegisteredEvent,
  VideoTipped as VideoTippedEvent,
  VideoUploaded as VideoUploadedEvent
} from "../generated/VideoPlatform/VideoPlatform"
import {
  CreatedStream,
  StreamStopped,
  StreamTipped,
  SubscribedToCreator,
  UnsubscribedFromCreator,
  UserRegistered,
  VideoTipped,
  VideoUploaded
} from "../generated/schema"

export function handleCreatedStream(event: CreatedStreamEvent): void {
  let entity = new CreatedStream(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.VideoPlatform_id = event.params.id
  entity.owner = event.params.owner
  entity.stramName = event.params.stramName
  entity.description = event.params.description
  entity.playBackId = event.params.playBackId
  entity.status = event.params.status
  entity.streamKey = event.params.streamKey
  entity.streamID = event.params.streamID

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStreamStopped(event: StreamStoppedEvent): void {
  let entity = new StreamStopped(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.VideoPlatform_id = event.params.id
  entity.owner = event.params.owner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleStreamTipped(event: StreamTippedEvent): void {
  let entity = new StreamTipped(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.streamId = event.params.streamId
  entity.owner = event.params.owner
  entity.tipper = event.params.tipper
  entity.amount = event.params.amount
  entity.newTipAmount = event.params.newTipAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleSubscribedToCreator(
  event: SubscribedToCreatorEvent
): void {
  let entity = new SubscribedToCreator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.subscriber = event.params.subscriber
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnsubscribedFromCreator(
  event: UnsubscribedFromCreatorEvent
): void {
  let entity = new UnsubscribedFromCreator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.subscriber = event.params.subscriber
  entity.creator = event.params.creator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUserRegistered(event: UserRegisteredEvent): void {
  let entity = new UserRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.userAddress = event.params.userAddress
  entity.username = event.params.username

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVideoTipped(event: VideoTippedEvent): void {
  let entity = new VideoTipped(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.videoId = event.params.videoId
  entity.owner = event.params.owner
  entity.tipper = event.params.tipper
  entity.amount = event.params.amount
  entity.newTipAmount = event.params.newTipAmount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVideoUploaded(event: VideoUploadedEvent): void {
  let entity = new VideoUploaded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.VideoPlatform_id = event.params.id
  entity.owner = event.params.owner
  entity.title = event.params.title
  entity.description = event.params.description
  entity.ipfsHash = event.params.ipfsHash

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
