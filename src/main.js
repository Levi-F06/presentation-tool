// This is def a bad way of doing it but like as long as nothing else needs
// changing then

const [
  mainImg,
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

// function getTime() {
//   // using a function so I don't have to format the time constantly
//   const t = new Date()
//   // the padstart isn't neccesary for the hours since everything starts at 10
//   // this would be a problem if the events started at 8 due to the times being
//   // compared to eachother ig 9:30 > 12:30 when really 09:30 < 12:30
//   return `${t.getHours()}:${t.getMinutes().toString().padStart(2, "0")}`;
// }

// Fake temp function so I can mess around with what the time is
function getTime() {
  return "14:30";
}

function updateClock() {
  time.innerHTML = `<p>${getTime()}</p>`;
}

function createImages(speakers) {
  let res = ""
  for (const speaker of speakers.split(" and ")) {
    const path = speaker.split(" ").join("_") + ".jpg";
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
      mainTalk = i;
      nextTalk = i + 1;
      break;
    }
  }
  console.log(data[mainTalk]);
  console.log(data[nextTalk]);

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
}

async function main() {
  const data = await getData();
  updateRoom(data);
  updateClock();
  setInterval(updateClock, 1000);
}

main();
