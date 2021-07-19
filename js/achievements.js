//soon:tm:

const achs = {
  /*
  id:{
    name: "",
    desc: "",
    complete(){}
  },
  */
  0:{
    name: "Insert Achievement Name Here",
    desc: "Buy a successor.",
    complete(){return player.upgrades.succ>=1}
  },
  1:{
    name: "We've been duped!",
    desc: "Buy a doubler.",
    complete(){return unlocked("doubler")?player.upgrades.doubler>=1:false}
  },
  2:{
    name: "Clone machine",
    desc: "Buy 3 doublers.",
    complete(){return unlocked("doubler")?player.upgrades.doubler>=3:false}
  },
  3:{
    name: "Triple Threat",
    desc: "Buy a tripler.",
    complete(){return unlocked("tripler")?player.upgrades.tripler>=1:false}
  },
  4:{
    name: "27x mult",
    desc: "Buy 3 triplers.",
    complete(){return unlocked("tripler")?player.upgrades.tripler>=3:false}
  },
  5:{
    name: "2-in-one doubler special",
    desc: "Buy a quadrupler.",
    complete(){return unlocked("quad")?player.upgrades.quad>=1:false}
  },
  6:{
    name: "(hardcapped)",
    desc: "Buy 15 successors.",
    complete(){return player.upgrades.succ>=15}
  },
  7:{
    name: "Point Factory",
    desc: "Get 100 points per second.",
    complete(){return Math.log10(player.nps)+player.e>=2}
  },
  8:{
    name: "Point Company",
    desc: "Get 10,000 points per second.",
    complete(){return Math.log10(player.nps)+player.e>=4}
  },
  9:{
    name: "Point Planet",
    desc: "Get 1,000,000 points per second.",
    complete(){return Math.log10(player.nps)+player.e>=6}
  },
  10:{
    name: "Point Galaxy",
    desc: "Get 1e9 points per second.",
    complete(){return Math.log10(player.nps)+player.e>=9}
  },
  11:{
    name: "Prestigious",
    desc: "Get a gem.",
    complete(){return player.gems>=1}
  },
  12:{
    name: "Upgrade Maxer",
    desc: "Get 9 gem upgrades.",
    complete(){return player.gemUpgs.length==9}
  },
  13:{
    name: "When the production is sus",
    desc: "Get 1e30 points per second.",
    complete(){return Math.log10(player.nps)+player.e>=30}
  },
  14:{
    name: "A fresh start",
    desc: "Refactor once.",
    complete(){return player.rp>=1}
  },
  15:{
    name: "Double reset",
    desc: "Refactor twice.",
    complete(){return player.rp>=2}
  },
  16:{
    name: "This isn't a challenge....",
    desc: "Complete Normal once.",
    complete(){return challengeCompletions(1)>=1}
  },
  17:{
    name: '"In these trying times..."',
    desc: "Complete Upgrade Shortage once.",
    complete(){return challengeCompletions(2)>=1}
  },
  18:{
    name: "WORK HARDER GAPPLES",
    desc: "Complete Speghetti Code once.",
    complete(){return challengeCompletions(3)>=1}
  },
  19:{
    name: "You didn't need them anyway",
    desc: "Complete Empty Mines once.",
    complete(){return challengeCompletions(4)>=1}
  },
  20:{
    name: "Anti-challenged",
    desc: "Complete the first 4 challenges.",
    complete(){return challengeCompletions(1)>=5&&challengeCompletions(2)>=5&&challengeCompletions(3)>=5&&challengeCompletions(4)>=5}
  },
  21:{
    name: "For science!",
    desc: "Study.",
    complete(){return player.research>=1}
  },
  22:{
    name: "Finally, obamium",
    desc: "Study 10 times.",
    complete(){return player.researchResets>=10}
  },
  23:{
    name: "Production so you don't have to",
    desc: "Unlock automation.",
    complete(){return researchLvl("2x1")==1||researchLvl("2x2")==1||researchLvl("2x3")==1}
  },
  24:{
    name: "Plentiful research",
    desc: "Max the first row of research.",
    complete(){return researchLvl("1x14")==1&&researchLvl("1x16")==2}
  },
  25:{
    name: "Wait, that's illegal!",
    desc: "Get 10 completions in a challenge.",
    complete(){return challengeCompletions(1)==10||challengeCompletions(2)==10||challengeCompletions(3)==10||challengeCompletions(4)==10}
  },
  26:{
    name: "Fully automated",
    desc: "Max the second row of research.",
    complete(){return researchLvl("2x9")==50&&researchLvl("2x11")==100&&researchLvl("2x13")==100}
  },
  27:{
    name: "Sadistic",
    desc: "Complete Horrible Gameplay once.",
    complete(){return challengeCompletions(5)>=1}
  },
  28:{
    name: "Still Alive",
    desc: "Max the third row of research.",
    complete(){return researchLvl("3x15")==20}
  }
}

function createAch(id){
  let num = Math.ceil(Math.sqrt(Object.keys(achs).length))
  let row = Math.floor(id/num)
  
  let tr = document.getElementById("achRow-"+row)
  if(!tr){
    tr = document.createElement("tr")
    tr.id = "achRow-"+row
    
    document.getElementById("achs").appendChild(tr)
  }
  
  let ach = document.createElement("td")
  ach.id = "ach-"+id
  ach.innerHTML = "<h3 style='margin:0px;background-color:inherit;color:black'>"+achs[id].name+"</h3><br>"+achs[id].desc
  ach.style = "height:154px;min-width:154px;border: 2px solid;display:none;color:black"
  
  tr.appendChild(ach)
}

function unlockedAch(id){
  return id<2||player.achs.includes(id-1)||player.achs.includes(id-2)
}

function updateAchs(){
  let num = Math.ceil(Math.sqrt(Object.keys(achs).length))
  for(let x=0;x<num;x++){
    for(let y=0;y<num;y++){
      let id = x*num+y
      if(!achs[id])continue;
      let ach = document.getElementById("ach-"+id)
      let ac = player.achs.includes(id)
      ach.style["border-color"]=ac?"#00ff00":"#ff0000"
      ach.style["background-color"]=ac?"#ccffcc":"#ffcccc"
      ach.style.display=unlockedAch(id)?"":"none"
      if(!ac&&achs[id].complete()&&unlockedAch(id))player.achs.push(id)
    }
  }
}

function loadAchs(){
  let num = Math.ceil(Math.sqrt(Object.keys(achs).length))
  for(let x=0;x<num;x++){
    for(let y=0;y<num;y++){
      if(!achs[x*num+y])continue;
      createAch(x*num+y)
    }
  }
}