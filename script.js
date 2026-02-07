document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bmiForm");
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");
  const bmiValue = document.getElementById("bmiValue");
  const bmiFigure = document.getElementById("bmiFigure");
  const themeToggle = document.getElementById("themeToggle");
  const langToggle = document.getElementById("langToggle");

  // SVG parts
  const body = bmiFigure.querySelector('rect[x="45"]'); // torso
  const leftArm = bmiFigure.querySelector('rect[x="25"]');
  const rightArm = bmiFigure.querySelector('rect[x="80"]');
  const leftLeg = bmiFigure.querySelector('rect[x="45"][y="110"]');
  const rightLeg = bmiFigure.querySelector('rect[x="61"][y="110"]');
  const head = bmiFigure.querySelector('circle[cx="60"]'); // head
  const allBodyParts = [body, leftArm, rightArm, leftLeg, rightLeg, head]; // all body parts

  // Define colors for different BMI categories
  const bmiColors = {
    normal: '#66bb6a',      // Green
    underweight: '#4fc3f7', // Blue
    overweight: '#ffca28',  // Yellow
    obese: '#fb8c00',       // Orange
    extreme: '#e53935'      // Red
  };

  // Text translations
  const translations = {
    en: {
      bodyMassIndex: "Calculate your Body Mass Index",
      paragraph: "BMI is a measurement of a person's leanness or corpulence based on their height and weight, and is intended to quantify tissue mass. It is widely used as a general indicator of whether a person has a healthy body weight for their height.",
      enterDetails: "Enter your details :",
      weightLabel: "Weight (kg):",
      heightLabel: "Height (cm):",
      calculateBtn: "Calculate",
      resetBtn: "Reset",
      copyright: "Date: "
    },
    ar: {
      bodyMassIndex: "احسب مؤشر كتلة الجسم الخاص بك",
      paragraph: "مؤشر كتلة الجسم هو مقياس لرشاقة الشخص أو سمنته بناءً على طوله ووزنه، ويهدف إلى كمّية كتلة الأنسجة. ويُستخدم على نطاق واسع كمؤشر عام لمعرفة ما إذا كان الشخص يملك وزناً صحياً بالنسبة لطوله.",
      enterDetails: ":أدخل تفاصيلك",
      weightLabel: "(كجم) الوزن:",
      heightLabel: "(سم) الطول:",
      calculateBtn: "احسب",
      resetBtn: "إعادة تعيين",
      copyright: "التاريخ: "
    }
  };

  // Check for saved theme in localStorage or default to light
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
  } else if (savedTheme === 'light') {
    document.body.classList.remove('dark-theme');
  } else {
    // Check user's system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-theme');
    }
  }

  // Check for saved language in localStorage or default to English
  const savedLang = localStorage.getItem('language');
  if (savedLang === 'ar') {
    document.body.classList.add('arabic');
    updateLanguage('ar');
  } else {
    document.body.classList.remove('arabic');
    updateLanguage('en');
  }

  // Theme toggle functionality
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Save the current theme to localStorage
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  // Language toggle functionality
  langToggle.addEventListener('click', () => {
    const isArabic = document.body.classList.contains('arabic');
    if (isArabic) {
      document.body.classList.remove('arabic');
      updateLanguage('en');
      localStorage.setItem('language', 'en');
    } else {
      document.body.classList.add('arabic');
      updateLanguage('ar');
      localStorage.setItem('language', 'ar');
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const weight = parseFloat(weightInput.value);
    const heightCm = parseFloat(heightInput.value);

    if (!weight || !heightCm || weight <= 0 || heightCm <= 0) {
      resetFigure();
      return;
    }

    const heightM = heightCm / 100;
    const bmi = (weight / (heightM * heightM)).toFixed(1);

    // Keep BMI in English as requested
    bmiValue.textContent = `BMI: ${bmi}`;

    if (bmi < 18.5) {
      setFigure("underweight", 22);
    } else if (bmi < 25) {
      setFigure("normal", 30);
    } else if (bmi < 30) {
      setFigure("overweight", 36);
    } else if (bmi < 35) {
      setFigure("obese", 42);
    } else {
      setFigure("extreme", 48);
    }
  });

  form.addEventListener("reset", resetFigure);

  function setFigure(className, bodyWidth) {
    // Apply the class name to the SVG element
    bmiFigure.className = `fig ${className}`;
    
    // Set the fill color for all body parts based on the BMI category
    const color = bmiColors[className] || '#66bb6a'; // Default to green if category not found
    allBodyParts.forEach(part => {
      if (part) {
        part.setAttribute('fill', color);
      }
    });

    // BODY
    body.setAttribute("width", bodyWidth);
    body.setAttribute("x", 60 - bodyWidth / 2);

    // ARMS
    leftArm.setAttribute("x", 60 - bodyWidth / 2 - 18);
    rightArm.setAttribute("x", 60 + bodyWidth / 2 + 3);

    // LEGS
    leftLeg.setAttribute("x", 60 - bodyWidth / 2);
    rightLeg.setAttribute("x", 60 + bodyWidth / 2 - 14);
  }

  function resetFigure() {
    // Keep BMI in English as requested
    bmiValue.textContent = "BMI: 0";
    setFigure("normal", 30); // Reset to normal state when form is reset
  }

  function updateLanguage(lang) {
    const texts = translations[lang];
    
    // Update header subtitle
    document.querySelector('h4').textContent = texts.bodyMassIndex;
    
    // Update paragraph
    document.querySelector('.par').textContent = texts.paragraph;
    
    // Update form heading
    document.querySelector('h3').textContent = texts.enterDetails;
    
    // Update labels
    document.querySelector('label[for="weight"]').textContent = texts.weightLabel;
    document.querySelector('label[for="height"]').textContent = texts.heightLabel;
    
    // Update buttons
    const buttons = document.querySelectorAll('.buttons button');
    buttons[0].textContent = texts.calculateBtn;  // Calculate button
    buttons[1].textContent = texts.resetBtn;      // Reset button
    
  }
  
  // Initialize the avatar with the normal state on page load
  setFigure("normal", 30);
  
  // Set the initial color when the page loads
  const initialColor = bmiColors['normal'] || '#66bb6a';
  allBodyParts.forEach(part => {
    if (part) {
      part.setAttribute('fill', initialColor);
    }
  });
});

