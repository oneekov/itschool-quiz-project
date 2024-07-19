var data; //переменная для данных квиза
var currentQuestion = 0; //текущий вопрос
var timer; //таймер (на будущее)
var timerId;
var QCShowed = false;
var mobile = false;
var answers = [0, 0, 0, 0, 0]
var lastQA = false;

//адаптация начального экрана под мобилки
//прежде чем меня оссуждать, помните, что это первый мой сайт, написанный без ChatGPT и других нейронок :troll:
function mobileStart() {
    if (screen.orientation['type'] == 'portrait-primary') { //если ориентация портретная, то адаптируем
        //дальше идут волшебные значения, которые лень описывать
        //просто знайте, что они делают всё классно

        mobile = true;

        document.querySelector(".logo").style.width = "85%";
        document.querySelector(".logo").style.margin = "14% auto 0 auto";
        document.querySelector(".quizname").style.fontSize = "4vh";
        document.querySelector(".quizname").style.margin = "10% 0 0 8%";
        document.querySelectorAll(".lines").forEach((line) => {
            line.setAttribute("size", "20");
            line.style.marginTop = "5%";
            line.style.marginLeft = "8%";
            line.setAttribute("width", line.getAttribute("width") * 2);
        });
        document.querySelector(".lines").style.marginTop = "10%"
        document.querySelector(".enterButton").style.fontSize = "72px";
        document.querySelector(".enterButton").style.width = "400px";
        document.querySelector(".enterButton").style.padding = "60px";
        document.querySelector(".enterButton").style.borderRadius = "72px";

        document.querySelector(".minilogo").style.width = "5vh";
        document.querySelector(".minilogo").style.height = "6vh";
        document.querySelector(".minilogo").style.padding = "2%";
        document.querySelector(".quizmininame").style.fontSize = "5vw";
        document.querySelector(".menuicon").style.width = "6vh";
        document.querySelector(".menuicon").style.height = "6vh";
        document.querySelector(".questiontext").style.fontSize = "6vw";
        document.querySelector(".questionnumber").style.fontSize = "4vw";
        document.querySelector(".questiontimer").style.fontSize = "4vw";
        document.querySelector(".questiontext").style.padding = "0vw 5.2vw 0 5.2vw";
        document.querySelector(".questionnumber").style.margin = "5.2vw";
        document.querySelector(".questiontimer").style.margin = "5.2vw 5.2vw 0 5.2vw";
        document.querySelectorAll("label").forEach ((element) => {
            element.classList.add("labelmobile");
        })
        // document.querySelectorAll("input").forEach ((element) => element.style.width = "4vw" )
        document.querySelectorAll("input").forEach((element) => {
            element.classList.add("inputmobile");
            // console.log(element)
        })
        
        document.querySelector(".checkAnswer").classList.add("camobile");
        document.querySelector(".hinticon").classList.add("hintmobile");
        document.querySelector(".popupwindow").classList.add("popupmobile");
        document.querySelector(".popupbutton").classList.add("popupbuttonmobile");
        document.querySelector(".popuptext").classList.add("popuppmob");
        document.querySelectorAll(".questionchoose p").forEach(element => element.classList.add("qcmobile"));
        document.querySelector(".questionchoose").classList.add("qqcmob");

        document.querySelector(".endlogo").classList.add("endlogomob");
        document.querySelector(".endbase").classList.add("endbasemob");
        document.querySelectorAll(".scbase").forEach(element => element.classList.add("scmob"))

        document.querySelector(".semicircle1").classList.add("sc1");
        document.querySelector(".semicircle2").classList.add("sc2");
        document.querySelector(".semicircle3").classList.add("sc3");
        document.querySelector(".semicircle4").classList.add("sc4");
    }
}

function renderQA() {
    for (let i = 0; i < 4; i++) {
        document.querySelector(".questiontext").innerText = data['qa'][currentQuestion]['question'];
        document.querySelector(".questionnumber").innerText = "Вопрос №" + (currentQuestion+1) + " из 5"
        document.getElementsByTagName("label")[i].innerHTML = '<input ' + (mobile ? 'class="inputmobile" ' : "")  + 'type="radio" name="radiobox" value="' + (i+1) + '">' + data['qa'][currentQuestion]['answers'][i];
    }
}

