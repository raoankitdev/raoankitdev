const fs = require('fs');

async function updateWeather() {
  // 1. Get Secrets
  const apiKey = process.env.WEATHER_API_KEY;
  const city = "Delhi"; 
  
  try {
    // 2. Fetch Data
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    
    // 3. Process Data
    const temp = Math.round(data.main.temp);
    const main = data.weather[0].main;

    // 4. Emoji Map (Matches Jason's style)
    const icons = {
      Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Thunderstorm: "⚡", 
      Drizzle: "🌦️", Snow: "❄️", Mist: "🌫️", Smoke: "🌫️", Haze: "🌫️"
    };
    const icon = icons[main] || "☁️";

    // 5. Read & Replace
    let template = fs.readFileSync('chat.template.svg', 'utf-8');
    
    let newSvg = template
      .replace('{{TEMP}}', temp)
      .replace('{{CONDITION}}', `${icon} ${main.toLowerCase()}`);

    // 6. Save File
    fs.writeFileSync('chat.svg', newSvg);
    console.log("Weather updated successfully.");

  } catch (error) {
    console.error("Failed to update weather:", error);
    process.exit(1);
  }
}

updateWeather();
