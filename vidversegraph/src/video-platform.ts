import {
  CreatedStream as CreatedStreamEvent,
  StreamStopped as StreamStoppedEvent,
  VideoUploaded as VideoUploadedEvent
} from "../generated/VideoPlatform/VideoPlatform"
import {
  CreatedStream,
  StreamStopped,
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
