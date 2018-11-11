// グローバル変数宣言
var sharpSoundArray = ["G3","G#3","A3","A#3","B3",
                       "C4","C#4","D4","D#4","E4","F4","F#4","G4","G#4","A4","A#4","B4",
                       "C5","C#5","D5","D#5","E5","F5","F#5","G5","G#5","A5","A#5","B5",
                       "C6"];
var flatSoundArray = ["G3","Ab3","A3","B3",
                      "C4","Db4","D4","Eb4","E4","F4","Gb4","G4","Ab4","A4","Bb4","B4",
                      "C5","Db5","D5","Eb5","E5","F5","Gb5","G5","Ab5","A5","Bb5","B5",
                      "C6","Db6"];
var intervalArray = ["P1","m2","M2","m3","M3","P4","-","P5","m6","M6","m7","M7","P8"];

var totalQuestions = 0;
var totalSucceed = 0;
var totalFailed = 0;

//関数定義
function initializeSelector(){
  // selectのelementを初期化 https://materializecss.com/select.html#initialization
  $(document).ready(function(){
  $('select').formSelect();
  });
}
function debug(){
  console.log("=== This is debug ===");
  console.log("questions:"+questions);
  console.log("interval:"+interval);
  console.log("intervalType:"+intervalType);
  console.log("firstSound:"+firstSound);
  console.log("secondSound:"+secondSound);
  console.log("accidental:"+accidental);
  console.log("soundArray.length:"+soundArray.length);
  console.log("totalQuestions:"+totalQuestions);
  console.log("totalSucceed:"+totalSucceed);
  console.log("totalFailed:"+totalFailed);
  console.log("firstNote:"+firstNote);
  console.log("secondNote:"+secondNote);
}
function switchPage(present,next){
  document.getElementById(present).classList.add("hide");
  document.getElementById(next).classList.remove("hide");
}
function load() {
  ABCJS.renderAbc("sheet", abc);
}
function setAbc(){
  firstNote = convertToNote(firstSound);
  secondNote = convertToNote(secondSound);
  abc = "L: 1/4\n" +
        "I: papersize A3\n" +
        "%%scale 1.5\n" +
        firstNote + "|" + secondNote + "|";
}
function convertToNote(sound){
  letter = [];
  for (i=0; i<sound.length; i++){
  letter.push(sound.substr(i,1));
  }
  if (letter[1] == "#"){
    note = "^"+letter[0];
  } else if (letter[1] == "b"){
    note = "_"+letter[0];
  } else {
    note = letter[0];
  }
  letterTail = letter[letter.length - 1];
  if (letterTail == "3"){
    note = note + ",";
  } else if (letterTail == "5"){
    note = note.toLowerCase(note);
  } else if (letterTail == "6"){
    note = note + "'";
  }
  return note;
}
function getRandomInt(min, max) {
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function setSoundArray(accidental){
  if (accidental == "sharp"){
    soundArray = sharpSoundArray;
  } else if (accidental == "flat"){
    soundArray = flatSoundArray;
  }
}
function setFirstSound(intervalType){
  if (intervalType=="asc"){
     var firstSound = soundArray[getRandomInt(0,17)];
  } else if (intervalType=="desc"){
     var firstSound = soundArray[getRandomInt(12,29)];
  }
  return firstSound;
}
function setSecondSound(interval,intervalType,firstSound){
  var intervalId = intervalArray.indexOf(interval);
  var firstSoundId = soundArray.indexOf(firstSound);
  if (intervalType=="asc"){
    var secondSound = soundArray[firstSoundId+intervalId];
  } else if (intervalType=="desc"){
    var secondSound = soundArray[firstSoundId-intervalId];
  }
  return secondSound;
}
function setQuestion(initialize){
  if (initialize == "true"){
    questions = selectQuestion.questions.value;
    if (questions=="0"){
      questions = "endless";
    }
    interval = $('#interval').val();
    intervalType = $('#intervalType').val();
    accidental = $('#accidental').val();
  }
  setSoundArray(accidental);
  firstSound = setFirstSound(intervalType);
  secondSound = setSecondSound(interval,intervalType,firstSound);
  setAbc();
  load();
}
function reduceCount(){
  if (questions!="endless"){
    questions--
  }
  if (questions=="0"){
    switchPage("questionPage","resultPage");
    displayRresult();
  }
}
function playSound(sound,length){
  var synth = new Tone.Synth().toMaster();
  synth.triggerAttackRelease(sound,length);
}
function playFirstSound(){
  playSound(firstSound,5);
}
function playSecondSound(){
  playSound(secondSound,1);
}
function increaseCount(result){
  if (result == "succeed"){
    totalQuestions++;
    totalSucceed++;
  } else if (result == "failed"){
    totalQuestions++;
    totalFailed++;
  }
}
function displayRresult(){
  correctRate = totalSucceed/totalQuestions*100;
  correctRate = Math.round(correctRate*10)/10; //小数点第二位で四捨五入
  document.getElementById("result").innerHTML =
    "<h4>"+"correctRate:"+correctRate+"%"+"</h4>"+
    "<p>"+"intervalType:"+intervalType+"</p>"+
    "<p>"+"interval:"+interval+"</p>"+
    "<p>"+"accidental:"+accidental+"</p>"+
    "<p>"+"totalQuestions:"+totalQuestions+"</p>"+
    "<p>"+"totalSucceed:"+totalSucceed+"</p>"+
    "<p>"+"totalFailed:"+totalFailed+"</p>";
}
function resetCount(){
  totalQuestions = "";
  totalSucceed = "";
  totalFailed = "";
}

//イベントリスナー
document.getElementById("play_button").addEventListener("click",
  function(){
    switchPage("selectPage","questionPage");
    var initialize = "true";
    setQuestion(initialize);
  }
);
document.getElementById("play_firstSound").addEventListener("click",function(){playFirstSound()});
document.getElementById("play_secondSound").addEventListener("click",function(){playSecondSound()});
document.getElementById("succeed_button").addEventListener("click",
  function(){
    switchPage("answers","next");
    increaseCount("succeed");
  }
);
document.getElementById("failed_button").addEventListener("click",
  function(){
    switchPage("answers","next");
    increaseCount("failed");
  }
);
document.getElementById("next_button").addEventListener("click",
  function(){
    reduceCount();
    switchPage("next","answers");
    var initialize = "false";
    setQuestion(initialize);
  }
);
document.getElementById("exit_button").addEventListener("click",
  function(){
    switchPage("questionPage","resultPage");
    displayRresult();
  }
);
document.getElementById("top_button").addEventListener("click",
  function(){
    switchPage("resultPage","selectPage");
    resetCount();
  }
);
window.onload = function(){
  initializeSelector();
}
