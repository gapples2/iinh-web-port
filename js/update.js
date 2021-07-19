function update(){
  updateMain()
  updateAchs()
  
  updateUpgrades()
  if(unlocked("gems"))updateGems()
  if(unlocked("refactor"))updateRefactor()
  if(unlocked("challenges"))updateChallenges()
  if(unlocked("research"))updateResearch()
}