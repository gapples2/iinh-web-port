function refactorCost(){
  return 35+player.totalrp**(player.totalrp*0.3)-(player.totalrp==0?1:0)
}

function refactorReset(forced=false){
  if(Math.log10(player.num+1)+player.e>=refactorCost()||forced){
    if(!(researchLvl("1x4")==1)){
      player.totalGems=0
      player.gems=0
      player.gemUpgs=[]
    }
    player.num=0
    let resetarr = ["succ","doubler","tripler","quad","hex"]
    resetarr.forEach(a=>{
      if(player.upgrades[a])player.upgrades[a]=0
    })
    
    if(!forced){
      player.rp++
      player.totalrp++
    }
  }
}

function refactorEff(){
  //let base = ((player.totalrp+1)**2)**(challengeCompletions(4)+1)
  let base = Math.log10(player.totalrp+1+researchLvl("1x12")+researchLvl("1x13")+researchLvl("1x14"))*2*(challengeCompletions(4)+1+researchLvl("1x15")+researchLvl("1x16")+researchLvl("2x11")*0.1+researchLvl("3x11")*0.5)
  
  return base
}

function loadRefactor(){
  if(unlocked("refactor")){
    document.getElementById("refactorTabButton").style.display=""
    
    Object.keys(refactorMilestoneData).forEach(m=>{
      createRefactorMilestone(m)
    })
  }
}

function updateRefactor(){
  document.getElementById("refactorReset").style.display = (player.e+Math.log10(player.num+1)>=refactorCost()?"block":"none")
  
  Object.keys(refactorMilestoneData).forEach(m=>{
    m=Number(m)
    let td = document.getElementById("refactorMilestone-"+m)
    let has = hasRefactorMilestone(m)
    td.style.borderColor = has?"#00ff00":"#ff0000"
    td.style["background-color"] = has?"#ccffcc":"#ffcccc"
    td.style.display = unlockedRefactorMilestone(m)?"":"none"
    
    document.getElementById("refactorMilestoneH3-"+m).style["background-color"] = has?"#ccffcc":"#ffcccc"
    
    if(!has&&player.totalrp>=refactorMilestoneData[m].req)player.rpMilestones.push(m)
  })
}

const refactorMilestoneData = {
  0:{
    reqDesc: "1 Refactor",
    effDesc: "You can buy one more of each upgrade per refactor milestone earned.",
    req: 1
  },
  1:{
    reqDesc: "2 Refactors",
    effDesc: "Unlock buy max (M).",
    req: 2
  },
  2:{
    reqDesc: "5 Refactors",
    effDesc: "Unlock 4 challenges and square the refactor effect.",
    req: 5
  },
  3:{
    reqDesc: "10 Refactors",
    effDesc: "You get nothing. This used to be a placeholder, but then there was research....",
    req: 10
  }
}

function hasRefactorMilestone(id){
  return player.rpMilestones.includes(id)
}

function unlockedRefactorMilestone(id){
  return id!=0?hasRefactorMilestone(id-1):true
}

function createRefactorMilestone(id){
  let m = refactorMilestoneData[id]
  if(!m)return console.error("Milestone "+id+" does not exist.")

  let tr = document.createElement("tr")
  tr.id = "refactorMilestoneTR-"+id
  
  let td = document.createElement("td")
  td.id = "refactorMilestone-"+id
  td.innerHTML = "<h3 style='margin:0px;color:black' id='refactorMilestoneH3-"+id+"'>"+m.reqDesc+"</h3><br>"+m.effDesc
  let borderColor = hasRefactorMilestone(id)?"#00ff00":"#ff0000"
  td.style.cssText = "height:94px;width:75%;border: 2px solid black;padding-left:5px;padding-right:5px;display:none;border-radius: 5px;color:black"
  
  tr.appendChild(td)
  document.getElementById("reMilestones").appendChild(tr)
}