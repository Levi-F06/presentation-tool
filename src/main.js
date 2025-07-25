// This is def a bad way of doing it but like as long as nothing else needs
// changing then
//
let currentTalk;

const [
  mainImg,
  mainTitle,
  timer,
  trackName,
  trackImg,
  nextTitle,
  nextImg,
  time,
] = document.querySelectorAll(".dynamic");

const colours = {
  "Teams": "#87cfc6",
  "Organisations": "#f05336",
  "Design & Product": "#fdba3e",
  "Workshops": "#cb671c",
};

const r = document.querySelector(":root");

// made the params numbers so now we have this!!
const dayMap = {
  "1": "one",
  "2": "two",
};

function getTime() {
  // using a function so I don't have to format the time constantly
  const t = new Date();
  // the padstart isn't neccesary for the hours since everything starts at 10
  // this would be a problem if the events started at 8 due to the times being
  // compared to eachother ig 9:30 > 12:30 when really 09:30 < 12:30
  return `${t.getHours()}:${t.getMinutes().toString().padStart(2, "0")}`;
}

// Fake temp function so I can mess around with what the time is
// let thing = 0;
// function getTime() {
//   if (thing < 5) {
//     thing++;
//     return "10:00";
//   } else {
//     return "12:59";
//   }
// }

function updateClock(data) {
  const currentTime = getTime();
  time.innerHTML = `<p>${currentTime}</p>`;
  if (currentTalk != null && currentTime > data[currentTalk]["time"]) {
    updateRoom(data);
  }
}

function updateTimer(data) {
  // fucking maths with time strings
  // proposterous

  // making a set year and month cause i only care about the time
  const time = new Date();
  // this bit is unnecesary in final product and is fucking boring as shit
  const tt = getTime().split(":");
  time.setHours(tt[0]);
  time.setMinutes(tt[1]);
  // shit over
  const t = data[currentTalk]["time"].split(":");
  const nextTime = new Date();
  nextTime.setHours(t[0]);
  nextTime.setMinutes(t[1]);
  nextTime.setSeconds(0);
  const difference = (nextTime - time) / 1000;
  if (difference > 60) {
    timer.textContent = `${Math.floor(difference / 60)} minutes`;
  } else {
    timer.textContent = `${difference} seconds!`;
  }
}

function createImages(speakers) {
  let res = "";
  for (const speaker of speakers.split(" and ")) {
    // this funky line i found online will remove all accent characters from names
    const speakerName = speaker.normalize("NFD").replace(
      /[\u0300-\u036f]/g,
      "",
    );
    const path = speakerName.split(" ").join("_") + ".jpg";
    // so should've done ts in react
    res += `<img src="/src/images/people/${path}" />`;
  }
  return res;
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

function updateRoom(data) {
  const time = getTime();
  let mainTalk;
  let nextTalk;
  for (let i = 0; i < data.length; i++) {
    const talkTime = data[i]["time"];
    if (talkTime > time) {
      currentTalk = i;
      mainTalk = i;
      nextTalk = i + 1;
      break;
    }
  }

  // idk what to even say about this line...
  // ${createImages(data[mainTalk].getSpeakers())}

  mainImg.innerHTML = `
  <div id="main-person-images">
    ${createImages(data[mainTalk]["speaker"])} 
  </div>
  <div id="main-person-overlay">
    ${createImages(data[mainTalk]["speaker"])}
  </div>
  `;

  mainTitle.innerHTML = `
  <h1 id="title">${data[mainTalk]["talkname"]}</h1>
  <p id="speaker">${data[mainTalk]["speaker"]}</p>
 
  `;

  trackName.textContent = data[mainTalk]["track"];
  const trackImgFile = data[mainTalk]["track"].replaceAll(" ", "");
  trackImg.src = `/src/images/${trackImgFile}.png`;

  // will change colours to the right room.
  r.style.setProperty("--main", colours[data[mainTalk]["track"]]);

  if (data[nextTalk] !== undefined) {
    nextTitle.innerHTML = `
  <h2>Up next at ${data[nextTalk]["time"]}</h2>
  <p>${data[nextTalk]["talkname"]}</p>
  <p>${data[nextTalk]["speaker"]}</p>
  `;
    nextImg.innerHTML = createImages(data[nextTalk]["speaker"]);
  } else {
    nextTitle.innerHTML = `
    <p>This will be the final talk in this room!</p>
    `;
    nextImg.innerHTML = "";
  }
}

async function main() {
  const data = await getData();
  updateClock(data);
  updateRoom(data);
  setInterval(updateClock, 1000, data);
  setInterval(updateTimer, 1000, data);
}

main();
