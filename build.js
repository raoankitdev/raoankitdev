const fs = require('fs');

async function updateWeather() {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = "Delhi"; 
  
  try {
    // 1. Fetch Weather
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    if (!response.ok) throw new Error("Weather API failed");
    
    const data = await response.json();
    const temp = Math.round(data.main.temp);
    const main = data.weather[0].main;
    const icons = { Clear: "☀️", Clouds: "☁️", Rain: "🌧️", Thunderstorm: "⚡", Snow: "❄️", Mist: "🌫️" };
    const icon = icons[main] || "☁️";

    // 2. Calculate Greeting (IST Time)
    const date = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour: 'numeric', hour12: false };
    const hour = parseInt(date.toLocaleString('en-US', options));
    
    let greeting = "Have a good night! 🌙";
    if (hour >= 5 && hour < 12) greeting = "Have a good morning! ☀️";
    else if (hour >= 12 && hour < 17) greeting = "Have a good afternoon! 🌤️";
    else if (hour >= 17 && hour < 21) greeting = "Have a good evening! 🌇";

    // 3. Embed Image (With Safety Check)
    let imageBase64 = "";
    if (fs.existsSync('project.jpg')) {
      const stats = fs.statSync('project.jpg');
      // If image is > 500KB, it might break the SVG. Warn the user.
      if (stats.size > 500000) { 
        console.warn("WARNING: project.jpg is too big! It might not load.");
      }
      const imgBuffer = fs.readFileSync('project.jpg');
      imageBase64 = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;
      console.log("Image found and embedded.");
    } else {
      console.warn("WARNING: project.jpg not found. Image bubble will be blank.");
    }

    // 4. Update File
    if (!fs.existsSync('chat.template.svg')) throw new Error("Template not found");
    
    let template = fs.readFileSync('chat.template.svg', 'utf-8');
    let newSvg = template
      .replace('{{TEMP}}', temp)
      .replace('{{CONDITION}}', `${icon} ${main.toLowerCase()}`)
      .replace('{{GREETING}}', greeting)
      .replace('{{PROJECT_IMG}}', imageBase64);

    fs.writeFileSync('chat.svg', newSvg);
    console.log("Success: chat.svg updated.");

  } catch (error) {
    console.error("Failed:", error);
    process.exit(1);
  }
}

updateWeather();
