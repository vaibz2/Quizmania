var count = 3;
let hashmap = new Map();

function checkInMap(num){
    if(hashmap.has(num)){
        if(hashmap.get(num) === 0){
            return false;
        }
    } else {
        hashmap.set(num, 0);
    }
    return true;
}

function createAnsDiv(num){
    var divElement = document.createElement("div");
    divElement.id = "ansBox" + num;
    divElement.innerHTML = "<textarea rows='2' class='answer-options' name='o3' required></textarea> <input id='tickON' class='tick-radio' style='float: right; margin: 23px 26px;' type='radio' name='correctAns" + num + "' value='o3' required><br><textarea rows='2' class='answer-options' name='o4' required></textarea> <input id='tickON' class='tick-radio' style='float: right; margin: 23px 26px;' type='radio' name='correctAns" + num + "' value='o4' required><a name='deleteInps"+ num +"' onclick='toRemoveInputs(name)'><i class='fas fa-times' style='color: rgb(238, 62, 62); cursor: pointer; margin-left: 15px; position: relative; bottom: 24px'></i></a>";
    return divElement;
}

function createDefAnsDiv(num){
    var defAns = document.createElement("div");
}

function addInput(name){
    var dyn = document.getElementById(name);
    var num = name[name.length - 1];

    var elem = createAnsDiv(num);

    if(checkInMap(num)){
        dyn.appendChild(elem);
        var hidInpId = "defInputs" + num;
        var hiddenInps = document.getElementById(hidInpId);

        hiddenInps.parentNode.removeChild(hiddenInps);
        var spId = "addADiv" + num;

        var sp_add = document.getElementById(spId);
        sp_add.parentNode.removeChild(sp_add);
    }
    
}
var quesNumber = 2;
var quesCount = 2;
function addQuesBox(){
    count = 3;
    var element = document.createElement("div");
    element.className = "ques-div";
    element.id = "q" + quesCount;
    element.innerHTML = "<div class='numbering' style='border-bottom: 1px solid #04AA6D; margin-bottom: 15px;'><span name='numSet'>"+ quesNumber +"</span><a name='q" + quesCount + "' onclick='delQues(name);''><i class='fas fa-times delQuesBox-class' alt='X' style='float: right; color: rgb(238, 62, 62);'></i></a></div><div class='step1-divs'><label class='step1-labls'>Question<span class='reqstar'>*</span></label><br><textarea style='font-weight: 500;' rows='3' class='quizinfo-input' name='quiz_topic' required autofocus></textarea></div><div class='step1-divs'><label class='step1-labls'>Answers<span class='reqstar'>*</span></label><label class='step1-labls' style='float: right;'>Correct?</label><br><div id='ansBox'><textarea rows='2' class='answer-options' name='o1'  required></textarea><input class='tick-radio' type='radio' style='float: right; margin: 23px 26px;' name='correctAns" + quesCount + "' value='o1'></div> <div id='ansBox'><textarea rows='2' class='answer-options' name='o2'  required></textarea><input class='tick-radio' type='radio' style='float: right; margin: 23px 26px;' name='correctAns" + quesCount + "' value='o2'></div><span id='dyn" + quesCount + "'></span><span id='default" + quesCount + "'><div id='defInputs" + quesCount + "'><input type='hidden' name='o3' value='nul1Span'></input><input type='hidden' name='o4' value='nul1Span'></input></div></span><span id='spAdd" + quesCount + "'><div id='addADiv" + quesCount + "'><i class='fas fa-plus' style='color: #04AA6D'></i> <a name='dyn" + quesCount + "' style='color: white; cursor: pointer;' onclick='addInput(name)'>Add Answer</a></div></span></div><br><br>";

    var newQuesBox = document.getElementById("newQuesBox");
    newQuesBox.appendChild(element);
    quesCount++; 
    quesNumber++;
}

