const fs = require('fs');

async function updateWeather() {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = "Delhi"; 
  
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    
    const temp = Math.round(data.main.temp);
    const main = data.weather[0].main;
    const icons = { Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Thunderstorm: "⚡", Snow: "❄️", Mist: "🌫️" };
    const icon = icons[main] || "☁️";

    // Debug: Check if template exists
    if (!fs.existsSync('chat.template.svg')) {
      throw new Error("Template file not found!");
    }

    let template = fs.readFileSync('chat.template.svg', 'utf-8');
    let newSvg = template
      .replace('{{TEMP}}', temp)
      .replace('{{CONDITION}}', `${icon} ${main.toLowerCase()}`);

    fs.writeFileSync('chat.svg', newSvg);
    console.log("Success: chat.svg updated.");
  } catch (error) {
    console.error("Script Failed:", error);
    process.exit(1);
  }
}

updateWeather();
