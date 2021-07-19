const version = 0.1

const starterPlayer = {
  num: 0,
  e: 0,
  nps: 0,
  
  gems: 0,
  totalGems: 0,
  
  rp: 0,
  totalrp: 0,
  
  challenge: 1,
  challenges: {},
  
  research: 0,
  researchBuy: 0,
  researchResets: 0,
  researches: {},
  autostudy: 0,
  
  upgrades: {},
  gemUpgs: [],
  
  rpMilestones: [],
  
  timeAtLastTick: Date.now(),
  tab: 0,
  theme: "Light",
  version: 0.1,
  won: false,
  verWon: 0,
  
  unlocks: [],
  achs: [],
}

var timespeed = 1

function unlocked(id){
  return player.unlocks.includes(id)
}

var player = starterPlayer

function displaynps(){
  if(Math.floor(player.e)<30000)return "+"+format(player.nps*10**(player.e%1),0,Math.floor(player.e))+" points/sec"
  else return "+"+format(Math.log10(2)*researchLvl("3x14")*researchLvl("3x15")*3,0)+" OoMs/sec (from research 3x14 and 3x15)"
}

function updateMain(){
  let vars = [
    ["num",player.num*10**(player.e%1),0,Math.floor(player.e)],
    ["gemAmt",player.gems],
    ["gemNextAt",10**(gemCost()%1),0,Math.floor(gemCost())],
    ["rp",player.totalrp],
    ["rpNextAt",10**(refactorCost()%1),0,Math.floor(refactorCost())],
    ["rpEff",10**(refactorEff()%1),0,Math.floor(refactorEff())],
    ["researchAmt",player.research,0],
    ["researchNextAt",10**(researchNextAt()%1),0,Math.floor(researchNextAt())],
    ["researchGain",researchGain(),0],
    ["currentautostudy",player.autostudy,0],
    ["totalachs",Object.keys(achs).length,0],
    ["achsEarned",player.achs.length,0]
  ]
  
  vars.forEach(v=>{
    document.getElementById(v[0]).innerText = format(v[1],v[2],v[3])
  })
  
  document.getElementById("buyMax").style.display=hasRefactorMilestone(1)?"":"none"
  document.getElementById("currentTheme").innerText=player.theme
  document.getElementById("nps").innerText = displaynps()
  
  if(!player.won&&player.totalrp>=15){
    player.won=true
    player.verWon=player.version
    
    document.getElementById("game").style.display="none"
    document.getElementById("win").style.display=""
  }
}

function loop(){
  mainLoop(((Date.now()-player.timeAtLastTick)/1000)*timespeed)
  player.timeAtLastTick = Date.now()
  
  update()
  unlocks()
}

function unlocks(){
  let unlockReqs = [
    ["doubler",function(){return player.nps>=5},function(){createUpgrade("doubler",[Math.log10(200),4],"Doubler")}],
    ["tripler",function(){return player.upgrades.doubler>=3},function(){createUpgrade("tripler",[Math.log10(5000),10],"Tripler")}],
    ["quad",function(){return player.upgrades.doubler>=10},function(){createUpgrade("quad",[8,100],"Quadrupler")}],
    ["gems",function(){return player.upgrades.tripler>=10},function(){loadGems()}],
    ["refactor",function(){return player.e+Math.log10(player.num)>=35},function(){loadRefactor()}],
    ["challenges",function(){return hasRefactorMilestone(2)},function(){loadChallenges()}],
    ["research",function(){return player.challenges[1]==5&&player.challenges[2]==5&&player.challenges[3]==5&&player.challenges[4]==5},function(){loadResearch()}],
    ["hex",function(){return researchLvl("3x5")==1},function(){createUpgrade("hex",[512,1e25],"Hexadecatupler")}],
  ]
  
  for(let x=0;x<unlockReqs.length;x++){
    let req = unlockReqs[x]
    if(unlocked(req[0]))continue;
    if(req[1]()){
      player.unlocks.push(req[0])
      if(req[2])req[2]()
    }
  }
}