function toRemoveInputs(name){
    var delNum = name[name.length - 1];
    var removeInps = document.getElementById("ansBox" + delNum);
    removeInps.parentNode.removeChild(removeInps);
    console.log(name);
    hashmap.delete(delNum);
    var defaultId = document.getElementById("default" + delNum);
    var defInpDiv = document.createElement("div");
    defInpDiv.id = "defInputs" + delNum;
    defInpDiv.innerHTML = "<input type='hidden' name='o3' value='nul1Span'></input><input type='hidden' name='o4' value='nul1Span'></input>"
    defaultId.appendChild(defInpDiv);

    var sp_add = document.getElementById("spAdd" + delNum);
    var spAdd = document.createElement("div");
    spAdd.id = "addADiv" + delNum;
    spAdd.innerHTML = "<i class='fas fa-plus' style='color: #04AA6D'></i> <a name='dyn" + delNum +"' style='color: white; cursor: pointer;' onclick='addInput(name)'>Add Answer</a>";
    sp_add.appendChild(spAdd);

}

function delQues(name){
   
    var delNum = name[name.length - 1];
    console.log(delNum);
    var quesdiv = document.getElementById(name);
    quesdiv.parentNode.removeChild(quesdiv);
    quesNumber -= 1;
    
    var allNumSetSpans = document.querySelectorAll('span[name="numSet"]');
    var newNums = 1;
    
    for(var rb of allNumSetSpans) {
        rb.innerHTML = newNums++;
    }
}

function checkTickRadio(index){
    var elemName = "correctAns" + index;
    var listOfTicks = document.querySelectorAll('input[name="' + elemName + '"]');

    if(listOfTicks){
        let selectedValue;
        for (const rb of listOfTicks) {
            if (rb.checked) {
                selectedValue = rb.value;
                break;
            }
        }
    }
    else{
        console.log("null");
    }
}

function getConfirmation(){
    var confirmation = confirm("This will permanently delete the quiz.");
    if(confirmation){
        return true;
    } else{
        return false;
    }
}


function play(){

    
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 10;
    const ALERT_THRESHOLD = 5;

    const COLOR_CODES = {
      info: {
        color: "green"
      },
      warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
      },
      alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
      }
    };

    const TIME_LIMIT = 10;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;

    document.getElementById("startTimer").innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
      )}</span>
    </div>
    <p style="color: black; font-family: 'Segoe UI', sans-serif;">Quiz will Start in
    `;

    startTimer();

    function onTimesUp() {
      clearInterval(timerInterval);
    }

    function startTimer() {
      timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTime(
          timeLeft
        );
        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        if (timeLeft === 0) {
          onTimesUp();
        } 
      }, 1000);
    }

    function formatTime(time) {
      const minutes = Math.floor(time / 60);
      let seconds = time % 60;

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return `${minutes}:${seconds}`;
    }

    function setRemainingPathColor(timeLeft) {
      const { alert, warning, info } = COLOR_CODES;
      if (timeLeft <= alert.threshold) {
        document
          .getElementById("base-timer-path-remaining")
          .classList.remove(warning.color);
        document
          .getElementById("base-timer-path-remaining")
          .classList.add(alert.color);
      } else if (timeLeft <= warning.threshold) {
        document
          .getElementById("base-timer-path-remaining")
          .classList.remove(info.color);
        document
          .getElementById("base-timer-path-remaining")
          .classList.add(warning.color);
      }
    }

    function calculateTimeFraction() {
      const rawTimeFraction = timeLeft / TIME_LIMIT;
      return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    function setCircleDasharray() {
      const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
      ).toFixed(0)} 283`;
      document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
    }
}

var countdown;

