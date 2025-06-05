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

// made the params numbers so now we have this!!
const dayMap = {
  "1": "one",
  "2": "two",
};

function updateClock() {
  const currentTime = new Date();
  time.innerHTML = `
  <p>
    ${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, "0")
    }
  </p>
  `;
}

async function getData() {
  const params = new URL(globalThis.location.href).searchParams;
  const room = params.get("room");
  const day = dayMap[params.get("day")];

  const res = await fetch(`/schedules/${room}.JSON`);
  if (!res.ok) {
    alert(
      "There was an error retriving this data, try going back to the start screen :(",
    );
  } else {
    const json = await res.json().then((res) => res);
    // eg day 1 in the json
    return json[`day ${day}`];
  }
}

async function main() {
  const data = await getData();
  console.log(data);
  updateClock();
  setInterval(updateClock, 1000);
}

main();
