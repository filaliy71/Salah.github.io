// const http = new XMLHttpRequest();
let result = document.querySelector("pre");

document.addEventListener("DOMContentLoaded", () => {
  salah();
});
// http.onreadystatechange = function () {
//   console.log("HTTP state change:", this.readyState, this.status);
//   if (this.readyState == 4) {
//     if (this.status == 200) {
//       console.log("API response:", this.responseText);
//       results = JSON.parse(this.responseText);
//       console.log("Parsed results:", results);
//       if (results.city && results.countryName) {
//         salah();
//       } else {
//         console.error("City or Country Name missing in results:", results);
//         alert("City or Country Name is missing from the API response.");
//       }
//     } else {
//       console.error("API request failed with status:", this.status);
//       alert("Failed to fetch data from the API.");
//     }
//   }
// };

// function findMyCoordinate() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         console.log("Coordinates retrieved:", position.coords);
//         const bdcAPI = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`;
//         getAPI(bdcAPI);
//       },
//       (err) => {
//         handleGeolocationError(err);
//       }
//     );
//   } else {
//     alert("Geolocation is not supported by your browser.");
//   }
// }

// function handleGeolocationError(err) {
//   switch (err.code) {
//     case 1: // PERMISSION_DENIED
//       alert("Permission denied. Please allow location access.");
//       break;
//     case 2: // POSITION_UNAVAILABLE
//       alert("Position unavailable. Please check your location settings.");
//       break;
//     case 3: // TIMEOUT
//       alert("Request timed out. Please try again.");
//       break;
//     default:
//       alert("An unknown error occurred.");
//   }
//   console.error("Geolocation error:", err);
// }

// function getAPI(bdcAPI) {
//   http.open("GET", bdcAPI);
//   http.send();
//   http.onreadystatechange = function () {
//     if (this.readyState == 4 && this.status == 200) {
//       results = JSON.parse(this.responseText);
//       console.log("Results from bigdatacloud:", results);

//       if (results.city && results.countryName) {
//         salah();
//       } else {
//         alert("City or Country Name is missing from the API response.");
//         console.error("City or Country Name missing in results:", results);
//       }
//     }
//   };
// }
async function getUserCountry() {
  const ipAPI = "https://ipinfo.io?token=23e5f53cc2b967"; // Replace with your token

  try {
    const response = await fetch(ipAPI);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    console.log(data);
    return data; // Return the fetched data
  } catch (err) {
    console.error("Error fetching IP-based location:", err);
    alert("Could not determine location.");
    return null;
  }
}
async function salah() {
  let city = localStorage.getItem("city");
  let countryName = localStorage.getItem("countryName");

  if (!city || !countryName) {
    const locationData = await getUserCountry();
    if (locationData) {
      city = locationData.city;
      countryName = locationData.country;

      // Save to localStorage for future use
      localStorage.setItem("city", city);
      localStorage.setItem("countryName", countryName);
    } else {
      alert("Unable to determine location. Please try again later.");
      return;
    }
  }

  // Fetch user location if not in localStorage

  var year = new Date().getFullYear();
  var month = new Date().getMonth() + 1;
  var day = Math.max(0, new Date().getDate() - 1);
  fetch("https://api.aladhan.com/v1/calendarByCity/" + year + "/" + month + "?city=" + city + "&country=" + countryName + "&method=3")
    .then((Response) => Response.json())
    .then((data) => {
      var time = data;
      var Fajr = data.data[day].timings.Fajr;
      var Duhr = data.data[day].timings.Dhuhr;
      var Asr = data.data[day].timings.Asr;
      var Maghib = data.data[day].timings.Maghrib;
      var Isha = data.data[day].timings.Isha;
      var method = data.data[day].meta.method.name;
      var hijri = data.data[day].date.hijri.date;
      var gregorian = data.data[day].date.gregorian.date;
      console.log(time);
      var wak = document.getElementById("fajr");
      wak.innerHTML = Fajr.replace("(+01)", "");
      var dohr = document.getElementById("dhuhr");
      dohr.innerHTML = Duhr.replace("(+01)", "");
      var isr = document.getElementById("asr");
      isr.innerHTML = Asr.replace("(+01)", "");
      var maghb = document.getElementById("maghrib");
      maghb.innerHTML = Maghib.replace("(+01)", "");
      var ish = document.getElementById("isha");
      ish.innerHTML = Isha.replace("(+01)", "");
      document.querySelector(".hhh").innerHTML = city;
      document.querySelector(".method").innerHTML = "<i>method :  </i>" + method;
      document.querySelector(".date").innerHTML = "Miladi :" + gregorian + " | " + "hijri :" + hijri;
    })
    .catch((error) => {
      console.error("Error fetching salah timings:", error);
      alert("Failed to fetch salah timings.");
    });
}

const sunicon = document.querySelector(".sun");
const moonicon = document.querySelector(".moon");

const userTheme = localStorage.getItem("theme");
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;

const icontoggle = () => {
  moonicon.classList.toggle("display-none");
  sunicon.classList.toggle("display-none");
};

const themecheck = () => {
  if (userTheme === "dark" || (!userTheme && systemTheme)) {
    document.documentElement.classList.add("dark");
    moonicon.classList.add("display-none");
    return;
  }
  sunicon.classList.add("display-none");
};

const themeswitch = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    icontoggle();
    return;
  }
  document.documentElement.classList.add("dark");
  localStorage.setItem("theme", "dark");
  icontoggle();
};

sunicon.addEventListener("click", themeswitch);
moonicon.addEventListener("click", themeswitch);
themecheck();
