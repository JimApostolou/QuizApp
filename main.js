const divStart = document.querySelector('#start');
const startBtn = document.querySelector('#game-start');
const divContainer = document.querySelector('#container');
const progressBar = document.querySelector('#progress-bar');
const pTagQuestions = document.querySelector('#number'); 
const questionDiv = document.querySelector('#question');
const optionsul = document.querySelector('#options'); 
const pTagPoints = document.querySelector('.points');

//Arrays
let questions = [];
let options = [];

let questionNumber = 1;
let number;
let category;
let difficulty;
let type;
let progress;
let points = 0;
let startPoint = 0;

startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    divStart.classList.toggle('hide');
    divContainer.classList.toggle('hide');
    number = document.querySelector('#num-questions').value;
    category = document.querySelector('#category').value;
    difficulty = document.querySelector('#difficulty').value;
    type = document.querySelector('#type').value;
    progress = questionNumber/number*100;
    progressBar.classList.add(`bar${progress}`);
    let url = createApiUrl(number,category,difficulty,type)
    fetchData(url);
})

function createApiUrl(number,category,difficulty,type) {
    let url = `https://opentdb.com/api.php?amount=${number}`;
    url += category !== 'any' ? `&category=${category}` : '';
    url += difficulty !== 'any' ? `&difficulty=${difficulty}` : '';
    url += type !== 'any' ? `&type=${type}` : '';
    return url;
}

async function fetchData(url) {
    let response = await fetch(url);
    let data = await response.json();
    appendData(data.results);
    nextQuestion(startPoint);
}

function appendData(data) {
    for(let i = 0; i < data.length; i++) {
        questions.push(data[i].question);
        let limit = data[i].type === "multiple" ? 4 : 2;
        let rightAnswer = Math.floor(Math.random() * limit);
        let second = 0;
        options.push([]);
        for(let j = 0; j <= data[i].incorrect_answers.length; j++) {
            if (j === 0) {
                //To know in which position right answer is
                options[i].push(rightAnswer+1);
            }
            if (j !== rightAnswer) {
                options[i].push(data[i].incorrect_answers[second]);
                second++;
            } else {
                options[i].push(data[i].correct_answer);
            }            
        }
    }
}

function game(startPoint) {
    questionDiv.innerHTML = `${questions[startPoint]}`;
    pTagQuestions.textContent = `${questionNumber}/${number}`;
    pTagPoints.textContent = `${points}`;
    optionsul.textContent = '';
    for (let i = 1; i < options[startPoint].length; i++) {
        const li = document.createElement('li');
        li.classList.add('answer');
        li.classList.add(`${i}`);
        li.innerHTML = `${options[startPoint][i]}`;        
        optionsul.appendChild(li);
    }
    return options[startPoint][0];
}

function nextQuestion(startPoint){
    let answer = game(startPoint);
    optionsul.addEventListener('click', (e) => {
        e.preventDefault();
        let target = e.target.classList;
        check(answer,target,startPoint);
    })
}

function check(answer,target,startPoint) {
    if (target[1] == answer && startPoint + 1 === questionNumber) {
        points++;
        questionNumber++;
        progress = questionNumber/number*100;
        startPoint++;
        pTagPoints.textContent = `${points}`;
        pTagQuestions.textContent = `${questionNumber}/${number}`;
        progressBar.className = `bar${progress}`
        questionNumber <= number ? nextQuestion(startPoint) : finish(points);
    } else if (target[1] >= 0 && target[1] <= 3 && startPoint + 1 === questionNumber) {
        questionNumber++;
        progress = questionNumber/number*100;
        startPoint++;
        pTagPoints.textContent = `${points}`;
        pTagQuestions.textContent = `${questionNumber}/${number}`;
        progressBar.className = `bar${progress}`
        questionNumber <= number ? nextQuestion(startPoint) : finish(points);
    }
}

function finish(points) {
    divContainer.innerHTML = ''
    const h1 = document.createElement('h1');
    h1.classList.add('final-text');
    h1.textContent = `Your score is : ${points}`
    divContainer.appendChild(h1)
}