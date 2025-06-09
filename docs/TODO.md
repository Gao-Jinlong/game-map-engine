[ ] 相机 control 逻辑重写
[ ] 抽象 view 限制视角
[ ] 抽象 source 分离数据源和 layer 逻辑
[ ] 灯光系统

[ ] 调研 openlayers 的 VectorSource 和 VectorLayer 的实现
[ ] 调研 openlayers 和 pixijs 的渲染机制 Ticker 实现
[ ] 拆分架构图为多个不同 level 的子图，每个 level 专注于描述各个 level 的细节

[ ] 鼠标命中判定

## [ ] 添加一个实体点

-   [ ] 添加一个实体点

## [ ] 处理交互事件

- [ ] 点击事件创建 PointEvent

  - [ ] 获取点击位置坐标

  - [ ] 获取可交互的 Interactable

- [ ] Interaction 处理交互，判断交互类型，派发交互的不同阶段事件

- [ ] InteractEvent 交互事件，根据交互类型，创建事件实例并派发

- [ ] Interaction.fire 触发事件

- [ ] listen 监听事件处理


## 世界坐标系和像素坐标系转换

地图的世界范围通过 米 表示，如 extent: [1000, 1000, 2000, 2000]

Marker 的大小应该使用像素作为单位如 size: 50 或者 size: [50, 50]

像素和米之间的转换关系通过 zoom 来计算

这个映射关系应该通过 camera / view (待定) 来计算

通过 camera 距离远点的距离来计算 zoom，然后根据 zoom 计算出像素和米之间的转换关系