function mainLoop(diff){
  player.nps=nps()
  player.e=e()
  player.num+=player.nps*diff
  player.research+=researchPerSec()*diff
  player.researchResets+=researchLvl("3x15")*diff*3
  
  if(researchLvl("2x1")>=1&&!researchLvl("2x7")){
    for(let x=0;x<researchLvl("2x1");x++){
      buyUpg(["succ","doubler","tripler","quad"][x])
    }
  }
  if(researchLvl("2x7"))buyMax()
  if(researchLvl("2x2")>=1)gemReset()
  if(researchLvl("2x2")==2&&!inChallenge(4)&&player.gemUpgs.length!=9&&!inChallenge(5)){
    for(let x=0;x<9;x++){
      buyGemUpg(x)
    }
  }
  if(researchLvl("2x3")==1)refactorReset()
  if(player.autostudy>0){
    if(researchGain()>=player.autostudy)researchReset()
  }
}

function nps(){
  let base = 1
  base+=(player.upgrades.succ+freeUpgs("succ"))**((hasGemUpg(3)?2:1)+(researchLvl("1x1")==1?1:0))
  
  let mult = 1
  if(hasGemUpg(0))mult*=3
  if(hasGemUpg(4))mult*=8
  if(hasGemUpg(6))mult*=player.upgrades.succ+player.upgrades.doubler+player.upgrades.tripler+player.upgrades.quad+1
  
  let gain = base*mult
  
  return gain
}

function e(){
  let e = 0
  
  if(unlocked("doubler"))e+=(player.upgrades.doubler+freeUpgs("doubler"))*Math.log10(2)
  if(unlocked("tripler"))e+=(player.upgrades.tripler+freeUpgs("tripler"))*Math.log10(3)
  if(unlocked("quad"))e+=(player.upgrades.quad+freeUpgs("quad"))*Math.log10(4)
  if(hasGemUpg(2))e+=player.gemUpgs.length*Math.log10(2)
  if(hasGemUpg(6))e+=player.gemUpgs.length*Math.log10(2)
  if(hasGemUpg(8)||inChallenge(4)||inChallenge(5))e+=player.totalGems*Math.log10(2)
  e+=player.gems*Math.log(challengeCompletions(4)+1)
  if(inChallenge(3)||inChallenge(5))e+=2
  if(researchLvl("1x2")==1)e+=Math.log10(6)
  if(unlocked("refactor")&&!inChallenge(3)&&!inChallenge(5))e+=refactorEff()*(hasRefactorMilestone(2)?2:1)
  e+=Math.log10(researchLvl("1x6")+1)
  e+=Math.log10(researchLvl("1x7")*2+1)
  e+=researchLvl("2x8")*Math.log10(player.research+1)
  e*=(researchLvl("2x9")+researchLvl("3x12"))*0.01+1
  if(unlocked("hex"))e+=(player.upgrades.hex+freeUpgs("hex"))*Math.log10(16)
  e+=Math.log10(2)*researchLvl("3x14")*player.researchResets
  
  return e
}

function format(n,p=2,ex=0){ //doesn't work still //oh, it received too many requests uhh how do we fix it oh it fixed itself
  if(n==Infinity||ex==Infinity)return "MAX"
  else if(n>=1e9||(ex+Math.log10(n+1))>=9){
    let e = Math.floor(Math.log10(n+1))
    let m = n/10**e
    if(m.toFixed(2)==10){
      m=1
      e++
    }
    if(m.toFixed(2)==0){
      m=1
    }
    return m.toFixed(2)+"e"+format(e+ex)
  }
  else{
    return Number((n*10**ex).toFixed(p)).toLocaleString("en-US")
  }
}

function hotkey(key){
  switch(key){
    case "m":
      if(hasRefactorMilestone(1))buyMax()
      break;
    case "g":
      gemReset()
      break;
    case "r":
      refactorReset()
      break;
    case "1":
      buyUpg("succ")
      break;
    case "2":
      if(unlocked("doubler"))buyUpg("doubler")
      break;
    case "3":
      if(unlocked("tripler"))buyUpg("tripler")
      break;
    case "4":
      if(unlocked("quad"))buyUpg("quad")
      break;
  }
}

function updateVersion(ver){
  
}

function loadGame(){
  load()
  loadAchs()
  loadUpgrades()
  loadRefactor()
  loadGems()
  loadChallenges()
  loadResearch()
  
  if(version>player.version){
    updateVersion(player.version)
    player.version=version
  }
  
  document.getElementById("tab"+player.tab).style.display="block"
  
  setInterval(function(){loop()},20)
  setInterval(function(){save()},10000)
  
  window.addEventListener("keydown",key=>hotkey(key.key))
  
  changeTheme(player.theme)
  
  document.getElementById("loading").style.display="none"
  document.getElementById("game").style.display=""
}

loadGame()