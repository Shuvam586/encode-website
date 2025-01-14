let contextMain = [];

const startButton = document.getElementById("startButton");
const outputDiv = document.getElementById("output");
const chatWindow = document.getElementById("chat-window");

console.log(startButton);

const recognition = new(window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    window.mozSpeechRecognition ||
    window.msSpeechRecognition)();
recognition.lang = "en-US";

recognition.onstart = () => {
    startButton.innerHTML = '<span class="material-symbols-outlined">radio_button_checked</span>';
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    // outputDiv.textContent = transcript;

    let contextString = contextMain.join(", ");
    console.log(contextString);

    modelCall(contextString, transcript);
    contextMain.push("[user: " + transcript + "]");
    chatWindow.innerHTML = chatWindow.innerHTML+`<div class="user-chat">
            <div class="icon">
                <div class="icon-wrapper">
                    <span class="material-symbols-outlined">
                    face
                    </span>
                </div>
            
            </div>
            <div class="message">${transcript}</div>
        </div>`
        const element = document.getElementById('chat-window'); // Select your element
        element.scrollTop = element.scrollHeight; 
};

recognition.onend = () => {
    startButton.innerHTML = '<span class="material-symbols-outlined">mic</span>';
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
            
            chatWindow.innerHTML = chatWindow.innerHTML+`<div class="bot-chat">
            <div class="icon">
                <div class="icon-wrapper">
                    <span class="material-symbols-outlined">
                    smart_toy
                    </span>
                </div>
            
            </div>
            <div class="message">${data.response}</div>
        </div>`

        const element = document.getElementById('chat-window'); // Select your element
element.scrollTop = element.scrollHeight; 
            
            textSpeech(data.response);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function textSpeech(text) {
    const options = {
        method: 'POST',
        mode: 'no-cors',
        headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzgyODljYTQzNjMwNGZhZDUwNmZiYzAiLCJrZXlOYW1lIjoiZW5jb2RlIiwiaWF0IjoxNzM2NzU4MjE0fQ.-kRBdbj6R6sHCOEhTIS87WjeYigNiAdMaiCW7FOJXDI', 'Content-Type': 'application/json' },
        body: `{"voice_id":"emily","text":"${text}","speed":1,"sample_rate":24000,"add_wav_header":true}`
    };

    fetch('https://waves-api.smallest.ai/api/v1/lightning/get_speech', options)
        // .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.log(err));
}

modelCall('', 'hi');


const inputBox = document.getElementById('message-text');
    const submitButton = document.getElementById('send');

// Add a click event listener to the button
submitButton.addEventListener('click', () => {
    const inputValue = inputBox.value; // Get the input value
    console.log(inputValue);
    let contextString = contextMain.join(", ");
    modelCall(contextString, inputValue);
    contextMain.push("[user: " + inputValue + "]");
    chatWindow.innerHTML = chatWindow.innerHTML+`<div class="user-chat">
            <div class="icon">
                <div class="icon-wrapper">
                    <span class="material-symbols-outlined">
                    face
                    </span>
                </div>
            
            </div>
            <div class="message">${inputValue}</div>
        </div>`
    inputBox.value = "";
    const element = document.getElementById('chat-window'); // Select your element
element.scrollTop = element.scrollHeight; 
});