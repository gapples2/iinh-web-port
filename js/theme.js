const themes = {
  "Light":{
    color: "#000000",
    bgColor: "#ffffff"
  },
  "Dark":{
    bgColor: "#000000",
    color: "#ffffff"
  },
  "Cancer":{
    bgColor: "#00ff00",
    color: "#ff0000"
  }
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