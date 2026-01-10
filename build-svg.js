const fs = require('fs');
// We use a built-in fetch or node-fetch to get data from the API
async function updateWeather() {
  const apiKey = process.env.WEATHER_API_KEY; // Grabs your secret key
  const city = "Delhi"; // Change this to your actual city name
  
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    
    // Extract temperature and weather condition
    const temp = Math.round(data.main.temp);
    const condition = data.weather[0].main;

    // Read your template file
    let template = fs.readFileSync('chat.template.svg', 'utf-8');

    // Replace placeholders with real data
    let newSvg = template
      .replace('{{TEMP}}', temp)
      .replace('{{CONDITION}}', condition);

    // Save the final image that README will show
    fs.writeFileSync('chat.svg', newSvg);
    console.log(`Successfully updated: ${temp}°C, ${condition}`);
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
}

updateWeather();