function quesTimer(clocktime){
  var minutes = 0;
  var seconds;
  if(clocktime > 60){
    minutes = Math.floor(clocktime/60);
    seconds = clocktime % 60;
  } else {
    seconds = clocktime;
  }

  countdown = setInterval(function() {
    if (seconds <= 0 && minutes <= 0){ 
      clearInterval(countdown);
    }
    if(minutes > 0){
      if(minutes > 9){
        if(seconds < 10){
            document.getElementById("timerClock").textContent = minutes + ":0" + seconds;
        } else {
          document.getElementById("timerClock").textContent =  minutes + ":" + seconds;
        }
      } else{
          if(seconds < 10){
            document.getElementById("timerClock").textContent = "0" + minutes + ":0" + seconds;
          } else {
            document.getElementById("timerClock").textContent = "0" + minutes + ":" + seconds;
          }
      }

    } else {
      if(seconds < 10){
        document.getElementById("timerClock").textContent = "00:0" + seconds;
      } else {
        document.getElementById("timerClock").textContent = "00:" + seconds;
      }
    }
    
    if(minutes > 0 && seconds === 0){
      minutes--;
      seconds = 60;
    }
    seconds--;
    
  }, 1000);
  
}

function select_card(num){
  var allEle = document.getElementsByClassName("list-option-card");
  for(i = 0; i < allEle.length; i++){
    allEle[i].classList.remove("list-option-card-selected");
  }

  if(num === 0){
      var mainDiv = document.getElementById("smart-card");
      var id_ele = "s" + num;
      var selectedEle = document.getElementById(id_ele);
      selectedEle.className += " list-option-card-selected";
      mainDiv.innerHTML = '<div class="content-how"><h2 class="how-it-works-heading">Designing</h2><br><div class="how-work-div-description"><p>The quiz host composes the questions and sets the parameters, such as, the points per answer, the time to submit the answer, all at quizmania.</p></div><img class="question-marks-svg" src="images/svg-2-question-mark.svg"><img class="svg-3-answer" src="images/svg-3-answer.svg"></div><div class="cartoon-img"><img class="svg-1" src="images/design-1.svg"></img></div>';
  } else if(num === 1){
      var mainDiv = document.getElementById("smart-card");
      var id_ele = "s" + num;
      var selectedEle = document.getElementById(id_ele);
      selectedEle.className += " list-option-card-selected";
      mainDiv.innerHTML = '<div class="content-how"><h2 class="how-it-works-heading">Inviting players</h2><br><div class="how-work-div-description"><p>After the quiz is all set, the host receives a unique digital code for their game. They can share this code with their audience on social media, or by any preferred means. A direct link to the game can be also used instead of the code.</p></div></div><div class="cartoon-img"><img class="quiz-code-svg" src="images/digitalCode.svg"></div>';
  } else if(num === 2){
      var mainDiv = document.getElementById("smart-card");
      var id_ele = "s" + num;
      var selectedEle = document.getElementById(id_ele);
      selectedEle.className += " list-option-card-selected";
      mainDiv.innerHTML = '<div class="content-how"><h2 class="how-it-works-heading">Checking in</h2><br><div class="how-work-div-description"><p>After the quiz is all set, the host receives a unique digital code for their game. They can share this code with their audience on social media, or by any preferred means. A direct link to the game can be also used instead of the code.</p></div></div><div class="cartoon-img"><img class="checkin-svg" src="images/checkin.svg"></div>';
  } else if(num === 3){
      var mainDiv = document.getElementById("smart-card");
      var id_ele = "s" + num;
      var selectedEle = document.getElementById(id_ele);
      selectedEle.className += " list-option-card-selected";
      mainDiv.innerHTML = '<div class="content-how"><h2 class="how-it-works-heading">Playing the game</h2><br><div class="how-work-div-description"><p>The host launches the game. The players see the questions and the answer options on their mobile devices and click on the chosen answer.</p></div></div><div class="cartoon-img"><img class="playgound-svg" src="images/playground.svg"></div>';
  } else if(num === 4){
      var mainDiv = document.getElementById("smart-card");
      var id_ele = "s" + num;
      var selectedEle = document.getElementById(id_ele);
      selectedEle.className += " list-option-card-selected";
      mainDiv.innerHTML = '<div class="content-how"><h2 class="how-it-works-heading">Leaderboard</h2><br><div class="how-work-div-description"><p>Players get points for correct answers. The leaderboard is displayed right after the play.</p></div></div><div class="cartoon-img"><img class="leaderboard-svg" src="images/leaderboard.svg"></div>';
  }
}