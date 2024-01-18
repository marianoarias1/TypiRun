const textContainer = document.getElementById("text-container")
const textArea = document.getElementById('textarea')
const textToWrite = document.getElementById('background-text')
const p = document.createElement('p')
const p2 = document.createElement('p')
const countdown = document.getElementById('countdown')
const timeCountdown = document.createElement('small')
const results = document.getElementById('results')
const wpmReached = document.getElementById('wpm')
const accuracyPercentaje = document.getElementById('accuracy')
const reset = document.getElementById('reset')

const exampleTexts = [
    {
        id: 1,
        content: "Hola soy un texto que va a aparecer en la parte trasera del textarea y soy el que se va a ir pintando a medida que el usuario vaya tipeando en su teclado"
    },
]

let timeOut = false
let timeoutExecuted = true;

function insertText() {
    const timeCountdownText = document.createTextNode(35)
    timeCountdown.appendChild(timeCountdownText)
    countdown.appendChild(timeCountdown)

    const textNode = document.createTextNode(exampleTexts.map((e) => e.content))
    p2.appendChild(textNode)
    textToWrite.appendChild(p2)
}

function timeExpired() {
    results.removeAttribute("class")
    results.setAttribute("class", "results-container")

    textContainer.setAttribute("class", "hide")
}

function timer() {

    let time = 35
    let idInterval;
    idInterval = setInterval(() => {
        while (timeCountdown.firstChild) {
            timeCountdown.removeChild(timeCountdown.firstChild);

        }

        time--
        if (time >= 0) {
            const timeCountdownText = document.createTextNode(time)
            timeCountdown.appendChild(timeCountdownText)
        }
        else {
            clearInterval(idInterval)

        }
    }, 1000)

    countdown.appendChild(timeCountdown)


}

let wordsTyped = 0;
let initTime;
let endTime;

// Función para calcular las palabras por minuto y reiniciar el contador
function calculateWPM(textAreaValue, wordsInExample) {
    while (wpmReached.firstChild && accuracyPercentaje.firstChild) {
        wpmReached.removeChild(wpmReached.firstChild);
        accuracyPercentaje.removeChild(accuracyPercentaje.firstChild);
    }

    let correctWords = 0;
    let correctCharacters = 0;
    if (!timeOut) {

        const wordsTypedArray = textAreaValue.split(" ");

        for (let i = 0; i < Math.min(wordsInExample.length, wordsTypedArray.length); i++) {
            if (wordsTypedArray[i] === wordsInExample[i]) {
                correctWords++;
                correctCharacters += wordsInExample[i].length;
            }
        }

        const accuracy = (correctCharacters / exampleTexts[0].content.length) * 100;
        const accuracyText = document.createTextNode(`${accuracy.toFixed(2)}%`);
        accuracyPercentaje.appendChild(accuracyText);

        const wordsPerMinute = (correctWords / (35 / 60)); // cálculo de WPM
        const wpmReachedText = document.createTextNode(wordsPerMinute.toFixed(2))
        wpmReached.appendChild(wpmReachedText)
    }
    else {
        //Reiniciar el contador y el tiempo
        correctWords = 0;
        correctCharacters = 0;
        initTime = new Date();
    }
}

function textTyped(idTimeout) {

    if (timeOut) {
        clearTimeout(idTimeout);
        return;
    }

    while (p.firstChild) {
        p.removeChild(p.firstChild);

    }

    // Obtener el valor del campo de texto
    const textArea = document.getElementById('textarea').value;

    // Obtener el valor del campo de texto para enviarlo a la funcion que calcula las palabras por minuto
    const textAreaValue = textArea.trim();
    const wordsInExample = exampleTexts[0].content.trim().split(" ");
    calculateWPM(textAreaValue, wordsInExample)

    // Dividir el texto en caracteres
    const characters = textArea.split('');

    if(textArea == exampleTexts[0].content){
        timeExpired()
    }
    else{
        exampleTexts.forEach((e) => {
            const words = e.content.split('');
            for (let i = 0; i < words.length; i++) {
                const element = words[i];
    
                const letter = document.createElement('span');
    
                if (element === characters[i]) {
                    letter.appendChild(document.createTextNode(element));
                    letter.classList.add("pass");
                } else {
                    const mismatchedElement = element || '';
    
                    if (characters[i]) {
                        letter.appendChild(document.createTextNode(mismatchedElement));
                        letter.classList.add('fail');
                    }
                }
    
                p.appendChild(letter);
            }
        });
    }


    textToWrite.appendChild(p);

}



insertText()


let idTimeout;

textArea.addEventListener("input", () => {
    if (timeoutExecuted) {
        timer()
        timeoutExecuted = false;
        idTimeout = setTimeout(() => {
            timeOut = true;
            timeExpired();

        }, 35000);
    }
    textTyped();
    initTime = new Date();
});

reset.addEventListener("click",()=>{
    location.reload()
})