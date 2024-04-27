let speech = new p5.Speech();
let speechRec = new p5.SpeechRec('en-US', gotSpeech);
let conversation = [];

let continuous = true;
let interim = false;
speechRec.start(continuous, interim);

let stopListening = false;

let mobileWidth = 300;
let mobileHeight = 535;

let lastSpeech = '';
let phoneImg;

function preload() {
  phoneImg = loadImage('mobile.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  let x = (windowWidth - 1.25*mobileWidth) / 2;
  let y = (windowHeight - 1.35*mobileHeight) / 2;
  
  image(phoneImg, x, y, 1.25*mobileWidth, 1.35*mobileHeight);
  let padding = 20;
  textSize(16);
  textAlign(CENTER);
  fill('black')
  text("Ask Siri to recommend music", windowWidth / 2, y - 2*padding); 
  textAlign(LEFT); 
  fill('white')
  let textY = y + 50;
  for (let i = 0; i < conversation.length; i++) {
    let words = conversation[i].split(' ');
    let line = '';
    let indent = conversation[i].includes('You:') ? padding + 20 : mobileWidth / 2 ;
    let maxWidth = mobileWidth - 2 * padding - indent + 65;
    let startY = textY;
    let maxLineWidth = 0; 
    for (let j = 0; j < words.length; j++) {
      let testLine = line + words[j] + ' ';
      let testWidth = textWidth(testLine);
      if (testWidth > maxWidth && j > 0) {
        fill(conversation[i].includes('You:') ? 'blue' : 'green');
        text(line, x + indent, textY);
        fill('white');
        line = words[j] + ' ';
        textY += 25;
      } else {
        line = testLine;
      }
      maxLineWidth = max(maxLineWidth, textWidth(line)); 
    }
    fill(conversation[i].includes('You:') ? 'blue' : 'green');
    text(line, x + indent , textY);
    fill('white');
    textY += 30 
    let rectHeight = textY - startY;
    let rectWidth = maxLineWidth + 20;
    push();
    noFill();
    stroke('black'); 
    rect(x + indent - 10, startY - 20, rectWidth, rectHeight + 10, 10);
    textY += 20 
    pop(); 
  }
}

function gotSpeech() {
  if (speechRec.resultValue && !stopListening) {
    conversation.push('You: Hey Siri, play some music');
    
    setTimeout(function () {
      conversation.push("Sure, I can give you better suggestions if you let me know your mood");
      speech.speak("Sure, I can give you better suggestions if you let me know your mood");
      
      setTimeout(function () {
        conversation.push("You can say  “I am happy” or “I am sad”");
        speech.speak("You can say “I am happy” or “I am sad”");
        
        speechRec.resultString = '';
        setTimeout(function () {
          setTimeout(function () {
            lastSpeech = 'You: ' + speechRec.resultString;
            speechRec.onResult = function () {
              lastSpeech = 'You: ' + speechRec.resultString;
              if (lastSpeech !== '') {
                if (lastSpeech.toLowerCase().includes('h')) {
                  conversation.push('You: Happy');
                } else {
                  conversation.push('You: Sad');
                }
                conversation.push("Here is a playlist for you");
                speech.speak("Here is a playlist for you");
              }
            };
          }, 2000);
        }, 3000);
      }, 5000);
    }, 2000);
  }
  stopListening = true;
}
