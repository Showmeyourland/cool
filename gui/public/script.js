// Capture microphone audio in 1-second chunks and send to /generate-audio
let mediaRecorder;
let audioContext;

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.addEventListener('dataavailable', async (event) => {
      if (event.data && event.data.size > 0) {
        await sendChunk(event.data);
      }
    });

    mediaRecorder.start(1000); // emit data every second
    toggleButtons(true);
  } catch (err) {
    console.error('Error starting recording', err);
  }
}

async function sendChunk(blob) {
  const voice = document.querySelector('#voiceToggle')?.value || 'default';
  const speed = document.querySelector('#speedToggle')?.value || '1';
  const formData = new FormData();
  formData.append('audio', blob, 'chunk.webm');
  formData.append('voice', voice);
  formData.append('speed', speed);

  try {
    const response = await fetch('/generate-audio', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Network response was not ok');
    const arrayBuffer = await response.arrayBuffer();
    playBuffer(arrayBuffer);
  } catch (error) {
    console.error('Failed to send audio chunk', error);
  }
}

function playBuffer(buffer) {
  audioContext.decodeAudioData(buffer, (decoded) => {
    const source = audioContext.createBufferSource();
    source.buffer = decoded;
    source.connect(audioContext.destination);
    source.start();
  });
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    toggleButtons(false);
  }
}

function toggleButtons(recording) {
  const startBtn = document.getElementById('startButton');
  const stopBtn = document.getElementById('stopButton');
  if (startBtn) startBtn.disabled = recording;
  if (stopBtn) stopBtn.disabled = !recording;
}

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startButton');
  const stopBtn = document.getElementById('stopButton');
  startBtn?.addEventListener('click', startRecording);
  stopBtn?.addEventListener('click', stopRecording);
  toggleButtons(false);
});
