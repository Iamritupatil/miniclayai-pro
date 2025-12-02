try {
    console.log("Loading Brain...");
    require('./src/brain');
    console.log("Brain loaded.");

    console.log("Loading AudioManager...");
    require('./src/audio');
    console.log("AudioManager loaded.");

    console.log("Loading ZoomManager...");
    require('./src/zoom');
    console.log("ZoomManager loaded.");

    console.log("All modules loaded successfully.");
} catch (error) {
    console.error("Error loading modules:", error);
    process.exit(1);
}
