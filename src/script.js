const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const state = {
  player: {
    x: 20,
    y: 15,
  },
};

const tileSize = 16;

function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "blue";
  context.fillRect(
    state.player.x * tileSize,
    state.player.y * tileSize,
    tileSize,
    tileSize
  );

  window.requestAnimationFrame(draw);
}

draw();

window.addEventListener("keydown", (e) => {
  console.log(e);

  switch (e.key) {
    case "ArrowUp":
      state.player.y -= 1;
      break;
    case "ArrowDown":
      state.player.y += 1;
      break;
    case "ArrowLeft":
      state.player.x -= 1;
      break;
    case "ArrowRight":
      state.player.x += 1;
      break;
    default:
      return;
  }

  e.preventDefault();
});