async function loadQuizData() {
    const response = await fetch('/api/getQuizData/' + window.location.pathname.split("/")[2]); //обращаемся к api
    data = await response.json(); //парсим json

    if (data.hasOwnProperty("error")) {
        document.querySelector(".quizname").innerText = "404: Квиз не найден";
        document.querySelector(".enterButton").remove();
        document.title = "404: Квиз не найден";
    } else {
        document.querySelector(".quizname").innerText = data['name'];
        document.querySelector(".quizmininame").innerText = data['name'];
        document.title = data['name'];
        timer = new Date(data['timer']);

        renderQA();
    }
}

function changeQuestion(element) {
    document.querySelector(".questionchoose").classList.remove("showanim");
    QCShowed = false;
    currentQuestion = element.innerText - 1;
    renderQA();
}

function startTimer() {
    timerId = setInterval(doTimer, 1000)
}

function doTimer() {
    if (timer.getTime() <= 0){
        lastQA = true;
        showPopup("Время вышло!");
        clearInterval(timerId);
    } else {
        var minutes = "0" + timer.getMinutes();
        var seconds = "0" + timer.getSeconds();
        document.querySelector(".questiontimer").innerText = minutes.slice(-2) + ":" + seconds.slice(-2);
        timer = new Date(timer - new Date(1000));
    }
}

function fromStartToQuiz() { //переход от начального экрана к самому квизу
    document.querySelector(".enterdiv").classList.add("hide");
    document.querySelector(".quizdiv").classList.add("showanim");
    document.querySelector(".quizdiv").classList.remove("hide");

    var minutes = "0" + timer.getMinutes();
    var seconds = "0" + timer.getSeconds();
    document.querySelector(".questiontimer").innerText = minutes.slice(-2) + ":" + seconds.slice(-2);

    startTimer();
    // document.querySelector(".quiz-bg").setAttribute("style", "background: linear-gradient(160deg, rgba(168,224,255,1) 0%, rgba(250,234,155,1) 100%);");
}

function fromQuizToEnd() {
    renderEnd();

    clearInterval(timerId);

    document.querySelector(".quizdiv").style.display = "none";
    document.querySelector(".enddiv").classList.add("endshow");
    // renderEnd();
}

function nextQA() {
    if (currentQuestion >= 4){
        lastQA = true;
    } else {
        currentQuestion++;
        renderQA();
    }
}   

// возможно, вы заметили, кто комментариев маловато. Просто я уже хочу хоть как-то это закончить, и мне лень, так что на документацию и нормальный нейминг мне без разницы. // 14.07.24 22:51

function checkAnswer() {
    if (document.querySelector('input[name="radiobox"]:checked') != null){
        var checkedInput = document.querySelector('input[name="radiobox"]:checked').value;
        if (checkedInput == data['qa'][currentQuestion]['correctanswer']) {
            showPopup("Правильный ответ!");
            answers[currentQuestion] = 1;
        } else {
            showPopup("Неправильный ответ!");
            answers[currentQuestion] = 0;
        }
        // console.log(answers);
        nextQA();
    } else {
        showPopup("Выберите ответ");
    }
}

function showHint() {
    showPopup(data['qa'][currentQuestion]['hint']);
}

function loadSite() {
    mobileStart();
    loadQuizData();
}

document.addEventListener("DOMContentLoaded", loadSite);

function toggleQC() {
    if (QCShowed) {
        document.querySelector(".questionchoose").classList.remove("showanim");
    } else {
        document.querySelector(".questionchoose").classList.add("showanim");
    }
    QCShowed = !QCShowed
}

function showPopup(text) {
    document.querySelector(".questionchoose").classList.remove("showanim");
    QCShowed = false;
    document.querySelector(".popuptext").innerText = text;
    document.querySelector(".popup").classList.add("popupshow");
}

function closePopup() {
    document.querySelector(".popup").classList.remove("popupshow");
    if (lastQA){
        fromQuizToEnd();
    }
}

function renderEnd() {
    correctanswers = answers.reduce((partialSum, a) => partialSum + a, 0)
    document.querySelector(".endtext2").innerHTML = "Твой результат:<br><b>" + correctanswers + "/5</b>";
    switch(correctanswers) {
        case 0:
        case 1:
        case 2:
            document.querySelector(".endtext1").innerText = "Старайся лучше!";
            document.querySelector(".endlogo").src = "/static/star.svg";
            break;

        case 3:
            document.querySelector(".endtext1").innerText = "Неплохо";
            document.querySelector(".endlogo").src = "/static/star.svg";
            break;

        case 4:
        case 5:
            document.querySelector(".endtext1").innerText = "Поздравляем!";
            document.querySelector(".endlogo").src = "/static/win.svg";
            break;
    }
}