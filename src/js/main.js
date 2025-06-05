// This is def a bad way of doing it but like as long as nothing else needs
// changing then

const [
  _mainImg,
  _mainTitle,
  _timer,
  _trackName,
  _trackImg,
  _nextTitle,
  _nextImg,
  time,
] = document.querySelectorAll(".dynamic");

function updateClock() {
  const currentTime = new Date();
  time.innerHTML = `
  <p>
    ${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, "0")
    }
  </p>
  `;
}

updateClock();
setInterval(updateClock, 1000);
