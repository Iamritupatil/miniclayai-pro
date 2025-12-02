const { ipcRenderer } = require('electron');

const joinBtn = document.getElementById('joinBtn');
const meetingIdInput = document.getElementById('meetingId');
const passcodeInput = document.getElementById('passcode');
const statusDiv = document.getElementById('status');
const logArea = document.getElementById('logArea');
const manualInput = document.getElementById('manualInput');
const speakBtn = document.getElementById('speakBtn');

function log(message) {
  const line = document.createElement('div');
  line.innerText = `[${new Date().toLocaleTimeString()}] ${message}`;
  logArea.appendChild(line);
  logArea.scrollTop = logArea.scrollHeight;
}

joinBtn.addEventListener('click', () => {
  console.log("Join button clicked"); // Debug log
  const meetingId = meetingIdInput.value;
  const passcode = passcodeInput.value;
  console.log(`Meeting ID: ${meetingId}, Passcode: ${passcode}`); // Debug log

  if (meetingId) {
    log(`Requesting to join meeting: ${meetingId}`);
    ipcRenderer.send('start-meeting', { meetingId, passcode });
  } else {
    log('Error: Meeting ID is required');
  }
});

speakBtn.addEventListener('click', () => {
  const text = manualInput.value;
  if (text) {
    log(`Sending override: ${text}`);
    ipcRenderer.send('manual-input', text);
    manualInput.value = '';
  }
});

// Allow pressing Enter in manual input
manualInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    speakBtn.click();
  }
});

ipcRenderer.on('log', (event, message) => {
  log(message);
});

ipcRenderer.on('status-update', (event, status) => {
  statusDiv.innerText = status;
});

// Window Controls
const minBtn = document.getElementById('minBtn');
const closeBtn = document.getElementById('closeBtn');

if (minBtn) {
  minBtn.addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
  });
}

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    ipcRenderer.send('close-window');
  });
}