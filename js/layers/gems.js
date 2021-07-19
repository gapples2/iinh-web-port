var gemUpgRowsBought = []

function gemCost(){
  if(player.totalGems<(challengeCompletions(4)>=1?25:10)+researchLvl("2x10")*5+challengeCompletions(5)*5+researchLvl("3x10")*10){return 15+(player.totalGems*0.2)*player.totalGems-challengeCompletions(4)*(Math.log10(250))}
  else{return Infinity}
}

function gemReset(forced=false){
  if(Math.log10(player.num+1)+player.e>=gemCost()||forced){
    player.num=0
    let resetarr = ["succ","doubler","tripler","quad","hex"]
    if(researchLvl("1x5")==1)resetarr=["hex"]
    resetarr.forEach(a=>{
      if(player.upgrades[a])player.upgrades[a]=0
    })
    
    if(!forced){
      player.gems++
      player.totalGems++
    }
  }
}

const gemUpgData = {
  0:{
    desc: "Triple point gain.",
    cost: 1
  },
  1:{
    desc: "You can buy 1 more of each upgrade.",
    cost: 1
  },
  2:{
    desc: "Double point gain per gem upgrade bought.",
    cost: 1
  },
  3:{
    desc: "Square successor power.",
    cost: 1
  },
  4:{
    desc: "+1x point gain per upgrade bought.",
    cost: 1
  },
  5:{
    desc: "+3 successor max per gem upgrade bought.",
    cost: 1
  },
  6:{
    desc: "Double point gain per gem upgrade bought (again).",
    cost: 1
  },
  7:{
    desc: "+1 doubler max per quadrupler/tripler bought.",
    cost: 1
  },
  8:{
    desc: "Double point gain per gem reset.",
    cost: 2
  }
}

function hasGemUpg(id){
  return player.gemUpgs.includes(id)
}

function unlockedGemUpg(id){
  return (id>=2?hasGemUpg(id-2)&&gemUpgData[id]:true)&&!inChallenge(4)&&!inChallenge(5)
}

function buyGemUpg(id){
  let data = gemUpgData[id]
  if(player.gems>=data.cost&&!hasGemUpg(id)){
    player.gems-=data.cost
    player.gemUpgs.push(id)
  }
}

function loadGems(){
  if(unlocked("gems")){
    document.getElementById("gems").style.display="block"
    
    let num = Math.ceil(Math.sqrt(Object.keys(gemUpgData).length))
    for(let x=0;x<num;x++){  
      for(let y=0;y<num;y++){             
        createGemUpg(x*num+y)
      }
    }
  }
}

function updateGems(){
  document.getElementById("gemReset").style.display=player.e+Math.log10(player.num+1)>=gemCost()?"block":"none"
  
  let num = Math.ceil(Math.sqrt(Object.keys(gemUpgData).length))
  for(let x=0;x<num;x++){  
    for(let y=0;y<num;y++){
      let upg = document.getElementById("gemUpgButton-"+(x*num+y))
      let id = x*num+y
      upg.style.display=(unlockedGemUpg(id)?"block":"none")
      upg.style["border-color"]=(hasGemUpg(id)?"green":(player.gems>=gemUpgData[id].cost?"#bbbb00":"red"))
    }
  }
}

function createGemUpg(id){
  let num = Math.ceil(Math.sqrt(Object.keys(gemUpgData).length))
  
  let tr = document.getElementById("gemUpgTR-"+Math.floor(id/num))
  if(!tr){
    tr = document.createElement("tr")
    tr.id = "gemUpgTR-"+Math.floor(id/num)
  }
  
  let td = document.createElement("td")
  td.id = "gemUpgTD-"+id
  
  let button = document.createElement("button")
  button.id = "gemUpgButton-"+id
  button.onclick = function(){buyGemUpg(id)}
  button.innerHTML = gemUpgData[id].desc+"<br><br>"+gemUpgData[id].cost+" gem"+(gemUpgData[id].cost==1?"":"s")
  let css = "height:100px;width:150px;border: 2px solid "
  if(hasGemUpg(id))css+="green"
  else css+="red"
  button.style.cssText = css+(!unlockedGemUpg(id)?";display:none":"")
  
  tr.appendChild(td)
  td.appendChild(button)
  document.getElementById("gemUpgs").appendChild(tr)
}

function respecGemUpgs(){
  if(!confirm("Are you sure? This will do a gem reset."))return;
  player.gems=player.totalGems
  player.gemUpgs=[]
  gemReset(true)
}