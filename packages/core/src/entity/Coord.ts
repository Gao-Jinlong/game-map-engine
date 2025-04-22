import { ICoord, ICoordTuple } from "@core/interfaces/ICoord";

/**
 * 坐标
 *
 * 采用 [lon, lat]
 */
export class Coord implements ICoord {
    constructor(
        /**
         * longitude
         */
        public lon: number,
        /**
         * latitude
         */
        public lat: number,
        /**
         * altitude
         */
        public alt: number
    ) {}

    get tuple(): ICoordTuple {
        return [this.lon, this.lat, this.alt];
    }

    public static fromArray(array: ICoordTuple): Coord {
        const [lon, lat, alt] = array;

        return new Coord(lon, lat, alt);
    }

    [Symbol.toStringTag](): string {
        return `Coord(${this.lon}, ${this.lat}, ${this.alt})`;
    }

    clone(): ICoord {
        return new Coord(this.lon, this.lat, this.alt);
    }
}
