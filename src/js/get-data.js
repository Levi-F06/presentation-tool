const container = document.querySelector("#container");

// get data through fetch

const dayMap = {
  "1": "one",
  "2": "two",
};

let currentSpeaker;

async function getData() {
  const params = new URL(window.location.href).searchParams;
  const room = params.get("room");
  const day = dayMap[params.get("day")];

  try {
    const response = await fetch(`/schedules/${room}.JSON`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    await response.json().then((res) => {
      startRoom(res[`day ${day}`]);
    });
  } catch (err) {
    console.log(err.message);
  }
}

function startRoom(data) {
  console.log(data);
  const date = new Date();
  const time = `${date.getHours()}:${date.getMinutes()}`;
  for (let i = 0; i < data.length; i++) {
    console.log(data[i]["time"]);
  }
}

function updateRoom() {
}

getData();
