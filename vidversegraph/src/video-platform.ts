import {
  CreatedStream as CreatedStreamEvent,
  StreamStopped as StreamStoppedEvent,
  VideoTipped as VideoTippedEvent,
  VideoUploaded as VideoUploadedEvent
} from "../generated/VideoPlatform/VideoPlatform"
import {
  CreatedStream,
  StreamStopped,
  VideoTipped,
  VideoUploaded,
  VideoData,
  LiveStreamData
} from "../generated/schema"
import { BigInt } from "@graphprotocol/graph-ts";

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

  let id = event.params.owner.toHexString() + "-" + event.params.id.toString();
  let liveStreamData = LiveStreamData.load(id);

  if (!liveStreamData) {
    liveStreamData = new LiveStreamData(id);
    liveStreamData.VideoPlatform_id = event.params.id;
    liveStreamData.owner = event.params.owner;
    liveStreamData.stramName = event.params.stramName
    liveStreamData.description = event.params.description
    liveStreamData.playBackId = event.params.playBackId
    liveStreamData.status = event.params.status
    liveStreamData.streamKey = event.params.streamKey
    liveStreamData.streamID = event.params.streamID

  }
  liveStreamData.save();

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


  let id = event.params.owner.toHexString() + "-" + event.params.id.toString();
  let liveStreamData = LiveStreamData.load(id);

  if (liveStreamData) {
    liveStreamData.status = false
    liveStreamData.save();
  }

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

  let id = event.params.videoId.toHexString() + "-" + event.params.videoId.toString();
  let video = VideoData.load(id);
  if (video) {
    // If the video exists, update its totalTipAmount
    let tipAmount = event.params.amount;
    if (!video.totalTipAmount) {
      video.totalTipAmount = tipAmount;
    } else {
      video.totalTipAmount = video.totalTipAmount.plus(tipAmount);
    }
    video.save();
  }


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

  let id = event.params.id.toHexString() + "-" + event.params.id.toString();
  let videoData = VideoData.load(id);

  if (!videoData) {
    videoData = new VideoData(id);
    videoData.VideoPlatform_id = event.params.id;
    videoData.owner = event.params.owner;
    videoData.totalTipAmount = BigInt.fromI32(0);
    videoData.ipfsHash = event.params.ipfsHash
    videoData.title = event.params.title;
    videoData.description = event.params.description

  }
  videoData.save();


  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
