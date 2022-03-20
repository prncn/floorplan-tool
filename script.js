const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageObj = new Image();

// const markerColor = "#37cdd4";
const markerColor = "Red";
const urlParams = new URLSearchParams(window.location.search);

imageObj.onload = (event) => {
  canvas.height = event.path[0].height;
  canvas.width = event.path[0].width;
  ctx.drawImage(imageObj, 0, 0);
};
imageObj.src =
  // "https://www.heinze.de/imagedownload/?image=/m1/82/12779082/images/80/12779980px1920x1356.jpg";
  // "https://i.imgur.com/2vPiMc3.jpg";
  // "https://i.imgur.com/MV29Q58.jpg";
  // "https://i.imgur.com/qomb3Fd.jpeg";
  // "https://ibb.co/zJrf6L5";
  // "https://www.kern-haus.de/typo3temp/assets/images/csm_kern-haus-familienhaus-loop-grundriss-erdgeschoss_698f41b2b3_52c32559d7.jpg";
  // "https://i.postimg.cc/QtbzQsfw/G1909-Lph5-210416-NN.jpg";
  // "https://i.postimg.cc/90VS60nL/IMG-2313.jpg";
  urlParams.get("img");

let clicks = [];

function drawPolygon() {
  ctx.fillStyle = "rgba(230,50,50,0.3)";
  ctx.strokeStyle = markerColor;
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(clicks[0].x, clicks[0].y);
  for (let i = 1; i < clicks.length; i++) {
    ctx.lineTo(clicks[i].x, clicks[i].y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawPoints() {
  ctx.strokeStyle = markerColor;
  ctx.lineJoin = "round";
  ctx.lineWidth = 2;

  const n = clicks.length;
  for (let i = 0; i < n; i++) {
    ctx.beginPath();
    ctx.arc(clicks[i].x, clicks[i].y, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = "72px, Georgia";
    ctx.fillStyle = markerColor;
    // ctx.fillText(
    //   `(${parseX(clicks[i].x)}, ${parseY(clicks[i].y)})`,
    //   clicks[i].x,
    //   clicks[i].y
    // );

    if (i > 0) {
      const dist = getDistance(clicks[i], clicks[i - 1]);
      const mid = getMidpoint(clicks[i], clicks[i - 1]);

      ctx.fillText(
        `${Math.round(dist / 1000).toFixed(2)} m`,
        mid.x + 10,
        mid.y
      );
    }
  }

  if (n > 2) {
    const currentArea = getArea(clicks);
    ctx.fillText(`AREA: ${currentArea}} m²`, clicks[0].x, clicks[0].y - 10);
  }
}

let areas = [];
function redraw() {
  canvas.width = canvas.width;
  ctx.drawImage(imageObj, 0, 0);

  
  drawSavedAreas();
  drawPolygon();
  drawPoints();
}

function drawSavedAreas() {
  let sum = 0.0;
  for(let area of areas) {
    sum += Number(area);
  }

  if (areas.length > 0) {
    ctx.font = "72px, Georgia";
    ctx.fillStyle = markerColor;
    ctx.fillText(
      `TOTAL: ${sum} m²`,
      canvas.width - 100,
      canvas.height - 100
    );
    for (let i = 0; i < areas.length; i++) {
      ctx.fillText(
        `AREA ${i + 1}: ${areas[i]} m²`,
        canvas.width - 100,
        canvas.height - 200 + i * 10
      );
    }
  }
}

// DIN A2 dimensions in mm - 420 X 594
const A2_WIDTH = 594;
const A2_HEIGHT = 420;
const SCALE = 200;

function parseX(px) {
  return Math.round((px / canvas.width) * A2_WIDTH * SCALE);
}

function parseY(px) {
  return Math.round((px / canvas.height) * A2_HEIGHT * SCALE);
}

canvas.addEventListener("click", (e) => {
  clicks.push({
    x: e.offsetX,
    y: e.offsetY,
  });

  redraw();
});

window.addEventListener("keydown", (event) => {
  if (event.defaultPrevented) {
    return;
  }

  console.log(event);

  switch (event.code) {
    case "KeyW":
      const currentArea = getArea(clicks);
      areas.push(currentArea);
      clicks.length = 0;
      clicks = [];
      canvas.width = canvas.width;
      ctx.drawImage(imageObj, 0, 0);

      drawSavedAreas();
      break;

    case "KeyS":
    case "ArrowDown":
      clicks.length = 0;
      clicks = [];
      canvas.width = canvas.width;
      ctx.drawImage(imageObj, 0, 0);
      break;

    case "KeyC":
      clicks = clicks.slice(0, -1);
      redraw();
      break;
  }
});

function getArea(vrtc) {
  let area = 0;

  for (var i = 0, l = vrtc.length; i < l; i++) {
    const addX = parseX(vrtc[i].x);
    const addY = parseY(vrtc[i == vrtc.length - 1 ? 0 : i + 1].y);
    const subX = parseX(vrtc[i == vrtc.length - 1 ? 0 : i + 1].x);
    const subY = parseY(vrtc[i].y);

    area += addX * addY * 0.5;
    area -= subX * subY * 0.5;
  }

  return (Math.abs(area) / 1000000).toFixed(2);
}

function getDistance(p1, p2) {
  return Math.sqrt(
    Math.pow(parseX(p2.x) - parseX(p1.x), 2) +
      Math.pow(parseY(p2.y) - parseY(p1.y), 2)
  );
}

function getMidpoint(p1, p2) {
  return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}
