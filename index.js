// Canvas configuration
const width = 512;
const c = document.getElementById("myCanvas");
c.width = 512;
c.height = c.width;
const ctx = c.getContext("2d");

// Hilbert configuration
const order = 3; // Should be a value between 1 and 6ish

// Computation from the order configured above
let numberOfRows = Math.pow(2, order);
let totalVertex = numberOfRows * numberOfRows;
let vertexCoordinate = Array(totalVertex);
let len = width / numberOfRows; // Len of each edge between vertex of each cell (1 cell has 4 vertex)

// Debug Output
console.log("Number of rows : " + numberOfRows);
console.log("Number of quadrant : " + totalVertex / 4);
console.log("Number of vertex : " + totalVertex);

for (let i = 0; i < totalVertex; i++) {
  vertexCoordinate[i] = hilbert(i); // 1d to 2d
  console.log(vertexCoordinate[i]);
  // Visual alignment in the canvas for the 2d coordinate
  vertexCoordinate[i].x *= len;
  vertexCoordinate[i].y *= len;

  // Visual offset in the canvas for the 2d coordinate (to be in the center of a cell)
  vertexCoordinate[i].x += len / 2;
  vertexCoordinate[i].y += len / 2;
}

draw();

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
  for (let i = 1; i < totalVertex; i++) {
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

  // Text
  ctx.beginPath();
  ctx.fillStyle = "black";
  for (let i = 0; i < vertexCoordinate.length; i++) {
    ctx.fillText(i, vertexCoordinate[i].x + 5, vertexCoordinate[i].y + 5); // Offset the text a little bit from the vertex
  }
}

function hilbert(i) {
  // Default Order 1 "U" shape
  // | 0 | 3 |
  // | 1 | 2 |
  const points = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 1, y: 0 },
  ];

  let index = i & 3; // Extract the 2 digits at the most right side (that will always be between 0 and 3 because possible values are: 00, 01, 10, 11
  let vertex = points[index]; // Select the vertex in the possible 4 points
  // Loop all orders
  for (let j = 1; j < order; j++) {
    i = i >>> 2; // Shift the two most right bits to get the next quadrant of 4 points
    index = i & 3; // Give the index in the 1d array: 0,1,2,3 = index 0; 4,5,6,7 = index = 1, etc.
    const len = Math.pow(2, j); // Move between quadrant

    // Perform a rotation depending of the index that will loop between 0 and 3
    if (index === 0) {
      // Flip top-left
      let temp = vertex.x;
      vertex.x = vertex.y;
      vertex.y = temp;
    } else if (index === 1) {
      vertex.y += len;
    } else if (index === 2) {
      vertex.x += len;
      vertex.y += len;
    } else if (index === 3) {
      // Flip top-right
      let temp = len - 1 - vertex.x;
      vertex.x = len - 1 - vertex.y;
      vertex.y = temp;
      vertex.x += len;
    }
  }
  return vertex;
}
