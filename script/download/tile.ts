// https://map.leagueoflegends.com/images/tiles/en_us/terrain_z2_29.jpg

import * as fs from "fs";
import * as path from "path";
import axios from "axios";

const BASE_URL = "https://map.leagueoflegends.com/images/tiles/en_us";
const OUTPUT_DIR = path.join(__dirname, "../../public/assets/tiles");

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function downloadTile(z: number, offset: number) {
    const url = `${BASE_URL}/terrain_z${z}_${offset}.jpg`;
    const outputPath = path.join(OUTPUT_DIR, `terrain_z${z}_${offset}.jpg`);

    try {
        const response = await axios({
            method: "GET",
            url: url,
            responseType: "stream",
        });

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });
    } catch (error) {
        console.error(`下载失败: ${url}`, error);
        return null;
    }
}

async function downloadAllTiles() {
    // 这里可以根据需要调整 z, x, y 的范围
    const zLevels = [2]; // 缩放级别
    const offsetRange = { start: 0, end: 64 }; // y 坐标范围

    for (const z of zLevels) {
        for (
            let offset = offsetRange.start;
            offset <= offsetRange.end;
            offset++
        ) {
            console.log(`正在下载: z=${z}, offset=${offset}`);
            await downloadTile(z, offset);
            // 添加延迟以避免请求过于频繁
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
}

// 执行下载
downloadAllTiles()
    .then(() => console.log("所有贴图下载完成"))
    .catch((error) => console.error("下载过程中出错:", error));
