# Miniclay AI 🧠

**The Invisible AI Co-Founder for Zoom**

Miniclay AI is an Electron-based application that joins your Zoom calls as "Denn", a technical co-founder. It listens to the conversation, detects when it's being spoken to, and replies with a real human voice using advanced AI.

## 🚀 How It Works (The "Magic")

We built this using a modern, local-first stack that combines the best AI tools available in 2025:

1.  **The Body (Electron)**:
    - We built a transparent, floating desktop app that sits on top of your screen.
    - It acts as the "container" for our AI, running on your computer without needing complex servers.

2.  **The Ears (Deepgram & Zoom SDK)**:
    - We use the **Zoom Meeting SDK** to connect "Denn" to the call as a participant.
    - **Deepgram** provides ultra-fast speech-to-text (transcription) so Denn can "hear" what's being said in real-time (under 300ms).

3.  **The Brain (Claude 3.5 Sonnet)**:
    - When Denn hears his name ("Denn", "CTO"), he sends the conversation history to **Claude 3.5 Sonnet** (via OpenRouter).
    - Claude is instructed to act as a confident, technical co-founder and generates a punchy, smart reply.

4.  **The Voice (ElevenLabs Turbo v2)**:
    - The text reply is sent to **ElevenLabs**, which converts it into a realistic human voice instantly.
    - This audio is played back into the meeting, so it sounds like Denn is actually speaking.

## 🛠️ Tech Stack

- **Frontend/Core**: Electron (Node.js + HTML/JS)
- **Transcription**: Deepgram Nova-2
- **Intelligence**: Anthropic Claude 3.5 Sonnet
- **Speech**: ElevenLabs Turbo v2
- **Connectivity**: Zoom Meeting SDK for Web

## 🚦 Getting Started

1.  **Install**: Run `npm install` to get all the "body parts" (dependencies).
2.  **Config**: Open `config.json` and add your API keys (the "fuel").
3.  **Run**: Type `npm start` to wake Denn up.
4.  **Join**: Enter a Zoom Meeting ID and watch Denn join the call!

## 🎮 Controls

- **Auto-Reply**: Just say "Hey Denn" or "Our CTO can explain..."
- **Manual Override**: Type exactly what you want Denn to say in the box and hit "Speak". Perfect for closing deals when you need a specific line.

---
*Built by [Your Name] & Antigravity*