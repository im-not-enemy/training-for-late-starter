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

var checkboxStatusArray = [];
var intervalTypeArray = [];
var totalQuestions = 0;
var totalSucceed = 0;
var totalFailed = 0;

//関数定義
function debug(){
  console.log("=== This is debug ===");
  console.log("checkboxStatusArray:"+checkboxStatusArray);
//  console.log("preId:"+preId);
  console.log("questions:"+questions);
  console.log("interval:"+interval);
  console.log("intervalType:"+intervalType);
  console.log("firstSound:"+firstSound);
  console.log("secondSound:"+secondSound);
  console.log("thirdSound:"+thirdSound);
  console.log("fourthSound:"+fourthSound);
  console.log("accidental:"+accidental);
  console.log("soundArray.length:"+soundArray.length);
  console.log("totalQuestions:"+totalQuestions);
  console.log("totalSucceed:"+totalSucceed);
  console.log("totalFailed:"+totalFailed);
//  console.log("firstNote:"+firstNote);
//  console.log("secondNote:"+secondNote);
}
function setCheckboxStatus(){
  checkboxStatusArray.length = 0;
  var selectedIntervals = document.forms.selectedIntervals;
  for (var i=0; i<selectedIntervals.length; i++){
    var id = selectedIntervals[i].id;
    var checked = selectedIntervals[i].checked;
    if (checked == true){
      checkboxStatusArray.push(intervalArray.indexOf(id));
    }
  }
}
function setIntervalType(){
  intervalTypeArray.length = 0;
  var selectedIntervalType = document.forms.selectedIntervalType;
  for (var i=0; i<selectedIntervalType.length; i++){
    var id = selectedIntervalType[i].id;
    var checked = selectedIntervalType[i].checked;
    if (checked == true){
      intervalTypeArray.push(id);
    }
  }
  if (intervalTypeArray.length == 2){
    iFlag = getRandomInt(0,2);
    if (iFlag == "0"){
      intervalType = "asc";
    } else if (iFlag == "1"){
      intervalType = "desc";
    }
  } else {
    intervalType = intervalTypeArray[0];
  }
}
function getRandomInt(min, max) {
  var min = Math.ceil(min);
  var max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
function setQuestion(initialize){
  if (initialize == "true"){
    questions = selectQuestion.questions.value;
    if (questions=="0"){
      questions = "endless";
    }
  }
  setCheckboxStatus();
  aFlag = getRandomInt(0,2);
  if (aFlag == "0"){
    accidental = "flat";
  } else if (aFlag == "1"){
    accidental = "sharp"
  }
  setIntervalType();
  setSoundArray(accidental);
  for (i=0; i<3; i++){
    preId = getRandomInt(0,checkboxStatusArray.length);
    intervalId = checkboxStatusArray[preId];
    interval = intervalArray[intervalId];
    if (interval == "-"){
      setQuestion();
    }
    if (i == "0"){
      firstSound = setFirstSound(intervalType);
      console.log("firstSound:" + firstSound);
      console.log("interval:" + interval);
      console.log("intervalType:" + intervalType);
      secondSound = setSecondSound(interval,intervalType,firstSound);
      console.log("secondSound:" + secondSound);
    } else if (i == "1"){
      console.log("interval:" + interval);
      console.log("intervalType:" + intervalType);
      thirdSound = setSecondSound(interval,intervalType,secondSound);
      if (!thirdSound){
        intervalType = switchIntervalType(intervalType);
        console.log("intervalType[switched]:" + intervalType);
        thirdSound = setSecondSound(interval,intervalType,secondSound);
      }
      console.log("thirdSound:" + thirdSound);
    } else if (i == "2"){
      console.log("interval:" + interval);
      console.log("intervalType:" + intervalType);
      fourthSound = setSecondSound(interval,intervalType,thirdSound);
      if (!fourthSound){
        intervalType = switchIntervalType(intervalType);
        console.log("intervalType[switched]:" + intervalType);
        fourthSound = setSecondSound(interval,intervalType,thirdSound);
      }
      console.log("fourthSound:" + fourthSound);
      setAbc();
      load();
    }
  }
}
function switchIntervalType(intervalType){
  if (intervalType == "asc"){
    intervalType = "desc";
  } else if (intervalType == "desc"){
    intervalType = "asc";
  }
  return intervalType;
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
    var index = firstSoundId+intervalId;
    if (index > soundArray.length){
      return null;
    }
  } else if (intervalType=="desc"){
    var index = firstSoundId-intervalId;
    if (index < 0){
      return null;
    }
  }
  var secondSound = soundArray[index];
  return secondSound;
}

function playSound(sound,length){
  var synth = new Tone.Synth().toMaster();
  synth.triggerAttackRelease(sound,length);
}
function playFirstSound(){
  playSound(firstSound,1);
}
function playSecondSound(){
  playSound(secondSound,1);
}
function playThirdSound(){
  playSound(thirdSound,1);
}
function playFourthSound(){
  playSound(fourthSound,1);
}
function switchPage(present,next){
  document.getElementById(present).classList.add("hide");
  document.getElementById(next).classList.remove("hide");
}
function playSound(sound,length){
  var synth = new Tone.Synth().toMaster();
  synth.triggerAttackRelease(sound,length);
}
function playBothSound(){
  var first = new Tone.Synth().toMaster();
  var second = new Tone.Synth().toMaster();
  first.triggerAttackRelease(firstSound,3);
  second.triggerAttackRelease(secondSound,3);
  Tone.Transport.start();
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
    "<p>"+"totalQuestions:"+totalQuestions+"</p>"+
    "<p>"+"totalSucceed:"+totalSucceed+"</p>"+
    "<p>"+"totalFailed:"+totalFailed+"</p>";
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
function resetCount(){
  totalQuestions = "";
  totalSucceed = "";
  totalFailed = "";
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
function load() {
  ABCJS.renderAbc("sheet", abc);
}
function setAbc(){
  firstNote = convertToNote(firstSound);
  secondNote = convertToNote(secondSound);
  thirdNote = convertToNote(thirdSound);
  fourthNote = convertToNote(fourthSound);
  abc = "L: 1/4\n" +
        "I: papersize A3\n" +
        "%%scale 1.5\n" +
        firstNote + "|" + secondNote + "|" + thirdNote + "|" + fourthNote + "|";
}

//イベントリスナー
document.getElementById("play_button").addEventListener("click",function(){
  var initialize = "true";
  setQuestion(initialize);
//  debug();
  switchPage("selectPage","questionPage");
});
document.getElementById("play_firstSound").addEventListener("click",function(){playFirstSound()});
document.getElementById("play_secondSound").addEventListener("click",function(){playSecondSound()});
document.getElementById("play_thirdSound").addEventListener("click",function(){playThirdSound()});
document.getElementById("play_fourthSound").addEventListener("click",function(){playFourthSound()});
//document.getElementById("play_bothSound").addEventListener("click",function(){playBothSound()});
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
    console.log("--------------");
    reduceCount();
    switchPage("next","answers");
    setQuestion();
//    debug();
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
