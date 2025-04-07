import {
  World,
  Position,
  Rectangle,
  Color,
  Velocity,
  MovementSystem,
  CollisionSystem,
  RenderingSystem,
} from "./ecs";

// 初始化画布
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// 创建世界
const world = new World();

// 添加系统
world.addSystem(new MovementSystem());
world.addSystem(new CollisionSystem());
world.addSystem(new RenderingSystem(ctx));

// 创建实体
const createBox = (
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  vx: number,
  vy: number
) => {
  const entity = world.createEntity();
  world.addEntityComponents(entity, [
    new Position(x, y),
    new Rectangle(width, height),
    new Color(color),
    new Velocity(vx, vy),
  ]);
  return entity;
};

// 创建多个碰撞的方块
const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "cyan",
  "magenta",
  "lime",
  "pink",
];
const NUM_BOXES = 50;
const MIN_SIZE = 10;
const MAX_SIZE = 30;
const MIN_SPEED = 50;
const MAX_SPEED = 200;

// 生成随机数函数
const random = (min: number, max: number) => Math.random() * (max - min) + min;
const randomInt = (min: number, max: number) => Math.floor(random(min, max));

// 检查位置是否重叠
const checkOverlap = (
  x: number,
  y: number,
  width: number,
  height: number,
  existingBoxes: { x: number; y: number; width: number; height: number }[]
): boolean => {
  return existingBoxes.some(
    (box) =>
      x < box.x + box.width &&
      x + width > box.x &&
      y < box.y + box.height &&
      y + height > box.y
  );
};

// 创建200个随机方块
const existingBoxes: { x: number; y: number; width: number; height: number }[] =
  [];

for (let i = 0; i < NUM_BOXES; i++) {
  let attempts = 0;
  let x: number, y: number, width: number, height: number;

  // 尝试找到一个不重叠的位置
  do {
    width = randomInt(MIN_SIZE, MAX_SIZE);
    height = randomInt(MIN_SIZE, MAX_SIZE);
    x = randomInt(0, canvas.width - width);
    y = randomInt(0, canvas.height - height);
    attempts++;

    // 如果尝试太多次，扩大搜索范围
    if (attempts > 100) {
      width = MIN_SIZE;
      height = MIN_SIZE;
      x = randomInt(0, canvas.width - width);
      y = randomInt(0, canvas.height - height);
      break;
    }
  } while (checkOverlap(x, y, width, height, existingBoxes));

  const vx = random(-MAX_SPEED, MAX_SPEED);
  const vy = random(-MAX_SPEED, MAX_SPEED);
  const color = colors[randomInt(0, colors.length)];

  createBox(x, y, width, height, color, vx, vy);
  existingBoxes.push({ x, y, width, height });
}

// 游戏循环
let lastTime = performance.now();
function gameLoop(currentTime: number) {
  const dt = (currentTime - lastTime) / 1000; // 转换为秒
  lastTime = currentTime;

  // 处理边缘碰撞
  for (const [_, components] of world.view(Position, Rectangle, Velocity)) {
    const position = components.get(Position) as Position;
    const rectangle = components.get(Rectangle) as Rectangle;
    const velocity = components.get(Velocity) as Velocity;

    // 左右边界碰撞
    if (position.x <= 0 || position.x + rectangle.width >= canvas.width) {
      velocity.x *= -1;
      position.x = Math.max(
        0,
        Math.min(position.x, canvas.width - rectangle.width)
      );
    }

    // 上下边界碰撞
    if (position.y <= 0 || position.y + rectangle.height >= canvas.height) {
      velocity.y *= -1;
      position.y = Math.max(
        0,
        Math.min(position.y, canvas.height - rectangle.height)
      );
    }
  }

  world.update(dt);
  requestAnimationFrame(gameLoop);
}

// 启动游戏循环
requestAnimationFrame(gameLoop);

console.log("world", world);
