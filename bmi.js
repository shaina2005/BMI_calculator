function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  navLinks.classList.toggle("show");
}
// change title
function changeTitle() {
  const pagetitle = document.querySelector(".nav-logo-text");
  const path = window.location.pathname;

  const page = path.substring(path.lastIndexOf("/") + 1);
  let title = "BMI Calculator";

  switch (page) {
    case "":
    case "bmical.html": {
      title = "BMI Calculator";
      break;
    }
    case "about.html": {
      title = "About";
      break;
    }
    case "diet.html": {
      title = "Diet plan";
      break;
    }
    case "contact.html": {
      title = "contact";
      break;
    }
    default: {
      title = "BMI Calculator";
      break;
    }
  }
  if (pagetitle) pagetitle.innerText = title;
}
document.addEventListener("DOMContentLoaded", changeTitle);
// calculate bmi
function calculateBmi(e) {
  e.preventDefault();
  const height = parseFloat(document.getElementById("height").value);
  const weight = parseFloat(document.getElementById("weight").value);
  const age = parseInt(document.getElementById("age").value);

  const gender = document.querySelector('input[name="gender"]:checked').value;

  const height_unit = document.getElementById("height_unit").value;
  const weight_unit = document.getElementById("weight_unit").value;

  if (isNaN(height) || isNaN(weight)) {
    document.getElementById("result").innerHTML =
      " ⚠️Please Enter Valid height and weight";
    return;
  }

  let height_in_meters;
  if (height_unit === "cm") {
    height_in_meters = height / 100;
  } else if (height_unit === "m") {
    height_in_meters = height;
  }

  let weight_in_kg;
  if (weight_unit === "lbs") {
    weight_in_kg = weight * 0.4536;
  } else if (weight_unit === "kg") {
    weight_in_kg = weight;
  }

  const bmi = weight_in_kg / (height_in_meters * height_in_meters);

  updateBMICircle(bmi);
  hightlight_weight_range(bmi);
  showHealthyWeightRange(height, height_unit);
  document.getElementById("dietplan").style.display = "block";

  const Bmidata = {
    age,
    gender,
    height,
    height_unit,
    weight_in_kg,
  };

  sessionStorage.setItem("Bmidata", JSON.stringify(Bmidata));

  document.getElementById("submit").scrollIntoView({ behavior: "smooth" });
}

//reset button
document.addEventListener("DOMContentLoaded", () => {
  const resetBtn = document.getElementById("reset");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      // Manually reset form inputs
      document.getElementById("age").value = "";
      document.getElementById("height").value = "";
      document.getElementById("weight").value = "";
      document.getElementById("height_unit").value = "cm"; // default
      document.getElementById("weight_unit").value = "kg"; // default
      document.getElementById("male").checked = true; // default gender

      // Reset BMI circle
      const circle = document.getElementById("bmiProgress");
      circle.style.background = `conic-gradient(#dcdcdc 0% , #dcdcdc 100%)`;

      // Reset BMI value and result
      document.getElementById("bmiValue").innerText = "0.0";
      document.getElementById("bmiresult").innerText = "";

      // Remove active class from all color-labels
      document.querySelectorAll(".color-label").forEach((category) => {
        category.classList.remove("active");
      });

      // Clear healthy weight range text
      const healthyRange = document.getElementById("healthyRange");
      if (healthyRange) healthyRange.innerText = "";
    });
  }
});

// update bmi circle

function updateBMICircle(bmi) {
  const circle = document.getElementById("bmiProgress");
  const bmiValue = document.getElementById("bmiValue");

  // BMI ranges typically go from 10 to 40
  const targetPercentage = Math.min(Math.max((bmi / 40) * 100, 0), 100);
  let currentPercentage = 0;

  const interval = setInterval(() => {
    if (currentPercentage >= targetPercentage) {
      clearInterval(interval);
    } else {
      currentPercentage = currentPercentage + 1;
      let fillColor;
      // under_weight
      if (bmi >= 0 && bmi <= 18.4) {
        fillColor = "#FFD700";
        document.getElementById("bmiresult").innerText = "Underweight";
      }
      // normal_weight
      else if (bmi >= 18.5 && bmi <= 24.9) {
        fillColor = "#4CD964";
        document.getElementById("bmiresult").innerText = "Normal Weight";
      }
      // over_weight
      else if (bmi >= 25 && bmi <= 29.9) {
        fillColor = "#F4C430";
        document.getElementById("bmiresult").innerText = "Overweight";
      }
      // obse class 1
      else if (bmi >= 30 && bmi <= 34.9) {
        fillColor = "#FF7F50";
        document.getElementById("bmiresult").innerText = "Obese I";
      }
      // obse class 2
      else if (bmi >= 35 && bmi <= 39.9) {
        fillColor = "#FF3B30";
        document.getElementById("bmiresult").innerText = "Obese II";
      }
      // obese class 3
      else {
        fillColor = "#990000";
        document.getElementById("bmiresult").innerText = "Obese III";
      }
      circle.style.background = `conic-gradient(${fillColor} ${currentPercentage}% , #dcdcdc ${currentPercentage}%)`;
    }
  }, 10);

  // Update the BMI number inside the circle
  bmiValue.innerText = bmi.toFixed(2);
}

