## setup

- Download some vosk model like **vosk-model-en-us-0.42-gigaspeech** from  https://alphacephei.com/vosk/models 
- Unzip it and set the value as env variable:

```
export MODEL_PATH=/home/foo/vosk-model-small-en-us-0.1
```
- Install nodejs libraries

```
npm install
```

## It works without socket

```
node client_native_without_socket.js
```

Wait until model is loaded and this console message appears: **almost ready**

Then just speak something and the transcription works as expected:

![image](https://gist.github.com/assets/3322836/bb213b29-2c8b-43aa-8fa1-24bb0ccce3f0)

## Don't work using native microphone and sockets

- In a new shell, start the socket server. Wait until this message appears: **Running on port: 2105**

```
node socket_server.js
```

- Start the native client in another shell

```
node client_native_with_socket.js
```

- Then press 1 in the shell to start
- Speak some words
- Press 2 in the shell to stop the recording and send the audio to the socket server

Audio will be sent to the server. In the server log you will see that is not a wave format for vosk but it is a valid wav file

![image](https://gist.github.com/assets/3322836/62ac9622-0ee8-4e58-9c6b-52d5b7d9a455)

## Don't work using web microphone and sockets

- In a new shell, start the web server. Wait until this message appears: **Running on port: 8080**

```
node client_web.js
```

- Open in your browser `http://lolcahost:8080s`
- Select mono as channel
- Then press "start record" and speak some words
- Press "stop record".
- Finally press "send recorded wav to socket"

![image](https://gist.github.com/assets/3322836/bd88a95d-f41d-42e5-9f6a-0ab31f8c37dc)

> Note: If I choose stereo, and record again, the **rec.acceptWaveform** returns true but the transcription is not the expected