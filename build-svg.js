const fs = require('fs');

async function updateWeather() {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = "Delhi"; 
  
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    
    const temp = Math.round(data.main.temp);
    const main = data.weather[0].main;

    // Authentic Jason Long Emojis
    const icons = {
      Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Thunderstorm: "⚡", 
      Drizzle: "🌦️", Snow: "❄️", Mist: "🌫️", Smoke: "🌫️", Haze: "🌫️"
    };
    const icon = icons[main] || "☁️";

    let template = fs.readFileSync('chat.template.svg', 'utf-8');
    
    // Replace the placeholders
    let newSvg = template
      .replace('{{TEMP}}', temp)
      .replace('{{CONDITION}}', `${icon} ${main.toLowerCase()}`);

    fs.writeFileSync('chat.svg', newSvg);
    console.log("Success: chat.svg created.");

  } catch (error) {
    console.error("Failed:", error);
    process.exit(1);
  }
}

updateWeather();
