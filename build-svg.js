const fs = require('fs');

async function updateWeather() {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = "Delhi"; 
  
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    
    const temp = Math.round(data.main.temp);
    const mainCondition = data.weather[0].main;

    const emojiMap = { Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Thunderstorm: "⚡", Mist: "🌫️", Smoke: "🌫️", Haze: "🌫️" };
    const emoji = emojiMap[mainCondition] || "☁️";

    let template = fs.readFileSync('chat.template.svg', 'utf-8');
    let newSvg = template
      .replace('{{TEMP}}', temp)
      .replace('{{CONDITION}}', `${emoji} ${mainCondition.toLowerCase()}`);

    fs.writeFileSync('chat.svg', newSvg);
    console.log("SVG Updated.");
  } catch (err) { console.error(err); }
}
updateWeather();
