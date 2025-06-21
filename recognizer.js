const { v4: uuidv4 } = require('uuid');
var vosk = require('vosk')
const WaveFile = require('wavefile').WaveFile;
const fs = require("fs");
var mic = require("mic");

SAMPLE_RATE = 44100
PLAYING_FILE = process.env.PLAYING_FILE
RESULT_FILE = process.env.RESULT_FILE

if (!fs.existsSync(process.env.MODEL_PATH)) {
    console.log("Please download the model from https://alphacephei.com/vosk/models , unpack it and \n"+
    "set the MODEL_PATH as env variable like: \n"+
    "export MODEL_PATH=/home/foo/vosk-model-small-en-us-0.15")
    process.exit()
}

vosk.setLogLevel(0);
const model = new vosk.Model(process.env.MODEL_PATH);
const rec = new vosk.Recognizer({model: model, sampleRate: SAMPLE_RATE});

var micInstance = mic({
    rate: String(SAMPLE_RATE),
    channels: '1',
    debug: false,
    device: 'default',   
    fileType: 'wav'
});

var micInputStream = micInstance.getAudioStream();

console.log("almost ready")

var spellsRecognizerData = {};

micInputStream.on('data', async (data) => {    
    if(rec.acceptWaveform(data)){
      var result = rec.result();
      if(result && result.text && result.text !=""){
        var playing = await fs.promises.readFile(PLAYING_FILE, "utf8");
        var rawSpellId = playing.split("/").slice(-1)[0];
        var spellId = rawSpellId.split(".")[0];
        if(typeof spellsRecognizerData[spellId] === 'undefined'){
            spellsRecognizerData[spellId] = [];
        }
        spellsRecognizerData[spellId].push(result.text);
        console.log(`${spellId} : ${result.text}`);
      }  
    }    
});

micInputStream.on('audioProcessExitComplete', function() {
    console.log("Cleaning up");
    console.log("exit:"+rec.finalResult());
    rec.free();
    model.free();
});

process.on('SIGINT', async function() {
    console.log("\nStopping");

    var spellsAsString = JSON.stringify(spellsRecognizerData);
    await fs.promises.writeFile(RESULT_FILE, spellsAsString);

    micInstance.stop();
});

micInstance.start();