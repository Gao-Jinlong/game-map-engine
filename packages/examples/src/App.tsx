import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import styles from "./App.module.scss";
import "./index.scss";

const BaseMap = React.lazy(() => import("./base-map"));
const ImageLayer = React.lazy(() => import("./image-layer"));

const examples = [
    { path: "/base-map", name: "基础地图", component: BaseMap },
    { path: "/image-layer", name: "图片图层", component: ImageLayer },
];

function App() {
    return (
        <Router>
            <div className={styles.app}>
                <nav className={styles.sidebar}>
                    <h1>地图引擎演示</h1>
                    <ul>
                        {examples.map((example) => (
                            <li key={example.path}>
                                <Link to={example.path}>{example.name}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                <main className={styles.content}>
                    <React.Suspense fallback={<div>加载中...</div>}>
                        <Routes>
                            {examples.map((example) => (
                                <Route
                                    key={example.path}
                                    path={example.path}
                                    element={<example.component />}
                                />
                            ))}
                            <Route
                                path="/"
                                element={
                                    <div className={styles.welcome}>
                                        请选择一个示例
                                    </div>
                                }
                            />
                        </Routes>
                    </React.Suspense>
                </main>
            </div>
        </Router>
    );
}

export default App;
