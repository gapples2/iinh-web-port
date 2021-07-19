var upgIds = []
var upgData = {}

function createUpgrade(id,data,displayName){
  if(!displayName)displayName=id.charAt(0).toUpperCase()+id.slice(1)
  if(!player.upgrades[id])player.upgrades[id] = 0
  
  upgIds.push(id)
  upgData[id]=data
  
  let upgDiv = document.createElement("div")
  upgDiv.id = "upgDiv-"+id
  upgDiv.base = data[0]
  upgDiv.scaling = data[1]
  upgDiv.innerHTML = displayName+": <span id='upgAmt-"+id+"'></span><br>"
  
  let upgButton = document.createElement("button")
  upgButton.innerHTML = ("Buy a "+(displayName.endsWith("s")?displayName.slice(0,-1):displayName)+" for <span id='upgCost-"+id+"'></span> points")
  upgButton.onclick = function(){buyUpg(id)}
  
  upgDiv.appendChild(upgButton)
  document.getElementById("upgrades").appendChild(upgDiv)
  document.getElementById("upgrades").appendChild(document.createElement("br"))
}

function removeUpgrade(id){
  player.upgrades[id] = 0
  
  document.getElementById("upgDiv-"+id).remove()
}

function loadUpgrades(){
  createUpgrade("succ",[1,2],"Successors")
  if(unlocked("doubler"))createUpgrade("doubler",[Math.log10(200),4],"Doubler")
  if(unlocked("tripler"))createUpgrade("tripler",[Math.log10(5000),10],"Tripler")
  if(unlocked("quad"))createUpgrade("quad",[8,100],"Quadrupler")
  if(unlocked("hex"))createUpgrade("hex",[512,1e25],"Hexadecatupler")
}

function upgCost(id){
  if(player.upgrades[id]>=upgLimit(id))return Infinity //everything should be fixed
  
  let base = upgData[id][0]
  let scaling = upgData[id][1]
  
  let cost = Math.log10(scaling)*player.upgrades[id]
  
  return 10**(base+cost-player.e)
}

function displayUpgCost(id){
  if(player.upgrades[id]>=upgLimit(id))return "MAX"
  
  let base = upgData[id][0]
  let scaling = upgData[id][1]
  
  let cost = Math.log10(scaling)*player.upgrades[id]+base
  cost = format(10**(cost%1),0,Math.floor(cost))
  
  return cost
}

function buyUpg(id){
  if(player.num>=upgCost(id)&&upgCost(id)!=Infinity){
    player.num-=upgCost(id)
    if(id!="succ"){
      player.num/={doubler:2,tripler:3,quad:4,hex:16}[id]
    }
    player.upgrades[id]++
  }
}

function updateUpgrades(){
  upgIds.forEach(id=>{
    document.getElementById("upgCost-"+id).innerText = displayUpgCost(id)
    document.getElementById("upgAmt-"+id).innerText = format(player.upgrades[id],0)+(freeUpgs(id)>0?" + "+freeUpgs(id):"")
  })
}

function upgLimit(id){
  return {
    succ(){
      let amt = 15
      if(hasGemUpg(1))amt++
      if(hasGemUpg(5))amt+=player.gemUpgs.length*3
      if(hasRefactorMilestone(0))amt+=player.rpMilestones.length
      amt*=challengeCompletions(1)+1
      if(inChallenge(2)||inChallenge(5))amt-=4
      amt+=challengeCompletions(2)
      if(researchLvl("1x3")==1)amt+=20
      amt+=5*researchLvl("3x8")
      if(researchLvl("3x9"))amt*=5
      
      return amt
    },
    doubler(){
      let amt = 15
      if(hasGemUpg(1))amt++
      if(hasGemUpg(7))amt+=player.upgrades.quad+player.upgrades.tripler+(researchLvl("3x6")==2?freeUpgs("tripler")+freeUpgs("quad"):0)
      if(hasRefactorMilestone(0))amt+=player.rpMilestones.length
      if(inChallenge(2)||inChallenge(5))amt-=4
      amt+=challengeCompletions(2)
      amt+=5*researchLvl("3x8")
      if(researchLvl("3x9"))amt*=4
      
      return amt
    },
    tripler(){
      let amt = 10
      if(hasGemUpg(1))amt++
      if(hasRefactorMilestone(0))amt+=player.rpMilestones.length
      if(challengeCompletions(1)>=1)amt+=player.totalrp
      if(inChallenge(2)||inChallenge(5))amt-=4
      amt+=challengeCompletions(2)
      amt+=5*researchLvl("3x8")
      if(researchLvl("3x9"))amt*=3
      
      return amt
    },
    quad(){
      let amt = 4
      if(hasGemUpg(1))amt++
      if(hasRefactorMilestone(0))amt+=player.rpMilestones.length
      if(inChallenge(2)||inChallenge(5))amt-=4
      amt+=challengeCompletions(2)
      if(challengeCompletions(5))amt+=5
      amt+=5*researchLvl("3x8")
      if(researchLvl("3x9"))amt*=2
      
      return amt
    },
    hex(){
      let amt = 5
      
      return amt
    }
  }[id]()
}

function freeUpgs(id){
  return {
    succ(){
      let amt = 0
      amt+=researchLvl("1x8")*3
      
      return amt
    },
    doubler(){
      let amt = 0
      amt+=researchLvl("1x9")*2
      
      return amt
    },
    tripler(){
      let amt = 0
      amt+=researchLvl("1x10")
      
      return amt
    },
    quad(){
      let amt = 0
      amt+=researchLvl("1x11")
      
      return amt
    },
    hex(){
      let amt = 0
      
      return amt
    },
  }[id]()
}

function buyMax(){
  let ids = Object.keys(player.upgrades)
  for(let x=0;x<ids.length;x++){
    let id = ids[ids.length-1-x]
    if(id=="hex")continue;
    
    while(player.num>=upgCost(id)&&upgCost(id)!=Infinity){
      buyUpg(id)
    }
  }
}