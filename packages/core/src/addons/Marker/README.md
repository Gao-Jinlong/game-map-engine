# Marker 组件

Marker 组件用于在三维地图场景中创建可交互的标记物，可以用于标识特定位置、添加信息点等。

## 功能特性

- ✅ 支持自定义图标纹理
- ✅ 支持默认几何图形样式
- ✅ 可配置位置、旋转、缩放
- ✅ 支持透明度控制
- ✅ 支持看板模式（始终面向相机）
- ✅ 可交互（点击、悬停事件）
- ✅ 自动资源清理

## 基本使用

```typescript
import { Marker } from '@core/addons/Marker';
import * as THREE from 'three';

// 创建一个简单的标记
const marker = new Marker({
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Vector3(0, 0, 0),
    scale: new THREE.Vector3(1, 1, 1),
    size: 2,
    color: 0xff0000,
    interactive: true,
    onClick: (marker) => {
        console.log('Marker clicked!', marker);
    }
});

// 添加到地图
map.add(marker);
```

## 使用自定义图标

```typescript
const iconMarker = new Marker({
    position: new THREE.Vector3(100, 0, 100),
    iconUrl: '/path/to/icon.png',
    size: 3,
    opacity: 0.9,
    billboard: true, // 始终面向相机
    onClick: (marker) => {
        console.log('Icon marker clicked!');
    },
    onHover: (marker, isHovering) => {
        if (isHovering) {
            marker.setScale(new THREE.Vector3(1.2, 1.2, 1.2));
        } else {
            marker.setScale(new THREE.Vector3(1, 1, 1));
        }
    }
});

map.add(iconMarker);
```

## 配置选项

| 选项          | 类型            | 默认值      | 描述                                |
| ------------- | --------------- | ----------- | ----------------------------------- |
| `position`    | `THREE.Vector3` | `(0,0,0)`   | 标记物在三维空间中的位置            |
| `rotation`    | `THREE.Vector3` | `(0,0,0)`   | 标记物的旋转角度（仅非看板模式）    |
| `scale`       | `THREE.Vector3` | `(1,1,1)`   | 标记物的缩放比例                    |
| `iconUrl`     | `string?`       | `undefined` | 自定义图标的URL                     |
| `size`        | `number?`       | `1`         | 标记物的大小                        |
| `color`       | `number?`       | `0xffffff`  | 默认标记物的颜色（当没有iconUrl时） |
| `interactive` | `boolean?`      | `true`      | 是否可交互                          |
| `opacity`     | `number?`       | `1`         | 透明度（0-1）                       |
| `billboard`   | `boolean?`      | `true`      | 是否始终面向相机                    |
| `onClick`     | `function?`     | `undefined` | 点击事件回调                        |
| `onHover`     | `function?`     | `undefined` | 悬停事件回调                        |

## 公共方法

### 位置控制
- `setPosition(position: THREE.Vector3)` - 设置位置
- `getPosition(): THREE.Vector3` - 获取位置
- `getWorldPosition(): THREE.Vector3` - 获取世界坐标位置

### 变换控制
- `setRotation(rotation: THREE.Vector3)` - 设置旋转
- `setScale(scale: THREE.Vector3)` - 设置缩放

### 外观控制
- `setOpacity(opacity: number)` - 设置透明度
- `setVisible(visible: boolean)` - 设置可见性
- `isVisible(): boolean` - 获取可见性状态

### 其他
- `getObject3D(): THREE.Object3D` - 获取内部的三维对象（用于高级操作）
- `handleClick()` - 手动触发点击事件
- `handleHover(isHovering: boolean)` - 手动触发悬停事件

## 事件处理

标记物支持两种主要的交互事件：

### 点击事件
```typescript
const marker = new Marker({
    // ... 其他配置
    onClick: (marker) => {
        console.log('点击了标记物', marker.getPosition());
        // 可以在这里处理点击逻辑，如显示信息弹窗等
    }
});
```

### 悬停事件
```typescript
const marker = new Marker({
    // ... 其他配置
    onHover: (marker, isHovering) => {
        if (isHovering) {
            // 鼠标悬停时的效果
            marker.setOpacity(0.7);
        } else {
            // 鼠标离开时恢复
            marker.setOpacity(1.0);
        }
    }
});
```

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
