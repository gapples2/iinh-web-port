const research = [
  // [desc,cost,type (0==beginner, 1==normal, 2==keep something on reset), if type == 1 you need maxLvls, unlockFunc if wanted]
  
  // beginner stuff
  ["+1 successor exponent.",1,0],
  ["Gain 6x more points.",1,0],
  ["+20 successor max.",1,0],
  
  // basic keep stuff on reset
  ["Refactors don't reset gems.",2,2],
  ["Gems don't reset upgrades.",2,2],
  
  //small multipliers
  ["+1x point gain.",1,1,10],
  ["+2x point gain.",5,1,3],
  
  // free upgs
  ["+3 free successors.",3,1,5],
  ["+2 free doublers.",15,1,5],
  ["+1 free tripler.",50,1,5],
  ["+1 free quadrupler.",250,1,2],
  
  // refactor stuff
  ["+1 effective refactor.",4,1,3],
  ["+1 effective refactor.",50,1,2],
  ["+2 effective refactors.",1e4,1,1],
  ["+1 refactor effect exponent.",25,1,2],
  ["+1 refactor effect exponent.",7500,1,2],
  
  // keep stuff on refactor && research
  ["Keep a level of <b>Normal</b> after studying.",10,2,5],
  ["Keep a level of <b>Upgrade Shortage</b> after studying.",25,2,5],
  ["Keep a level of <b>Speghetti Code</b> after studying.",50,2,5],
  ["Keep a level of <b>Empty Mines</b> after studying.",200,2,5],
  
  //automation
  ["Autobuy upgrades, autobuy more per level.",5,2,4],
  ["Automatically gain gems (first level) and buy gem upgrades (second level).",10,2,2],
  ["Automatically refactor.",25,2,1],
  
  //keep refactor milestones on reset
  ["Keep a refactor milestone after studying.",25,2,3],
  
  //more research
  ["Gain 10% more research.",100,1,5],
  ["Gain another 10% more research.",250,1,5],
  
  //final upg automation
  ["Automatically buy max but disable Research 2x1.",1000,2,1],
  
  // super powerful research
  ["Multiply point gain by research+1.",2000,1,5],
  ["Increase point gain exponent by 0.01.",10000,1,50],
  ["Increase the gem limit by 5.",10000,1,5],
  ["Increase refactor effect exponent by 0.1.",2500,1,100],
  ["Gain 10% more research.",5000,1,20],
  ["Gain 0.5 research/second.",2000,1,100],
  
  // final automation
  ["Unlock the study automator.",25000,2,1],
  
  //extra challenges
  ["You can beat <b>Normal</b> one more time.",2500,2,5],
  ["You can beat <b>Upgrade Shortage</b> one more time.",5000,2,5],
  ["You can beat <b>Speghetti Code</b> one more time.",10000,2,5],
  ["You can beat <b>Empty Mines</b> one more time.",25000,2,5],
  
  // more research
  ["Gain 2.5% more research for every challenge beaten.",5000,1,4],
  ["Research multipliers now effects Research 2x13 at a reduced rate (first level) and increases the exponent to the multiplier by 0.05 (every level).",10000,1,10],
  
  // row 3!
  ["So you're at row 3 now. You'll need this: add 0.1% of study gain to passive research gain.",3e5,1,5],
  ["You want challenges? We got another waiting for you.",5e5,1,1],
  ["Keep a level of the first 4 challenges.",2.5e5,1,5],
  
  //the op research (kinda)
  ["Increase research per second exponent by 0.0002.",1e5,1,1000],
  
  // new building!
  ["Unlock the Hexadecatupler.",5e5,2,1],
  
  //better upgs
  ["Upgrade boosting! First level increases the building max of each building (excluding hexadecatupler) by the amount of hexadecatuplers you have and the next makes free levels count as bought ones.",7.5e5,1,2],
  
  // more research!
  ["Gain sqrt(log10(research+1)+1)x more research per second.",1e6,1,1],
  
  // more buildings!
  ["+5 building max for every building except hexadecatupler.",4e5,1,5],
  
  // inflation
  ["I'm getting bored. 5x successor max, 4x doubler max, 3x tripler max, and 2x quadrupler max. This, my friends, is the explosion upgrade.",2e6,1,1],
  
  // even more points
  ["+10 gem max.",5e8,1,5],
  ["Refactor effect exponent +0.5.",2.5e8,1,100],
  ["Increase point gain exponent by 0.01.",1e9,1,50],
  ["Gain 5 research/sec.",5e8,1,100],
  ["Every time you study point gain is doubled.",1e11,1,10],
  ["Gain 3 study resets per second. ",2e11,1,20]
]

