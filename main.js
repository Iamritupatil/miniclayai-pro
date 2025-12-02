
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const Brain = require('./src/brain');
const AudioManager = require('./src/audio');
const ZoomAuth = require('./src/zoom-auth');

// Enable SharedArrayBuffer for Zoom SDK
app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');

let mainWindow;
let meetingWindow;
let config = {};
let brain;
let audioManager;
let zoomAuth;

// Load config
try {
  const configPath = path.join(__dirname, 'config.json');
  config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
} catch (e) {
  console.error("Could not load config.json", e);
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');
}

function createMeetingWindow() {
  meetingWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: true, // Show for debugging, can be false later
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false // Often needed for local Zoom SDK dev
    }
  });

  meetingWindow.loadFile('meeting.html');
  meetingWindow.webContents.openDevTools();

  meetingWindow.on('closed', () => {
    meetingWindow = null;
  });

  meetingWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[MeetingWindow] ${message}`);
  });
}

app.whenReady().then(() => {
  createWindow();

  // Initialize AI components
  if (config.OPENROUTER_API_KEY) {
    brain = new Brain(config);
    audioManager = new AudioManager(config);
    zoomAuth = new ZoomAuth(config);

    // Setup STT callback
    audioManager.setOnTranscript(async (transcript) => {
      mainWindow.webContents.send('log', `Heard: ${transcript}`);
      const reply = await brain.processInput(transcript);
      if (reply) {
        mainWindow.webContents.send('log', `Denn: ${reply}`);
        const audioFile = await audioManager.speak(reply);
        mainWindow.webContents.send('log', `Audio generated: ${audioFile}`);
      }
    });
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('start-meeting', (event, data) => {
  const { meetingId, passcode } = data;
  console.log(`Starting meeting: ${meetingId}`);

  event.reply('status-update', `Connecting to ${meetingId}...`);

  if (!zoomAuth) {
    event.reply('log', 'Error: Zoom SDK Key/Secret not configured.');
    return;
  }

  // 1. Generate Signature
  const signature = zoomAuth.generateSignature(meetingId, 0); // 0 = Participant

  // 2. Open Meeting Window
  if (!meetingWindow) {
    createMeetingWindow();
  }

  console.log("Waiting for meeting window to be ready...");

  const sendJoinCommand = () => {
    console.log("Sending join-meeting command to meeting window...");
    meetingWindow.webContents.send('join-meeting', {
      signature,
      meetingNumber: meetingId,
      password: passcode,
      sdkKey: config.ZOOM_SDK_KEY,
      userName: "Denn (AI Co-founder)",
      userEmail: config.ZOOM_USER_EMAIL
    });
  };

  if (meetingWindow.webContents.isLoading()) {
    meetingWindow.webContents.once('did-finish-load', () => {
      console.log("Meeting window loaded (did-finish-load).");
      sendJoinCommand();
    });
  } else {
    console.log("Meeting window already loaded.");
    sendJoinCommand();
  }
});

// Manual text input override
ipcMain.on('manual-input', async (event, text) => {
  if (brain && audioManager) {
    event.reply('log', `Manual override: ${text}`);
    const audioFile = await audioManager.speak(text);
    event.reply('log', `Audio generated: ${audioFile}`);
  }

});

// Window Control Events
ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});
