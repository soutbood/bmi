document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bmiForm");
  const weightInput = document.getElementById("weight");
  const heightInput = document.getElementById("height");
  const bmiValue = document.getElementById("bmiValue");
  const bmiFigure = document.getElementById("bmiFigure");

  // SVG parts
  const body = bmiFigure.querySelector('rect[x="45"]'); // torso
  const leftArm = bmiFigure.querySelector('rect[x="25"]');
  const rightArm = bmiFigure.querySelector('rect[x="80"]');
  const leftLeg = bmiFigure.querySelector('rect[x="45"][y="110"]');
  const rightLeg = bmiFigure.querySelector('rect[x="61"][y="110"]');

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
    bmiFigure.className = `fig ${className}`;

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
    bmiValue.textContent = "BMI: 0";
    setFigure("normal", 30);
  }
});