function createResearch(){
  research.forEach((r,num)=>{
    let type = r[2]
    let max = r[3]||1
    
    let row = Math.floor(num/20)+1
    let tr = document.getElementById("researchRow-"+row)
    if(!tr){
      tr=document.createElement("tr")
      tr.id = "researchRow-"+row
      tr.style.cssText = "width:30px;height:30px"
    }
    
    let re = document.createElement("td")
    re.id = "research"+row+"x"+(num%20+1)
    
    if(!player.researches[row+"x"+(num%20+1)])player.researches[row+"x"+(num%20+1)]=0
    
    let borderColor;
    switch(type){
      case 0:
        borderColor = "#00ff00"
        break;
      case 1:
        borderColor = "blue"
        break;
      case 2:
        borderColor = "#ff0000"
        break;
    }
    
    re.style.cssText = "border: 3px solid "+borderColor+";font-size:14px;width:30px;height:30px;color:white"
    if(type==0&&r[3]||type!=0&&r[4]){if(!(type==0&&r[3]())||(!type!=0&&r[4]()))re.style.display="none"}
    re.innerText = row+"x"+(num%20+1)
    
    re.addEventListener("mouseover",()=>{
      document.getElementById("lookingAtResearch").innerHTML = "<h4 style='color:inherit'>Research "+row+"x"+(num%20+1)+"</h4>"+r[0]+"<br><br>Cost: "+format(r[1],0)+" research<br>Level "+researchLvl(row+"x"+(num%20+1))+"/"+max
    })
    re.addEventListener("click",()=>{buyResearch(row+"x"+(num%20+1))})
    
    tr.appendChild(re)
    document.getElementById("research").appendChild(tr)
  })
}

function researchLvl(id){
  return player.researches[id]||0
}

function loadResearch(){
  if(unlocked("research")){
    document.getElementById("researchTabButton").style.display=""
    
    createResearch()
  }
}

function updateResearch(){
  research.forEach((r,num)=>{
    let id = (Math.floor(num/20)+1)+"x"+(num%20+1)
    let re = document.getElementById("research"+id)
    let lvl = researchLvl(id)
    let max = research[num][3]||1
    let color = ""
    if(lvl==max)color="#009900"
    else{
      if(lvl>=1)color="#aa00aa"
      else color = ""
    }
    
    re.style["background-color"]=color
  })
  
  document.getElementById("researchReset").style.display = Math.log10(player.num+1)+player.e>=111?"":"none"
  document.getElementById("rPSspan").style.display = researchPerSec()>0?"":"none"
  document.getElementById("researchPerSec").innerText = format(researchPerSec(),2)
  document.getElementById("autostudyDIV").style.display = researchLvl("2x14")?"":"none"
  document.getElementById("researchBuy").innerText = player.researchBuy?"max":"1"
}

function researchReset(forced=false){
  if(Math.log10(player.num+1)+player.e>=111||forced){
    if(!forced){
      player.researchResets++
      player.research+=researchGain()
    }
    
    player.totalrp=0
    player.rp=0
    player.rpMilestones=[]
    for(let x=0;x<researchLvl("2x4");x++){
      player.rpMilestones.push(x)
    }
    for(let x=1;x<5;x++){
      player.challenges[x]=Math.min(researchLvl("1x"+(x+16))+researchLvl("3x3"),challengeCompletions(x))
    }
    player.totalGems=0
    player.gems=0
    player.gemUpgs=[]
    player.num=0
    let resetarr = ["succ","doubler","tripler","quad","hex"]
    resetarr.forEach(a=>{
      if(player.upgrades[a])player.upgrades[a]=0
    })
  }
}

function researchNextAt(){
  if(researchGain()==0)return 111
  else return researchGain()*(1/researchMult())+111
}

function researchGain(down=true){
  let base = Math.floor(Math.max(((Math.log10(player.num+1)+player.e)-111)+1,0)*researchMult())
  
  if(isNaN(base))return 0
  
  if(down)return Math.floor(base)
  else return base
}

function buyResearch(id){
  let numID = id.split("x")
  numID=Number(numID[0]-1)*20-1+Number(numID[1])
  if((researchLvl(id)==(research[numID][3]||1))||(player.research<research[numID][1]))return;
  let max = Math.min(Math.floor(player.research/research[numID][1]),(research[numID][3]||1)-researchLvl(id))
  if(!player.researchBuy)max=1
  player.researches[id]+=max
  player.research-=research[numID][1]*max
}

function researchMult(){
  let mult = 1
  mult+=(researchLvl("2x5")+researchLvl("2x6"))*0.1
  mult*=researchLvl("2x12")*0.1+1
  mult*=(player.challenges[1]+player.challenges[2]+player.challenges[3]+player.challenges[4])*0.025*researchLvl("2x19")+1
  
  return mult
}

function researchPerSec(){
  let base = researchLvl("2x13")*0.5+researchLvl("3x13")*5
  base+=researchLvl("3x1")*researchGain()*0.0002
  if(researchLvl("2x20"))base*=researchMult()**(0.5+researchLvl("2x20")*0.05)
  base=base**(researchLvl("3x4")*0.001+1)
  if(researchLvl("3x7")==1)base*=Math.sqrt(Math.log10(player.research+1)+1)
  
  return base
}