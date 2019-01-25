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

//関数定義
function debug(){
  console.log("=== This is debug ===");

  setCheckboxStatus();
  console.log("checkboxStatusArray:"+checkboxStatusArray);
//  console.log("preId:"+preId);
  console.log("intervalId:"+intervalId);
  console.log("interval:"+interval);
  console.log("intervalType:"+intervalType);
  console.log("accidental:"+accidental);
  console.log("firstSound:"+firstSound);
  console.log("secondSound:"+secondSound);
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
function setQuestion(){
  setCheckboxStatus();
  preId = getRandomInt(0,checkboxStatusArray.length);
  intervalId = checkboxStatusArray[preId];
  interval = intervalArray[intervalId];
  if (interval == "-"){
    setQuestion();
  }
  aFlag = getRandomInt(0,2);
  if (aFlag == "0"){
    accidental = "flat";
  } else if (aFlag == "1"){
    accidental = "sharp"
  }
  setIntervalType();
  setSoundArray(accidental);
  firstSound = setFirstSound(intervalType);
  secondSound = setSecondSound(interval,intervalType,firstSound);
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
function convertToMessage(interval){
  type = interval.substr(0,1);
  if (type == "P"){
    type = "カンゼン";
  } else if (type == "M"){
    type = "チョウ";
  } else if (type == "m"){
    type = "タン";
  }
  degree = interval.substr(1,1);
  message = type + degree + "度";
  console.log("Message is "+message);
  return message;
}
function play(){
  if (loop == "true"){
    var ssu = new SpeechSynthesisUtterance();
    ssu.text = convertToMessage(interval);
    ssu.lang = 'ja-JP';

    playFirstSound();
    setTimeout(
      function (){playSecondSound();},1000
    );
    setTimeout(
      function (){speechSynthesis.speak(ssu);},4000
    );
    setTimeout(
      function (){setQuestion(); debug(); play();},6000
    );

  } else {
    return;
  }

}
function stop(){
  loop = "false";
}
function exit(){
  location.href = "../menu.html"
}

//イベントリスナー
document.getElementById("play_button").addEventListener("click",function(){setQuestion(); debug(); loop="true"; play();});
document.getElementById("stop_button").addEventListener("click",function(){stop()});
document.getElementById("exit_button").addEventListener("click",function(){exit()});
