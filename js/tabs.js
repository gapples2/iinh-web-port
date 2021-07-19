function changeTab(tab){
  document.getElementById("tab"+player.tab).style.display="none"
  document.getElementById("tab"+tab).style.display="block"
  
  player.tab=tab
}