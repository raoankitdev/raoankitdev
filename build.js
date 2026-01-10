const fs = require('fs');
const fetch = require('node-fetch');

async function updateWeather() {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = "YourCityName"; // Change this to your city
  
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
  const data = await response.json();
  const temp = Math.round(data.main.temp);

  let template = fs.readFileSync('chat.template.svg', 'utf-8');
  let newSvg = template.replace('{{TEMP}}', temp);

  fs.writeFileSync('chat.svg', newSvg);
}

updateWeather();
