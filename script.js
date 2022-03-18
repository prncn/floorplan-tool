const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const imageObj = new Image();

imageObj.onload = () => {
  canvas.attr({
    width: this.width,
    height: this.height,
  });
  context.drawImage(imageObj, 0, 0);
};
imageObj.src = '';

let clicks = [];

function drawPolygon() {
  context.fillStyle = 'rgba(100,100,100,0.5)';
  context.strokeStyle = '#df4b26';
  context.lineWidth = 1;

  context.beginPath();
  context.moveTo(clicks[0].x, clicks[0].y);
  for (let i = 1; i < clicks.length; i++) {
    context.lineTo(clicks[i].x, clicks[i].y);
  }
  context.closePath();
  context.fill();
  context.stroke();
}

function drawPoints() {
  context.strokeStyle = '#df4b26';
  context.lineJoin = 'round';
  context.lineWidth = 5;

  for (let i = 0; i < clicks.length; i++) {
    context.beginPath();
    context.arc(clicks[i].x, clicks[i].y, 3, 0, 2 * Math.PI, false);
    context.fillStyle = '#ffffff';
    context.fill();
    context.lineWidth = 5;
    context.stroke();
  }
}

function redraw() {
  canvas.width = canvas.width;
  context.drawImage(imageObj, 0, 0);

  drawPolygon();
  drawPoints();
}

canvas.addEventListener('click', (e) => {
  clicks.push({
    x: e.offsetX,
    y: e.offsetY,
  });
  let currentArea = getArea(clicks);
  console.log(currentArea);
  redraw();
});

window.addEventListener('keydown', (event) => {
  if (event.defaultPrevented) {
    return;
  }

  switch (event.key) {
    case 'ArrowDown' || 'KeyS':
      clicks = [];
      canvas.width = canvas.width;
  }
});

function getArea(corners) {
  const n = corners.length;
  if (n < 3) {
    return 0;
  }
  let area = 0;
  console.log(corners);
  for (let i = 0; i < n; i++) {
    let j = (i + 1) % n;
    area += corners[i].x * corners[j].y;
    area += corners[j].x * corners[i].y;
    area = Math.abs(area) / 2;
    return area;
  }
}
