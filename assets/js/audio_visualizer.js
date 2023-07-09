let audio = document.getElementById('eurobeat_tei');
let canvas = document.getElementById('visualizer_canvas');
let ctx = canvas.getContext('2d');

// Create audio context
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = audioContext.createMediaElementSource(audio);

// Create analyser node
let analyser = audioContext.createAnalyser();
audioSource.connect(analyser);
analyser.connect(audioContext.destination);

// Set to mono
analyser.channelCount = 1;

// FFT size
analyser.fftSize = 256;

// Get frequency data array
let dataArray = new Uint8Array(analyser.frequencyBinCount);

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function draw() {
  // Get frequency data
  analyser.getByteFrequencyData(dataArray);

  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Set fill style
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';

  // Draw frequency bars
  for (let i = 0; i < analyser.frequencyBinCount; i++) {
    let value = dataArray[i];
    let percent = value / 255;
    let height = canvas.height * percent;
    let offset = canvas.height - height - 1;
    let barWidth = canvas.width/analyser.frequencyBinCount;
    ctx.fillRect(i * barWidth, offset, barWidth, height);
  }

  requestAnimationFrame(draw);
}

audio.onplay = () => {
  if(audioContext.state === 'suspended') {
    audioContext.resume();
  }
  draw();
};