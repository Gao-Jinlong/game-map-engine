export type EntityId = number;
export class Entity {}
export class Component {}
export class System {
  public update(world: IWorld, dt: number): void {
    // 基类方法，子类可以重写
  }
}
export type ComponentConstructor = new (...args: any[]) => Component;

interface IWorld {
  createEntity(): EntityId;
  addEntityComponents(entity: EntityId, components: Component[]): void;
  addSystem(system: System): void;
  /**
   * 查询拥有指定组件的实体
   * @param components 组件类型
   * @returns 实体ID列表
   */
  view<CC extends ComponentConstructor[]>(
    ...components: CC
  ): [EntityId, Map<ComponentConstructor, Component>][];
}

// --------------- Component ---------------
export class Position extends Component {
  constructor(public x = 0, public y = 0) {
    super();
  }
}
export class Rectangle extends Component {
  constructor(public readonly width = 0, public readonly height = 0) {
    super();
  }
}

export class Color extends Component {
  constructor(public readonly color: string) {
    super();
  }
}
export class Velocity extends Component {
  constructor(public x = 0, public y = 0) {
    super();
  }
}

// --------------- System ---------------
export class MovementSystem extends System {
  public update(world: IWorld, dt: number) {
    for (const [_, components] of world.view(Position, Velocity)) {
      const position = components.get(Position) as Position;
      const velocity = components.get(Velocity) as Velocity;

      position.x += velocity.x * dt;
      position.y += velocity.y * dt;
    }
  }
}

// 空间索引系统
export class SpatialIndex {
  private grid: Map<string, Set<EntityId>> = new Map();
  private cellSize: number;
  private worldWidth: number;
  private worldHeight: number;

  constructor(cellSize: number, worldWidth: number, worldHeight: number) {
    this.cellSize = cellSize;
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }

  // 获取实体所在的网格坐标
  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  // 获取实体可能所在的网格范围
  private getCellRange(
    x: number,
    y: number,
    width: number,
    height: number
  ): string[] {
    const startX = Math.floor(x / this.cellSize);
    const startY = Math.floor(y / this.cellSize);
    const endX = Math.floor((x + width) / this.cellSize);
    const endY = Math.floor((y + height) / this.cellSize);
    const cells: string[] = [];

    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        cells.push(`${i},${j}`);
      }
    }

    return cells;
  }

  // 添加实体到空间索引
  public addEntity(
    entityId: EntityId,
    x: number,
    y: number,
    width: number,
    height: number
  ): void {
    const cells = this.getCellRange(x, y, width, height);
    for (const cell of cells) {
      if (!this.grid.has(cell)) {
        this.grid.set(cell, new Set());
      }
      this.grid.get(cell)!.add(entityId);
    }
  }

  // 获取可能发生碰撞的实体对
  public getPotentialCollisions(): [EntityId, EntityId][] {
    const collisions: [EntityId, EntityId][] = [];
    const processedPairs = new Set<string>();

    for (const [_, entities] of this.grid) {
      const entityArray = Array.from(entities);
      for (let i = 0; i < entityArray.length; i++) {
        for (let j = i + 1; j < entityArray.length; j++) {
          const id1 = entityArray[i];
          const id2 = entityArray[j];
          const pairKey = `${Math.min(id1, id2)},${Math.max(id1, id2)}`;

          if (!processedPairs.has(pairKey)) {
            collisions.push([id1, id2]);
            processedPairs.add(pairKey);
          }
        }
      }
    }

    return collisions;
  }

  // 清空空间索引
  public clear(): void {
    this.grid.clear();
  }
}

export class CollisionSystem extends System {
  private spatialIndex: SpatialIndex;

  constructor(canvasWidth: number, canvasHeight: number) {
    super();
    // 设置网格大小为最大方块尺寸的2倍
    this.spatialIndex = new SpatialIndex(60, canvasWidth, canvasHeight);
  }

