import React from 'react'
import { useParams } from 'react-router-dom'
import ShowVideo from '../../Components/ShowVideo/ShowVideo'

const WatchVideos = () => {
    const { id } = useParams()
  return (
    <div>
      <ShowVideo vidId={id} />
    </div>
  )
}

export default WatchVideos