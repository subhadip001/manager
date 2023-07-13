import React, { useState } from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

function App() {
  const [videoSrc, setVideoSrc] = useState('')
  const [message, setMessage] = useState('Click Start to transcode')
  const ffmpeg = createFFmpeg({
    log: true,
  })

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    setMessage('File selected: ' + file.name)
  }

  const handleStartClick = async () => {
    setMessage('Loading ffmpeg-core.js')
    await ffmpeg.load()
    setMessage('Start transcoding')

    const fileInput = document.getElementById('fileInput')
    const file = fileInput.files[0]
    ffmpeg.FS('writeFile', 'inputVideo', await fetchFile(file))
    await ffmpeg.run('-i', 'inputVideo', 'outputVideo.mp4')
    setMessage('Complete transcoding')

    const data = ffmpeg.FS('readFile', 'outputVideo.mp4')
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })))
  }

  return (
    <div className="App">
      <p />
      <video src={videoSrc} controls />
      <br />
      <input type="file" id="fileInput" accept="video/*" onChange={handleFileChange} />
      <br />
      <button onClick={handleStartClick}>Start</button>
      <p>{message}</p>
    </div>
  )
}

export default App
