function save(){
  localStorage.iinhwp = JSON.stringify(player)
}

function load(){
  if(localStorage.iinhwp)player = {...player,...JSON.parse(localStorage.iinhwp)}
}

function hardReset(skipConfirm=false){
  if(confirm("Are you sure?")||skipConfirm){
    localStorage.iinhwp=JSON.stringify(starterPlayer)
    window.location.reload()
  }
}

function exportSave(){
  navigator.clipboard.writeText(btoa(JSON.stringify(player)))
  
  alert("Exported save!")
}

function importSave(){
  let p = prompt("Input your save here. Don't put in an incorrect one or this will crash!")
  
  if(p){
    player=JSON.parse(atob(p))
    save()
    window.location.reload()
  }
}