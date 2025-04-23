const container = document.querySelector("#container");

// get data through fetch

const dayMap = {
  "1":"one",
  "2":"two",
};

async function getData() {

  const params = new URL(window.location.href).searchParams;
  const room = params.get("room");
  const day = dayMap[params.get("day")];

  try {
    const response = await fetch(`/schedules/${room}.JSON`);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json[`day ${day}`]);
    

  } catch (err) {
    console.log(err.message);
  }
}

getData();
