const axios = require("axios");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const OPENWEATHER_KEY = process.env.OPENWEATHER_KEY;
const OPENCAGE_KEY = process.env.OPENCAGE_KEY;

rl.question("Enter country name: ", async (country) => {
  try {

    const geoResponse = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${country}&key=${OPENCAGE_KEY}`
    );

    if (!geoResponse.data.results.length) {
      console.log("Country not found.");
      rl.close();
      return;
    }

    const { lat, lng } = geoResponse.data.results[0].geometry;

    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_KEY}&units=metric`
    );

    const temperature = weatherResponse.data.main.temp;

    console.log("\nCountry Weather Information");
    console.log(`Country: ${country}`);
    console.log(`Latitude: ${lat}`);
    console.log(`Longitude: ${lng}`);
    console.log(`Temperature: ${temperature}°C`);

  } catch (error) {

    if (error.response) {
      if (error.response.status === 401) {
        console.log("Invalid API token.");
      } else if (error.response.status === 404) {
        console.log("Country not found.");
      } else {
        console.log("API Error:", error.response.status);
      }
    } else if (error.request) {
      console.log("Network error. Please check your internet connection.");
    } else {
      console.log("Unexpected error:", error.message);
    }

  } finally {
    rl.close();
  }
});