const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mm = require('music-metadata');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use('/generate-audio', express.raw({ type: '*/*', limit: '50mb' }));

app.post('/generate-audio', async (req, res) => {
  try {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'ELEVENLABS_API_KEY missing' });
    }
    const audioBuffer = req.body;
    if (!audioBuffer || !audioBuffer.length) {
      return res.status(400).json({ error: 'No audio data' });
    }

    let duration = null;
    try {
      const metadata = await mm.parseBuffer(audioBuffer, null, { duration: true });
      duration = metadata.format.duration;
    } catch (err) {
      console.error('Failed to parse duration:', err.message);
    }

    const response = await axios.post(
      'https://api.elevenlabs.io/v1/speech-to-speech',
      audioBuffer,
      {
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/octet-stream',
          'Accept': 'audio/mpeg'
        },
        responseType: 'arraybuffer'
      }
    );

    if (duration) {
      console.log(`Processed audio duration: ${duration.toFixed(2)} sec`);
    }

    res.set('Content-Type', 'audio/mpeg');
    res.send(Buffer.from(response.data));
  } catch (error) {
    console.error('Error in /generate-audio:', error.message);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});

app.listen(PORT, () => {
  console.log(`Audio server listening on port ${PORT}`);
});
