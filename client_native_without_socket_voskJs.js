const { v4: uuidv4 } = require('uuid');
const { logLevel, loadModel, transcriptFromBuffer, freeModel } = require('@solyarisoftware/voskjs')
const WaveFile = require('wavefile').WaveFile;
const fs = require("fs");
var mic = require("mic");

SAMPLE_RATE = 44100

if (!fs.existsSync(process.env.MODEL_PATH)) {
    console.log("Please download the model from https://alphacephei.com/vosk/models , unpack it and \n" +
        "set the MODEL_PATH as env variable like: \n" +
        "export MODEL_PATH=/home/foo/vosk-model-small-en-us-0.15")
    process.exit()
}

logLevel(-1)
const model = loadModel(process.env.MODEL_PATH)

//const rec = new vosk.Recognizer({ model: model, sampleRate: SAMPLE_RATE });

var micInstance = mic({
    rate: String(SAMPLE_RATE),
    channels: '1',
    debug: false,
    device: 'default',
    fileType: 'wav'
});

var micInputStream = micInstance.getAudioStream();

console.log("almost ready")

micInputStream.on('data', async (data) => {
    console.log(Buffer.byteLength(data))
    console.log("received:", data)
    const result = await transcriptFromBuffer(data, model, {sampleRate:SAMPLE_RATE})
    console.log("rec.result():", result)
});

micInputStream.on('audioProcessExitComplete', function () {
    console.log("Cleaning up");
    freeModel(model)
});

process.on('SIGINT', function () {
    console.log("\nStopping");
    micInstance.stop();
});

micInstance.start();