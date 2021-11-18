const canvas = document.getElementById("top-canvas");
const ctx = canvas.getContext("2d");

function distEuclid(agent, other) {
  return (
    ((agent.pos.x - other.pos.x) ** 2 + (agent.pos.y - other.pos.y) ** 2) **
    (1 / 2)
  );
}

function randomRange(start, end) {
  /* Randomly sampled number from start (inclusive) to end (not inclusive) */
  return start + Math.random() * (end - start);
}

function randomRangeFloor(start, end) {
  /* Randomly sampled integer from start (inclusive) to end (not inclusive) */
  return Math.floor(start + Math.random() * (end - start));
}

class Vector {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
  }
}

class Agent {
  constructor(x, y, radius = 10, lineWidth = 4) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(randomRange(-1, 1), randomRange(-1, 1));
    this.radius = radius;
    this.lineWidth = lineWidth;
  }
  update(width, height) {
    /* Update the circle position based on the velocity */

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    //check for boundaries
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
  }

  draw(context) {
    /* Draw the circle on the given context */

    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    context.lineWidth = this.lineWidth;
    context.fill();
    context.stroke();
  }
}

function sketch(context, width, height) {

  //This is the part that gets looped
  context.fillStyle = "white";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#DCDCDC"

  agents.forEach((agent) => {
    agent.update(width, height);
  });

  //draw lines between agents
  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    for (let j = i + 1; j < agents.length; j++) {
      const other = agents[j];

      //Make sure close (Euclidean distance)
      const dist = distEuclid(agent, other);
      if (dist > maxLineDist) {
        continue;
      }

      //Make linewidth change with distance:
      context.lineWidth =
        Math.floor((10 * (maxLineDist - dist)) / maxLineDist) + 1;

      //Draw line
      context.beginPath();
      context.moveTo(agent.pos.x, agent.pos.y);
      context.lineTo(other.pos.x, other.pos.y);
      context.lin
      context.stroke();
    }
  }

  agents.forEach((agent) => {
    agent.draw(context);
  });

}

// Run animation (fingers crossed!)

//Create agents
let agents = [];

//Params
const nAgents = 40;
const maxLineDist = 300;
const width = canvas.clientWidth;
const height = canvas.clientHeight;

console.log(width, height);

//Create agents
for (i = 0; i < nAgents; i++) {
  agents.push(
    new Agent(
      randomRangeFloor(0, width),
      randomRangeFloor(0, height),
      randomRangeFloor(8, 30),
      randomRangeFloor(4, 10)
    )
  );
}

const animate = () => {
  requestAnimationFrame(animate);
  sketch(ctx, width, height);
};
animate();
