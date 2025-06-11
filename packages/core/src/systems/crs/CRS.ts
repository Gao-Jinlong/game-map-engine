import { ICoord, IPosition } from "@core/interfaces/ICoord";
import { IProjection } from "../projection";
import { ITransformation } from "../projection/Transformation";
import { Bounds } from "@core/entity/Bounds";
import { ICRS } from "./interface";

/**
 * 坐标参考系统
 * 分离坐标的投影（projection）和仿射变换（transformation），更好的解耦复用变换逻辑
 */
export abstract class CRS implements ICRS {
    private projection: IProjection;
    private transformation: ITransformation;
    private infinite: boolean = false;

    constructor(projection: IProjection, transformation: ITransformation) {
        this.projection = projection;
        this.transformation = transformation;
    }
    coordToPoint(coord: ICoord, zoom: number) {
        const projectedPoint = this.projection.project(coord),
            scale = this.scale(zoom);

        return this.transformation.transform(projectedPoint, scale);
    }

    // positionToCoord(position: IPosition, zoom: number) {
    //     const scale = this.scale(zoom);
    //     const untransformedPoint = this.transformation.untransform(
    //         position,
    //         scale
    //     );

    //     return this.projection.unproject(untransformedPoint);
    // }

    coordToPosition(coord: ICoord, zoom: number) {
        return this.projection.project(coord, zoom);
    }

    positionToCoord(position: IPosition, zoom: number) {
        return this.projection.unproject(position, zoom);
    }

    scale(zoom: number) {
        return 2 ** zoom;
    }

    zoom(scale: number) {
        return Math.log(scale) / Math.LN2;
    }

    getProjectedBounds(zoom: number) {
        if (this.infinite) {
            return null;
        }

        const b = this.projection.bounds;
        const s = this.scale(zoom);
        const min = this.transformation.transform(b.min, s);
        const max = this.transformation.transform(b.max, s);

        return Bounds.fromPositions(min, max);
    }

    // // @method wrapLatLng(latlng: LatLng): LatLng
    // // Returns a `LatLng` where lat and lng has been wrapped according to the
    // // CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
    // wrapLatLng(coord: ICoord) {
    // 	const lng = this.wrapLng ? Util.wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
    // 	    lat = this.wrapLat ? Util.wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
    // 	    alt = latlng.alt;

    // 	return new LatLng(lat, lng, alt);
    // },

    // // @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
    // // Returns a `LatLngBounds` with the same size as the given one, ensuring
    // // that its center is within the CRS's bounds.
    // // Only accepts actual `L.LatLngBounds` instances, not arrays.
    // wrapLatLngBounds(bounds) {
    // 	const center = bounds.getCenter(),
    // 	    newCenter = this.wrapLatLng(center),
    // 	    latShift = center.lat - newCenter.lat,
    // 	    lngShift = center.lng - newCenter.lng;

    // 	if (latShift === 0 && lngShift === 0) {
    // 		return bounds;
    // 	}

    // 	const sw = bounds.getSouthWest(),
    // 	    ne = bounds.getNorthEast(),
    // 	    newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift),
    // 	    newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);

    // 	return new LatLngBounds(newSw, newNe);
    // }
}
