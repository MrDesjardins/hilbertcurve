const width = 512;
const c = document.getElementById("myCanvas");
c.width = 512;
c.height = c.width;
const ctx = c.getContext("2d");

const order = 3;
let N = Math.pow(2, order);
let total = N * N;
let path = Array(total);
let len = width / N;

console.log("Number of point : " + total);
for (let i = 0; i < total; i++) {
  path[i] = hilbert(i);
  path[i].x *= len;
  path[i].y *= len;
  path[i].x += len / 2;
  path[i].y += len / 2;
}

draw();

function draw() {
  for (let i = 1; i < total; i++) {
    ctx.moveTo(path[i].x, path[i].y);
    ctx.lineTo(path[i - 1].x, path[i - 1].y);
    ctx.stroke();
  }

  for (let i = 0; i < path.length; i++) {
    ctx.fillText(i, path[i].x + 5, path[i].y + 5);
  }
}

function hilbert(i) {
  const points = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
  ];

  let index = i & 3;
  let v = points[index];

  for (let j = 1; j < order; j++) {
    i = i >>> 2;
    index = i & 3;
    let len = Math.pow(2, j);
    if (index === 0) {
      let temp = v.x;
      v.x = v.y;
      v.y = temp;
    } else if (index === 1) {
      v.y += len;
    } else if (index === 2) {
      v.x += len;
      v.y += len;
    } else if (index === 3) {
      let temp = len - 1 - v.x;
      v.x = len - 1 - v.y;
      v.y = temp;
      v.x += len;
    }
  }
  return v;
}
