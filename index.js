class Hilbert {
  constructor(order, canvasSize = 512) {
    this.order = order;
    this.canvasSize = canvasSize;
  }

  indexToPoint(index) {
    const n = 2 ** this.order;
    const point = { x: 0, y: 0 };
    let rx;
    let ry;
    for (let s = 1, t = index; s < n; s *= 2) {
      rx = 1 & (t / 2);
      ry = 1 & (t ^ rx);
      this.rotate(point, rx, ry, s);
      point.x += s * rx;
      point.y += s * ry;
      t /= 4;
    }
    return point;
  }

  pointToIndex(point) {
    const n = 2 ** this.order;
    let rx;
    let ry;
    let index = 0;
    for (let s = n / 2; s > 0; s = Math.floor(s / 2)) {
      rx = (point.x & s) > 0 ? 1 : 0;
      ry = (point.y & s) > 0 ? 1 : 0;
      index += s * s * ((3 * rx) ^ ry);
      this.rotate(point, rx, ry, n);
    }
    return index;
  }

  rotate(point, rx, ry, n) {
    if (ry !== 0) {
      return;
    }
    if (rx === 1) {
      point.x = n - 1 - point.x;
      point.y = n - 1 - point.y;
    }
    [point.x, point.y] = [point.y, point.x];
  }

  offsetPoint(point) {
    let numberOfRows = Math.pow(2, this.order);
    let len = width / numberOfRows; // Len of each edge between vertex of each cell (1 cell has 4 vertex)
    return {
      x: point.x * len + len / 2,
      y: point.y * len + len / 2,
    };
  }

  deoffsetPoint(point) {
    let numberOfRows = Math.pow(2, this.order);
    let len = width / numberOfRows; // Len of each edge between vertex of each cell (1 cell has 4 vertex)
    return {
      x: Math.trunc(point.x / len),
      y: Math.trunc(point.y / len),
    };
  }
}

// Canvas configuration
const width = 1024;
const c = document.getElementById("myCanvas");
c.width = width;
c.height = c.width;
const ctx = c.getContext("2d");

// Hilbert configuration
const order = 10; // Should be a value between 1 and 10; otherwise too slow to process

// Computation from the order configured above
let numberOfRows = Math.pow(2, order);
let totalVertex = numberOfRows * numberOfRows;
let vertexCoordinate = Array(totalVertex);
let len = width / numberOfRows; // Len of each edge between vertex of each cell (1 cell has 4 vertex)

// Debug Output
console.log("Number of rows : " + numberOfRows);
console.log("Number of quadrant : " + totalVertex / 4);
console.log("Number of vertex : " + totalVertex);

const h = new Hilbert(order, width);

for (let i = 0; i < totalVertex; i++) {
  vertexCoordinate[i] = h.indexToPoint(i); // 1d to 2d

  // console.log("Raw:", vertexCoordinate[i]);
  vertexCoordinate[i] = h.offsetPoint(vertexCoordinate[i]);
  // console.log("Offset:", vertexCoordinate[i]);
}

console.log("Drawing");
draw();
console.log("End drawing");
let debouncing = false;
document.getElementById("myCanvas").addEventListener("mousemove", function (e) {
  if (!debouncing) {
    debouncing = true;
    setTimeout(function () {
      const x = e.clientX;
      const y = e.clientY;

      console.log(h.deoffsetPoint({ x: x, y: y }));
      console.log(h.pointToIndex(h.deoffsetPoint({ x: x, y: y })));
      debouncing = false;
    }, 200);
  }
});

function draw() {
  ctx.clearRect(0, 0, c.width, c.height);

  // Draw the quadrant
  ctx.beginPath();
  for (let i = 1; i < numberOfRows; i++) {
    // Draw horizontal lines

    ctx.strokeStyle = "rgba(100,100,100, 0.2)";
    ctx.moveTo(0, i * len);
    ctx.lineTo(width, i * len);

    // Draw vertical lines
    ctx.moveTo(i * len, 0);
    ctx.lineTo(i * len, width);
  }

  // Draw edge between vertex
  ctx.stroke();
  ctx.beginPath();
  ctx.strokeStyle = "blue";
  for (let i = 1; i < totalVertex; i++) {
    ctx.moveTo(vertexCoordinate[i].x, vertexCoordinate[i].y);
    ctx.lineTo(vertexCoordinate[i - 1].x, vertexCoordinate[i - 1].y);
  }
  ctx.stroke();

  // Dot
  if (order < 8) {
    for (let i = 0; i < totalVertex; i++) {
      ctx.beginPath();
      ctx.arc(
        vertexCoordinate[i].x,
        vertexCoordinate[i].y,
        3,
        0,
        2 * Math.PI,
        false
      );
      ctx.fillStyle = "rgba(250, 105, 255, 0.7)";
      ctx.fill();
    }
  }

  // Text
  if (order < 5) {
    ctx.beginPath();
    ctx.fillStyle = "black";
    for (let i = 0; i < vertexCoordinate.length; i++) {
      ctx.fillText(i, vertexCoordinate[i].x + 5, vertexCoordinate[i].y + 5); // Offset the text a little bit from the vertex
    }
  }
}
