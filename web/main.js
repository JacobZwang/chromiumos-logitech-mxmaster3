// button up event seems to be the same for all buttons
// so the button currently down needs to be tracked
let forwardDown = false;
let backwardDown = false;

window.addEventListener("DOMContentLoaded", () => {
  const activateButton = document.getElementById("activate");
  activateButton.addEventListener("click", () => {
    activate();
  });
  loadDevice();
});

function activate() {
  navigator.hid
    .requestDevice({
      filters: [],
    })
    .then((device) => {
      console.log(device.productName);
      console.log(device.manufacturerName);
      loadDevice();
    })
    .catch((error) => {
      console.error(error);
    });
}

function loadDevice() {
  navigator.hid.getDevices().then((d) => {
    const device = d[0];
    console.log(d);
    if (device) {
      console.log(device);
      device.open();
      device.addEventListener("inputreport", ({ data }) => {
        handleInput(data);
      });
    }
  });
}

function displayData(data) {
  let string = "";
  for (let i = 0; i < data.byteLength; i++) {
    string += " " + data.getUint8(i).toString();
  }
  return string;
}

function handleButton(data) {
  switch (data.getUint8(4)) {
    case 0:
      if (forwardDown) {
        window.dispatchEvent(new Event("logitech_mxmaster3_forward_up"));
        forwardDown = false;
      } else if (backwardDown) {
        window.dispatchEvent(new Event("logitech_mxmaster3_backward_up"));
        backwardDown = false;
      }
      break;
    case 86:
      window.dispatchEvent(new Event("logitech_mxmaster3_forward_down"));
      forwardDown = true;
      break;
    case 83:
      window.dispatchEvent(new Event("logitech_mxmaster3_backward_down"));
      backwardDown = true;
      break;
    default:
      console.log(displayData(data));
  }
}

function hanldeSideScroll(data) {
  console.log(displayData(data));
}

function handleInput(data) {
  switch (data.getUint8(1)) {
    case 8:
      handleButton(data);
      break;
    case 14:
      hanldeSideScroll(data);
      break;
    default:
      console.log(string);
  }
}

navigator.serviceWorker.register("test.js");

window.addEventListener("logitech_mxmaster3_forward_down", () => {
  // console.log("logitech_mxmaster3_forward_down");
  fetch("http://localhost:5500/devices");
});

window.addEventListener("logitech_mxmaster3_forward_up", () => {
  // console.log("logitech_mxmaster3_forward_up");
});

window.addEventListener("logitech_mxmaster3_backward_down", () => {
  // console.log("logitech_mxmaster3_backward_down");
});

window.addEventListener("logitech_mxmaster3_backward_up", () => {
  // console.log("logitech_mxmaster3_backward_up");
});