//highlightinh the weight range
function hightlight_weight_range(bmi) {
  document.querySelectorAll(".color-label").forEach((category) => {
    category.classList.remove("active");
  });

  if (bmi < 18.5) {
    document.getElementById("underweight").classList.add("active");
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    document.getElementById("normalweight").classList.add("active");
  } else if (bmi >= 25 && bmi <= 29.9) {
    document.getElementById("overweight").classList.add("active");
  } else if (bmi >= 30 && bmi <= 34.9) {
    document.getElementById("obese1").classList.add("active");
  } else if (bmi >= 35 && bmi <= 39.9) {
    document.getElementById("obese2").classList.add("active");
  } else {
    document.getElementById("obese3").classList.add("active");
  }
}
//healthy weight range
function showHealthyWeightRange(height, height_unit) {
  let heightInMeters;

  if (height_unit === "cm") {
    heightInMeters = height / 100;
  } else {
    heightInMeters = height;
  }

  const minHealthyWeight = 18.5 * heightInMeters * heightInMeters;
  const maxHealthyWeight = 24.9 * heightInMeters * heightInMeters;

  document.getElementById(
    "healthyRange"
  ).innerText = `Healthy Weight Range: ${minHealthyWeight.toFixed(
    1
  )} kg - ${maxHealthyWeight.toFixed(1)} kg`;
}
//calculate calories
function calculatecalories(age, gender, height, height_unit, weight_in_kg) {
  const heightincm = height_unit === "cm" ? height : height * 100;
  let calories;

  if (gender === "male") {
    calories = 10 * weight_in_kg + 6.25 * heightincm - 5 * age + 5;
  } else if (gender === "female") {
    calories = 10 * weight_in_kg + 6.25 * heightincm - 5 * age - 161;
  }
  console.log("cal", calories);

  return Math.round(calories);
}

//spoonacular api
async function spoonacularapi(calories) {
  const api_key1 = `ce5cea566e2247`;
  const api_key2 =`c89a1525c52b67dab6`;
  const url = `https://api.spoonacular.com/mealplanner/generate?timeFrame=day&targetCalories=${calories}&apiKey=${api_key1}${api_key2}`;

  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      return data;
    }
  } catch (error) {
    console.log("Error caught : ", error);
  }
}

//edamam api
async function edamamapi() {
  const api_key1 = `f1b113df7048147`;
  const api_key2 = `a53fc05ec8c335344`;
  const api_id = `48e0d58a`;
  const userID = `shaina2005`;
  const headers = {
    Authorization: `Basic $btoa(${api_id}:${api_key1}${api_key2})`,
    "Edamam-Account-User": userID,
  };
  const url = `https://api.edamam.com/api/recipes/v2?type=public&q=healthy&app_id=${api_id}&app_key=${api_key1}${api_key2}&from=0&to=100&imageSize=REGULAR`;

  try {
    const response = await fetch(url, { headers });
    if (response.ok) {
      const data = await response.json();
      console.log(data);

      return data;
    } else {
      alert("Can't Fetch meal plan");
      return;
    }
  } catch (error) {
    console.log("error caught: ", error);
  }
}

// user click mealplan button and then api is called
document.addEventListener("DOMContentLoaded", () => {
  const dietPlan = document.getElementById("dietplan");

  if (!dietPlan) return;
  const loadingElement = document.getElementById("loading");
  dietPlan.addEventListener("click", async () => {
    console.log("get meal clicked");

    const Bmidata = JSON.parse(sessionStorage.getItem("Bmidata"));

    if (!Bmidata) {
      console.log("No BMI data found in sessionStorage yet.");
      return; // stop running the rest
    }
    console.log("bmi", Bmidata);

    const calories = calculatecalories(
      Bmidata.age,
      Bmidata.gender,
      Bmidata.height,
      Bmidata.height_unit,
      Bmidata.weight_in_kg++
    );
    loadingElement.style.display = "block";
    const Calorieplan = await spoonacularapi(calories);
    const Mealplan = await edamamapi();

    sessionStorage.setItem("Calorieplan", JSON.stringify(Calorieplan));
    sessionStorage.setItem("Mealplan", JSON.stringify(Mealplan));

    window.location.href = "diet.html";
  });
});
