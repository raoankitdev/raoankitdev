const fs = require('fs');

async function updateWeather() {
  const apiKey = process.env.WEATHER_API_KEY;
  const city = "Delhi"; // Change to your city
  
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    
    const temp = Math.round(data.main.temp);
    // This grabs the specific weather condition (e.g., 'Rain', 'Clouds')
    const condition = data.weather[0].main; 

    let template = fs.readFileSync('chat.template.svg', 'utf-8');

    // Replaces both the temp and the description in your template
    let newSvg = template
      .replace('{{TEMP}}', temp)
      .replace('{{CONDITION}}', condition);

    fs.writeFileSync('chat.svg', newSvg);
    console.log(`Updated: ${temp}°C, ${condition}`);
  } catch (error) {
    console.error('Error:', error);
  }
}

updateWeather();
