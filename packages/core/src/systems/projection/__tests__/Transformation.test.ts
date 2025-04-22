import { Position } from "@core/entity";
import { Transformation } from "../Transformation";
import { describe, it, expect } from "vitest";

describe("Transformation", () => {
    describe("构造函数", () => {
        it("应该使用单独参数创建实例", () => {
            const transform = new Transformation(2, 1, 2, 1, 2, 1);
            expect(transform).toBeInstanceOf(Transformation);
        });

        it("应该使用数组参数创建实例", () => {
            const transform = new Transformation([2, 1, 2, 1, 2, 1]);
            expect(transform).toBeInstanceOf(Transformation);
        });
    });

    describe("transform 方法", () => {
        it("应该正确变换二维点", () => {
            const transform = new Transformation(2, 1, 2, 1, 1, 0);
            const point = new Position(1, 2, 0);
            const result = transform.transform(point);

            expect(result.x).toBe(3); // 2 * 1 + 1
            expect(result.y).toBe(5); // 2 * 2 + 1
            expect(result.z).toBe(0); // 1 * 0 + 0
        });

        it("应该正确变换三维点", () => {
            const transform = new Transformation(2, 1, 2, 1, 2, 1);
            const point = new Position(1, 2, 3);
            const result = transform.transform(point);

            expect(result.x).toBe(3); // 2 * 1 + 1
            expect(result.y).toBe(5); // 2 * 2 + 1
            expect(result.z).toBe(7); // 2 * 3 + 1
        });

        it("应该支持缩放因子", () => {
            const transform = new Transformation(2, 1, 2, 1, 2, 1);
            const point = new Position(1, 2, 3);
            const result = transform.transform(point, 2);

            expect(result.x).toBe(6); // 2 * (2 * 1 + 1)
            expect(result.y).toBe(10); // 2 * (2 * 2 + 1)
            expect(result.z).toBe(14); // 2 * (2 * 3 + 1)
        });
    });

    describe("untransform 方法", () => {
        it("应该正确反向变换二维点", () => {
            const transform = new Transformation(2, 1, 2, 1, 1, 0);
            const point = new Position(3, 5, 0);
            const result = transform.untransform(point);

            expect(result.x).toBe(1); // (3 - 1) / 2
            expect(result.y).toBe(2); // (5 - 1) / 2
            expect(result.z).toBe(0); // (0 - 0) / 1
        });

        it("应该正确反向变换三维点", () => {
            const transform = new Transformation(2, 1, 2, 1, 2, 1);
            const point = new Position(3, 5, 7);
            const result = transform.untransform(point);

            expect(result.x).toBe(1); // (3 - 1) / 2
            expect(result.y).toBe(2); // (5 - 1) / 2
            expect(result.z).toBe(3); // (7 - 1) / 2
        });

        it("应该支持缩放因子", () => {
            const transform = new Transformation(2, 1, 2, 1, 2, 1);
            const point = new Position(6, 10, 14);
            const result = transform.untransform(point, 2);

            expect(result.x).toBe(1); // (6/2 - 1) / 2
            expect(result.y).toBe(2); // (10/2 - 1) / 2
            expect(result.z).toBe(3); // (14/2 - 1) / 2
        });
    });

    describe("transform 和 untransform 的组合", () => {
        it("应该能够还原原始点", () => {
            const transform = new Transformation(2, 1, 2, 1, 2, 1);
            const original = new Position(1, 2, 3);
            const transformed = transform.transform(original);
            const restored = transform.untransform(transformed);

            expect(restored.x).toBeCloseTo(original.x);
            expect(restored.y).toBeCloseTo(original.y);
            expect(restored.z).toBeCloseTo(original.z);
        });

        it("应该能够还原带缩放因子的原始点", () => {
            const transform = new Transformation(2, 1, 2, 1, 2, 1);
            const original = new Position(1, 2, 3);
            const scale = 2;
            const transformed = transform.transform(original, scale);
            const restored = transform.untransform(transformed, scale);

            expect(restored.x).toBeCloseTo(original.x);
            expect(restored.y).toBeCloseTo(original.y);
            expect(restored.z).toBeCloseTo(original.z);
        });
    });
});
