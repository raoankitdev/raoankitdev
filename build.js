const fs = require('fs');

async function updateWeather() {
  try {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) throw new Error("WEATHER_API_KEY is missing in GitHub Secrets!");

    const city = "Delhi"; 
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    
    if (!response.ok) throw new Error(`Weather API Error: ${response.statusText}`);

    const data = await response.json();
    const temp = Math.round(data.main.temp);
    const main = data.weather[0].main;
    const icons = { Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Thunderstorm: "⚡", Snow: "❄️", Mist: "🌫️" };
    const icon = icons[main] || "☁️";

    if (!fs.existsSync('chat.template.svg')) throw new Error("chat.template.svg not found!");

    let template = fs.readFileSync('chat.template.svg', 'utf-8');
    let newSvg = template
      .replace('{{TEMP}}', temp)
      .replace('{{CONDITION}}', `${icon} ${main.toLowerCase()}`);

    fs.writeFileSync('chat.svg', newSvg);
    console.log("Success: chat.svg updated.");

  } catch (error) {
    console.error("FAILED:", error.message);
    process.exit(1); // This turns the cross RED if something is wrong
  }
}

updateWeather();
