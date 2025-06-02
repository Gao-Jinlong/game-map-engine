# Marker 组件

Marker 组件用于在三维地图场景中创建可交互的标记物，可以用于标识特定位置、添加信息点等。

## 功能特性

- ✅ 支持自定义图标纹理
- ✅ 支持悬停时切换纹理
- ✅ 支持默认几何图形样式
- ✅ 可配置位置、旋转、缩放
- ✅ 支持透明度控制
- ✅ 支持看板模式（始终面向相机）
- ✅ 可交互（点击、悬停事件）
- ✅ 内置动画系统（大小、透明度、颜色动画）
- ✅ 多种缓动函数支持
- ✅ 自动资源清理

## 基本使用

```typescript
import { Marker } from '@core/addons/Marker';
import * as THREE from 'three';

// 创建一个简单的标记
const marker = new Marker({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    size: 2,
    color: 0xff0000,
    interactive: true,
    onClick: (marker) => {
        console.log('Marker clicked!', marker);
    }
});

// 添加到地图
map.addComponent(marker);
```

## 悬停纹理切换功能

```typescript
const animatedMarker = new Marker({
    position: [100, 0, 100],
    iconUrl: '/path/to/normal-icon.png',
    hoverIconUrl: '/path/to/hover-icon.png', // 悬停时的纹理
    size: 3,
    hoverSize: 4, // 悬停时的大小
    opacity: 1.0,
    hoverOpacity: 0.8, // 悬停时的透明度
    color: 0xffffff,
    hoverColor: 0xff6600, // 悬停时的颜色
    billboard: true,
    
    // 动画配置
    animationDuration: 300, // 动画持续时间（毫秒）
    animationEasing: 'easeInOut', // 缓动函数
    
    onClick: (marker) => {
        console.log('Animated marker clicked!');
    },
    onHover: (marker, isHovering) => {
        if (isHovering) {
            console.log('鼠标悬停在标记上');
        } else {
            console.log('鼠标离开标记');
        }
    }
});

map.addComponent(animatedMarker);
```

## 配置选项

### 基础选项

| 选项          | 类型           | 默认值     | 描述                             |
| ------------- | -------------- | ---------- | -------------------------------- |
| `position`    | `Vector3Tuple` | `[0,0,0]`  | 标记物在三维空间中的位置         |
| `rotation`    | `Vector3Tuple` | `[0,0,0]`  | 标记物的旋转角度（仅非看板模式） |
| `scale`       | `Vector3Tuple` | `[1,1,1]`  | 标记物的缩放比例                 |
| `iconUrl`     | `string`       | `""`       | 图标纹理URL                      |
| `size`        | `number`       | `1`        | 标记物大小                       |
| `color`       | `number`       | `0xffffff` | 标记物颜色（无纹理时使用）       |
| `interactive` | `boolean`      | `true`     | 是否可交互                       |
| `opacity`     | `number`       | `1`        | 透明度（0-1）                    |
| `billboard`   | `boolean`      | `true`     | 是否始终面向相机                 |

### 悬停效果选项

| 选项           | 类型     | 默认值       | 描述                |
| -------------- | -------- | ------------ | ------------------- |
| `hoverIconUrl` | `string` | `undefined`  | 悬停时的图标纹理URL |
| `hoverSize`    | `number` | `size * 1.2` | 悬停时的大小        |
| `hoverColor`   | `number` | `undefined`  | 悬停时的颜色        |
| `hoverOpacity` | `number` | `opacity`    | 悬停时的透明度      |

### 动画选项

| 选项                | 类型                                               | 默认值        | 描述                 |
| ------------------- | -------------------------------------------------- | ------------- | -------------------- |
| `animationDuration` | `number`                                           | `300`         | 动画持续时间（毫秒） |
| `animationEasing`   | `'linear' \| 'easeInOut' \| 'easeIn' \| 'easeOut'` | `'easeInOut'` | 动画缓动函数类型     |

### 事件回调

| 选项      | 类型                                            | 描述         |
| --------- | ----------------------------------------------- | ------------ |
| `onClick` | `(marker: Marker) => void`                      | 点击事件回调 |
| `onHover` | `(marker: Marker, isHovering: boolean) => void` | 悬停事件回调 |

## 动画系统

Marker 组件内置了强大的动画系统，支持以下属性的平滑过渡：

- **大小动画**：在正常大小和悬停大小之间平滑过渡
- **透明度动画**：支持透明度的渐变效果
- **颜色动画**：支持颜色的平滑过渡
- **纹理切换**：在动画完成后切换纹理

### 缓动函数

支持四种缓动函数：

- `linear`：线性动画，匀速变化
- `easeInOut`：先加速后减速，平滑的进入和退出
- `easeIn`：加速进入，慢开始
- `easeOut`：减速退出，慢结束

## 高级用法

### 动态修改属性

```typescript
// 动态修改位置
marker.setPosition(new THREE.Vector3(200, 50, 200));

// 动态修改透明度
marker.setOpacity(0.5);

// 动态修改可见性
marker.setVisible(false);

// 获取世界坐标位置
const worldPos = marker.getWorldPosition();
```

### 资源管理

Marker 组件会自动管理纹理和几何体资源，在组件销毁时自动清理，无需手动处理。

```typescript
// 从地图中移除标记（会自动清理资源）
map.removeComponent(marker);
```

## 性能优化建议

1. **纹理预加载**：悬停纹理会在组件初始化时预加载，确保切换时的流畅性
2. **动画优化**：使用 `requestAnimationFrame` 进行动画更新，确保 60fps 的流畅体验
3. **资源复用**：相同的纹理会被自动复用，减少内存占用
4. **批量操作**：对于大量标记，建议分批添加以避免性能问题

## 注意事项

- 悬停纹理 URL 必须是有效的图片资源
- 动画期间避免频繁调用 `setOpacity` 等方法，可能会干扰动画效果
- 在移动设备上，悬停效果可能不可用，建议提供替代的交互方式
- 大尺寸的纹理可能影响性能，建议使用适当大小的图片资源

## 最佳实践

1. **性能优化**: 当需要大量标记物时，考虑使用实例化渲染或LOD系统
2. **资源管理**: 组件会自动清理资源，但建议及时移除不需要的标记物
3. **交互设计**: 为交互式标记物提供视觉反馈，如悬停效果
4. **图标设计**: 使用适当大小的图标，推荐64x64或128x128像素
5. **性能监控**: 监控大量标记物对渲染性能的影响

## 注意事项

- 当 `billboard` 为 `true` 时，标记物会使用 `THREE.Sprite`，旋转设置将被忽略
- 图标加载失败时会自动回退到默认样式
- 事件处理需要地图的交互系统支持
- 大量标记物可能影响渲染性能，建议使用合适的优化策略 
