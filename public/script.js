// Basic interactions for the demo page

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const controlsSection = document.getElementById('controls-section');
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-button');
    const pauseBtn = document.getElementById('pause-button');
    const stopBtn = document.getElementById('stop-button');
    const micBtn = document.getElementById('mic-button');
    const speedSelect = document.getElementById('speed-select');

    let mediaRecorder;
    let audioChunks = [];

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        controlsSection.hidden = false;
    });

    playBtn.addEventListener('click', () => {
        audioPlayer.playbackRate = parseFloat(speedSelect.value || '1');
        audioPlayer.play();
    });

    pauseBtn.addEventListener('click', () => {
        audioPlayer.pause();
    });

    stopBtn.addEventListener('click', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    });

    micBtn.addEventListener('click', () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            micBtn.textContent = 'Start Mic';
            return;
        }
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            mediaRecorder.addEventListener('dataavailable', event => {
                audioChunks.push(event.data);
            });
            mediaRecorder.addEventListener('stop', () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                audioPlayer.src = url;
                audioPlayer.hidden = false;
            });
            mediaRecorder.start();
            micBtn.textContent = 'Stop Mic';
        }).catch(err => console.error(err));
    });
});
