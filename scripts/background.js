const canvas = document.getElementById("top-canvas");
const ctx = canvas.getContext("2d");

// #######################################################################
// ## Helper Functions
// #######################################################################
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

// #######################################################################
// ## Classes
// #######################################################################
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getMagnitude() {
    /* Gets the magnitude of the Vector object */
    return (this.x**2 + this.y**2)**(1/2)
  }

  normalise(target = 1){
    let magnitude = this.getMagnitude()
    this.x *= target/magnitude
    this.y *= target/magnitude
  }

}

class Agent {
  constructor(x, y, radius = 10, lineWidth = 4) {
    this.pos = new Vector(x, y);
    this.vel = new Vector(randomRange(-1, 1), randomRange(-1, 1));
    this.radius = radius;
    this.lineWidth = lineWidth;
    //Vel magnitude that the agent will tend to come back to
    this.baseVelMag = this.vel.getMagnitude()
  }
  update(width, height, mousePos, behaviour="none") {
    /* 
      Update the circle position based on the velocity
      Expects behavior in ["none", "target"] 
    */

    const gravConst = 4*10e-5;
    const frictConst = 0.999;

    if (behaviour === "target") {
      // move balls marginally towards cursor
      let velToCursor = new Vector(
        mousePos.x - this.pos.x, 
        mousePos.y - this.pos.y)
      //Gravity
      let velToCursorNorm = velToCursor
      velToCursorNorm.normalise()
      this.vel.x += gravConst * this.radius / Math.max(velToCursor.getMagnitude()**2, 10e-6) * velToCursorNorm.x
      this.vel.y += gravConst * this.radius / Math.max(velToCursor.getMagnitude()**2, 10e-6) * velToCursorNorm.y

    } else {
        //Friction
      if (this.vel.getMagnitude() > this.baseVelMag){
        this.vel.x *= frictConst;
        this.vel.y *= frictConst;
      }
    }

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
    context.save();
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    context.lineWidth = this.lineWidth;
    context.fill();
    context.stroke();
    context.restore();
  }
}

// #######################################################################
// ## Events
// #######################################################################

//Listener to check mouse is on canvas
let mouseOnCanvas = false;
document.querySelector('body').addEventListener('mouseleave', e => {
  mouseOnCanvas = false;
})
document.querySelector('body').addEventListener('mouseenter', e => {
  mouseOnCanvas = true;
})

//Listener to get mouse position on movement
let mousePosition = new Vector(0,0)
window.addEventListener('mousemove', e => {
  mousePosition.x = e.clientX;
  mousePosition.y = e.clientY;
})

// #######################################################################
// ## Sketch Function
// #######################################################################

function sketch(context) {

  //try everiding height and width
  const width = window.innerWidth * 0.99;
  const height = window.innerHeight * 0.99;

  //Resize canvas
  document.getElementById('top-canvas').height = height;
  document.getElementById('top-canvas').width = width;

  //This is the part that gets looped
  context.fillStyle = "white";
  //context.fillRect(0, 0, width, height);
  context.strokeStyle = "#DCDCDC"

  agents.forEach((agent) => {
    agent.update(width, height, mousePosition, mouseOnCanvas ? "target" : "none");
  });

  //draw lines between agents
  for (let i = 0; i < agents.length; i++) {
    const agent = agents[i];
    for (let j = i + 1; j < agents.length; j++) {
      const other = agents[j];

      context.save()

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
      context.stroke();

      context.restore()
    }
  }

  //Draw Agents
  agents.forEach((agent) => {
    agent.draw(context);
  });  

  //Draw dot at cursor
  if (mouseOnCanvas === true) {
    context.save();
    context.beginPath();
    context.arc(mousePosition.x, mousePosition.y, 10, 0, 2 * Math.PI);
    context.lineWidth = 3;
    context.fillStyle = "white";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
    context.restore();
  }


}
// #######################################################################
// ## Setup
// #######################################################################
//Create agents
let agents = [];

//Params
const nAgents = 20;
const maxLineDist = 300;
const width = window.innerWidth * 0.99;
const height = window.innerHeight * 0.99;

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
// #######################################################################
// ## Animate
// #######################################################################

const animate = () => {
  requestAnimationFrame(animate);
  sketch(ctx);
};
animate();
