let contextMain = [];

const startButton = document.getElementById("startButton");
const outputDiv = document.getElementById("output");

console.log(startButton);

const recognition = new(window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();
recognition.lang = "en-US";

recognition.onstart = () => {
    startButton.textContent = "Listening...";
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    outputDiv.textContent = transcript;

    let contextString = contextMain.join(", ");
    console.log(contextString);

    modelCall(contextString, transcript);
    contextMain.push("[user: " + transcript + "]");

};

recognition.onend = () => {
    startButton.textContent = "Start Voice Input";
};

startButton.addEventListener("click", () => {
    recognition.start();
});

function modelCall(context, prompt) {
    fetch(`https://model-api-hosting.onrender.com/ss?context=${context}&prompt=${prompt}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parsing the JSON response
        })
        .then(data => {
            contextMain.push("[ai sales agent: " + data.response + "]");
            console.log(data.response); // Handling the data from the API
            textSpeech(data.response);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function textSpeech(text) {
    const options = {
        method: 'POST',
        headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzgyODljYTQzNjMwNGZhZDUwNmZiYzAiLCJrZXlOYW1lIjoiZW5jb2RlIiwiaWF0IjoxNzM2NzU4MjE0fQ.-kRBdbj6R6sHCOEhTIS87WjeYigNiAdMaiCW7FOJXDI', 'Content-Type': 'application/json' },
        body: `{"voice_id":"emily","text":"${text}","speed":1,"sample_rate":24000,"add_wav_header":true}`
    };

    fetch('https://waves-api.smallest.ai/api/v1/lightning/get_speech', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.log(err));
}