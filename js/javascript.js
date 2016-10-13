// elements in the page
var goBtn = document.getElementById("goBtn");
var out = document.getElementById("outputbox");
var convertBtn = document.getElementById("convertbtn");

document.getElementById('pkmnInput').onkeypress = function(e)
{
    if (!e)
      e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13')
      getinfo();
}

goBtn.onclick = getinfo; // click go button to get pokemon info
convertBtn.onclick = convertunits;

var units = 1; // 1 = metric (default), 2 = imperial
var validpkmnloaded = false;
var pkmn = null; // make an empty pkmn variable for when json is loaded


// get the info of the pokemon and write info to the output box
function getinfo()
{
  // get pokemon name and turn it into the correct url
  var pkmnname = document.getElementById("pkmnInput").value.toLowerCase();
  var urlstring = "http://pokeapi.co/api/v2/pokemon/" + pkmnname;
  
  // make http request and store the json text
  var request = new XMLHttpRequest();
  request.onreadystatechange = function()
  {
    // log ready state in console
    console.log("ready state = " + this.readyState);
    
    // change text of box so user knows that info is loading
    if (this.readyState == 1)
    {
      validpkmnloaded = false;
      out.innerHTML = "Please Wait. Pokemon info is loading."
    }
    else if (this.readyState == 4)
    {
      if (this.status == 200)
      {
        // valid pokemon loaded for proper button function
        validpkmnloaded = true;
        
        // parse the json into an object
        pkmn = JSON.parse(request.responseText);
        
        // put pokemon info into the box
        out.innerHTML =
          "<center><img src=\"http://www.smogon.com/dex/media/sprites/xy/" + pkmn.name + ".gif\"></center><br />"
          + "<h3><center>" + pkmn.name.capitalizeFirstLetter() + "</center></h3><br />"
          + "Height: " + (pkmn.height / 10.0) + "m<br />"
          + "Weight: " + (pkmn.weight / 10.0) + "kg<br />";
      
        outputtypes();
        
        // reset to defaults so button works properly
        units = 1;
        convertBtn.innerHTML = "Convert to Imperial";
      }
      else if (this.status == 404)
      {
        // 404 pokemon not found by pokeapi
        validpkmnloaded = false;
        out.innerHTML = "404 Not Found: PokeAPI cannot find that Pokemon."
      }
    }
  };
  
  // send a GET request to pokeapi
  request.open("GET", urlstring, true);
  request.send();
}


// convert between metric (Default pokemon units) and imperial units
function convertunits()
{
  //switch between units
  units = (units == 1) ? 2 : 1;
  
  // if valid pokemon is loaded, convert between units
  if (validpkmnloaded)
  {
    if (units == 1)
    {
      // metric
      out.innerHTML =
        "<center><img src=\"http://www.smogon.com/dex/media/sprites/xy/" + pkmn.name + ".gif\"></center><br />"
        + "<h3><center>" + pkmn.name.capitalizeFirstLetter() + "</center></h3><br />"
        + "Height: " + (pkmn.height / 10.0) + "m<br />"
        + "Weight: " + (pkmn.weight / 10.0) + "kg<br />";
      
      outputtypes();
      
      // change button text
      convertBtn.innerHTML = "Convert to Imperial";
    }
    else
    {
      // imperial
      out.innerHTML =
        "<center><img src=\"http://www.smogon.com/dex/media/sprites/xy/" + pkmn.name + ".gif\"></center><br />"
        + "<h3><center>" + pkmn.name.capitalizeFirstLetter() + "</center></h3><br />"
        + "Height: " + Math.round(pkmn.height / 10.0 * 3.28 * 100) / 100 + "ft<br />"
        + "Weight: " + Math.round(pkmn.weight / 10.0 * 2.20 * 100) / 100 + "lbs<br />";
      
      outputtypes();
      
      // change button text
      convertBtn.innerHTML = "Convert to Metric";
    }
  }
}


// write types and abilities to the output box
function outputtypes()
{
  // output types
  if (pkmn.types.length > 1)
    out.innerHTML += "Types: " + pkmn.types[0].type.name.capitalizeFirstLetter() + ", " + pkmn.types[1].type.name.capitalizeFirstLetter() + "<br />";
  else
    out.innerHTML += "Type: " + pkmn.types[0].type.name.capitalizeFirstLetter() + "<br />";
  
  // output abilities
  if (pkmn.abilities.length > 1)
  {
    out.innerHTML += "Possible Abilities: " + pkmn.abilities[0].ability.name.capitalizeFirstLetter();
    for (i = 1; i < pkmn.abilities.length; i++)
      out.innerHTML += ", " + pkmn.abilities[i].ability.name.capitalizeFirstLetter();
  }
  else
    out.innerHTML += "Ability: " + pkmn.abilities[0].ability.name.capitalizeFirstLetter();
}


String.prototype.capitalizeFirstLetter = function()
{
  return this.charAt(0).toUpperCase() + this.slice(1);
}