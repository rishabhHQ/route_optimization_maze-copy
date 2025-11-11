const rows = 20;
const cols = 20;
let grid = [];
let start = [0, 0];
let end = [rows - 1, cols - 1];
const mazeDiv = document.getElementById("maze");

function createMaze() {
  do {
    grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.random() < 0.25 ? 1 : 0)
    );
    grid[start[0]][start[1]] = 0;
    grid[end[0]][end[1]] = 0;
  } while (!isSolvable()); // regenerate until there’s a path
  renderMaze();
}

function renderMaze() {
  mazeDiv.innerHTML = "";
  mazeDiv.style.gridTemplateColumns = `repeat(${cols}, 25px)`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      if (grid[r][c] === 1) cell.classList.add("wall");
      if (r === start[0] && c === start[1]) cell.classList.add("start");
      if (r === end[0] && c === end[1]) cell.classList.add("end");
      mazeDiv.appendChild(cell);
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Dijkstra’s Algorithm
async function dijkstra(animate = true) {
  const dist = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const parent = Array.from({ length: rows }, () => Array(cols).fill(null));
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  const pq = [];
  const index = (r, c) => r * cols + c;
  dist[start[0]][start[1]] = 0;
  pq.push({ r: start[0], c: start[1], d: 0 });

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (pq.length > 0) {
    pq.sort((a, b) => a.d - b.d);
    const { r, c, d } = pq.shift();

    if (visited[r][c]) continue;
    visited[r][c] = true;

    if (animate) {
      const cells = document.querySelectorAll(".cell");
      const cellIndex = index(r, c);
      if (!(r === start[0] && c === start[1]) && !(r === end[0] && c === end[1])) {
        cells[cellIndex].classList.add("visited");
        await sleep(15);
      }
    }

    if (r === end[0] && c === end[1]) break;

    for (const [dr, dc] of directions) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && grid[nr][nc] === 0 && !visited[nr][nc]) {
        const newDist = d + 1;
        if (newDist < dist[nr][nc]) {
          dist[nr][nc] = newDist;
          parent[nr][nc] = [r, c];
          pq.push({ r: nr, c: nc, d: newDist });
        }
      }
    }
  }

  // Reconstruct path
  let path = [];
  let at = end;
  while (at) {
    path.push(at);
    at = parent[at[0]][at[1]];
  }

  if (path[path.length - 1][0] !== start[0] || path[path.length - 1][1] !== start[1]) {
    return null; // no valid path
  }

  path.reverse();

  if (animate) {
    const cells = document.querySelectorAll(".cell");
    for (const [r, c] of path) {
      const idx = index(r, c);
      if (!(r === start[0] && c === start[1]) && !(r === end[0] && c === end[1])) {
        cells[idx].classList.add("path");
        await sleep(40);
      }
    }
  }

  return path;
}

// Quick path check (non-animated)
function isSolvable() {
  const result = dijkstra(false);
  return result !== null;
}

// Event Listeners
document.getElementById("startBtn").addEventListener("click", async () => {
  renderMaze();
  const path = await dijkstra(true);
  if (!path) alert("No path found!");
});

document.getElementById("randomBtn").addEventListener("click", () => {
  createMaze();
});

// Initialize
createMaze();
