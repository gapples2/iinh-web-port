const challengeData = {
  1:{
    name: "Normal",
    desc: "Your normal run (you can't exit this).",
    firstEffDesc: "You can buy another tripler per refactor.",
    repeatEffDesc: "+1x successor max.",
    goals: [40,75,85,90,100,150,200,250,300,350]
  },
  2:{
    name: "Upgrade Shortage",
    desc: "The limit for each upgrade is lowered by 4.",
    firstEffDesc: "Nothing.",
    repeatEffDesc: "Each building's limit is increased by 1.",
    goals: [40,55,65,75,85,150,200,250,300,350]
  },
  3:{
    name: "Speghetti Code",
    desc: "The refactor effect does nothing but you gain 100x more points.",
    firstEffDesc: "Nothing.",
    repeatEffDesc: "+1 refactor exponent.",
    goals: [45,50,60,65,75,125,175,225,260,300]
  },
  4:{
    name: "Empty Mines",
    desc: "Gem upgrades are removed but double point gain per gem earned.",
    firstEffDesc: "You can get up to 25 gems.",
    repeatEffDesc: "Divide the gem requirement by 250 and each unspent gem doubles point gain.",
    goals: [25,40,55,65,75,150,200,250,300,350]
  },
  5:{
    name: "Horrible Gameplay",
    desc: "All the previous challenges.",
    firstEffDesc: "+5 quadrupler max.",
    repeatEffDesc: "Increase gem max by 5.",
    goals: [270,350,600,800,1000],
    unlocked(){return researchLvl("3x2")==1},
    reset(){researchReset(true)}
  },
  6:{
    name: "Stock Market Crash",
    desc: "Cube root point gain.",
    firstEffDesc: "Unlock the squarer.",
    repeatEffDesc: "Gain 10,000x more points.",
    goals: [10,15,20,30,40],
    unlocked(){return false}
  }
}

function createChallenge(id){
  let chall = challengeData[id]
  
  if(!player.challenges[id])player.challenges[id]=0
  
  let tr = document.getElementById("challengeRow-"+(id>3?2:1))
  let trNew = false
  if(!tr){
    trNew=true
    tr = document.createElement("tr")
    tr.id = "challengeRow-"+(id>3?2:1)
    tr.style.cssText = "height:300px;width:300px;"
  }
  
  let td = document.createElement("td")
  td.id = "challenge-"+id
  td.innerHTML = "<b style='font-size:1.5em;color:black' id='challengeName-"+id+"'>"+chall.name+"<span id='challengeTimes-"+id+"' style='color:black'></span></b><br><button id='challengeButton-"+id+"' onclick='changeChallenge("+id+")' style='color:black'>Start</button><br>Goal: <span id='challengeGoal-"+id+"' style='color:black'></span> points<br><br>"+chall.desc+"<br><br>On first completion: "+chall.firstEffDesc+"<br><br>On every completion: "+chall.repeatEffDesc
  td.style.cssText = "height:300px;width:300px;border:2px solid grey;border-radius:5px;color:black"
  
  tr.appendChild(td)
  if(trNew)document.getElementById("challenges").appendChild(tr)
}

function startChallenge(id){
  if(!challengeData[id].reset)refactorReset(true)
  else challengeData[id].reset()
  player.challenge = id
  if(id==4){player.gemUpgs=[];player.totalGems=0;player.gems=0}
}

function changeChallenge(id){
  if(id==player.challenge){
    let cc = challengeCompletions(id)
    let canComplete = cc==challengeMax(id)?false:player.e+Math.log10(player.num+1)>=challengeData[id].goals[cc]&&player.challenge==id
    if(!canComplete)player.challenge=1
    else{player.challenges[id]++;startChallenge(1)}
  }
  else if(id!=player.challenge)startChallenge(id)
  
}

function loadChallenges(){
  if(unlocked("challenges")){
    document.getElementById("challengeTabButton").style.display = ""
    
    for(let x=1;x<7;x++){
      createChallenge(x)
    }
  }
}

function challengeCompletions(id){
  return player.challenges[id]||0
}

function inChallenge(id){
  return player.challenge==id
}

function updateChallenges(){
  if(unlocked("challenges")){
    Object.keys(player.challenges).forEach(c=>{
      c=Number(c)
      
      let cc = challengeCompletions(c)
      let done = cc==challengeMax(c)
      let canComplete = done?false:player.e+Math.log10(player.num+1)>=challengeData[c].goals[cc]&&player.challenge==c
      
      let borderColor = done?"#00ff00":(canComplete?"#aaaa00":"#ff0000")
      let backgroundColor = done?"#ccffcc":(canComplete?"#eeee00":"#ffcccc")
      
      let change = ["challengeButton-"+c,"challenge-"+c]
      change.forEach(ch=>{
        let ele = document.getElementById(ch)
        ele.style["border-color"]=borderColor
        ele.style["background-color"]=backgroundColor
        if(ch.includes("B")){
          ele.innerText = canComplete?"Complete":(player.challenge==c?"Exit":"Enter")
        }
      })
      change = ["Name","Times","Goal"]
      change.forEach(ch=>{
        document.getElementById("challenge"+ch+"-"+c).style["background-color"]=backgroundColor
      })
      document.getElementById("challengeTimes-"+c).innerText = cc!=0?" "+Math.min(cc+1,challengeMax(c)):""
      document.getElementById("challengeGoal-"+c).innerText=cc<challengeMax(c)?"1e"+challengeData[c].goals[cc]:"MAX"
      
      if(challengeData[c].unlocked){
        document.getElementById("challenge-"+c).style.display = challengeData[c].unlocked()?"":"none"
      }
    })
    
    document.getElementById("inChallenge").innerText = challengeData[player.challenge].name
  }
}

function challengeMax(id){
  if(id<5){
    return researchLvl("2x"+(id+14))+5
  }else return 5
}