const themes = {
  "Light":{
    color: "#000000",
    bgColor: "#ffffff",
    gemTxtColor: "#0000ff",
    refTxtColor: "#ff00ff",
  },
  "Dark":{
    bgColor: "#000000",
    color: "#ffffff",
    gemTxtColor: "#00ccff",
    refTxtColor: "#ffccff",
  },
}

function changeTheme(theme){
  player.theme = theme
  let changes = Object.keys(themes[theme])
  changes.forEach(c=>{
    setCSSvar(c,themes[theme][c])
  })
}

function changeThemeButton(){
  if(Object.keys(themes).indexOf(player.theme)+1==Object.keys(themes).length)changeTheme("Light")
  else changeTheme(Object.keys(themes)[Object.keys(themes).indexOf(player.theme)+1])
}