  public update(world: IWorld, _dt: number) {
    // 清空并重建空间索引
    this.spatialIndex.clear();

    // 更新空间索引
    for (const [entityId, components] of world.view(Position, Rectangle)) {
      const pos = components.get(Position) as Position;
      const rect = components.get(Rectangle) as Rectangle;
      this.spatialIndex.addEntity(
        entityId,
        pos.x,
        pos.y,
        rect.width,
        rect.height
      );
    }

    // 获取可能发生碰撞的实体对
    const potentialCollisions = this.spatialIndex.getPotentialCollisions();

    // 处理碰撞
    for (const [entityId1, entityId2] of potentialCollisions) {
      const components1 = world
        .view(Position, Rectangle, Velocity)
        .find(([id]) => id === entityId1)?.[1];
      const components2 = world
        .view(Position, Rectangle, Velocity)
        .find(([id]) => id === entityId2)?.[1];

      if (!components1 || !components2) continue;

      const pos1 = components1.get(Position) as Position;
      const rect1 = components1.get(Rectangle) as Rectangle;
      const vel1 = components1.get(Velocity) as Velocity;
      const pos2 = components2.get(Position) as Position;
      const rect2 = components2.get(Rectangle) as Rectangle;
      const vel2 = components2.get(Velocity) as Velocity;

      // 检测碰撞
      if (this.checkCollision(pos1, rect1, pos2, rect2)) {
        // 简单的碰撞响应：交换速度
        [vel1.x, vel2.x] = [vel2.x, vel1.x];
        [vel1.y, vel2.y] = [vel2.y, vel1.y];
      }
    }
  }

  private checkCollision(
    pos1: Position,
    rect1: Rectangle,
    pos2: Position,
    rect2: Rectangle
  ): boolean {
    return (
      pos1.x < pos2.x + rect2.width &&
      pos1.x + rect1.width > pos2.x &&
      pos1.y < pos2.y + rect2.height &&
      pos1.y + rect1.height > pos2.y
    );
  }
}

export class RenderingSystem extends System {
  constructor(private readonly context: CanvasRenderingContext2D) {
    super();
  }

  public update(world: IWorld, _dt: number) {
    this.context.clearRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );

    for (const [_, components] of world.view(Position, Rectangle, Color)) {
      const position = components.get(Position) as Position;
      const rectangle = components.get(Rectangle) as Rectangle;
      const color = components.get(Color) as Color;

      this.context.fillStyle = color.color;
      this.context.fillRect(
        position.x,
        position.y,
        rectangle.width,
        rectangle.height
      );
    }
  }
}

export class World implements IWorld {
  private entities: Map<EntityId, Map<ComponentConstructor, Component>> =
    new Map();
  private systems: System[] = [];
  private nextEntityId: EntityId = 0;

  createEntity(): EntityId {
    const id = this.nextEntityId++;
    this.entities.set(id, new Map());
    return id;
  }

  addEntityComponents(entity: EntityId, components: Component[]): void {
    const entityComponents = this.entities.get(entity);
    if (!entityComponents) {
      throw new Error(`Entity ${entity} does not exist`);
    }

    for (const component of components) {
      entityComponents.set(
        component.constructor as ComponentConstructor,
        component
      );
    }
  }

  addSystem(system: System): void {
    this.systems.push(system);
  }

  view<CC extends ComponentConstructor[]>(
    ...components: CC
  ): [EntityId, Map<ComponentConstructor, Component>][] {
    const result: [EntityId, Map<ComponentConstructor, Component>][] = [];

    for (const [id, entityComponents] of this.entities) {
      const hasAllComponents = components.every((component) =>
        entityComponents.has(component)
      );

      if (hasAllComponents) {
        result.push([id, entityComponents]);
      }
    }

    return result;
  }

  update(dt: number): void {
    for (const system of this.systems) {
      system.update(this, dt);
    }
  }
}
