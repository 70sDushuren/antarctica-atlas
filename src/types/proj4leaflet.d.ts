import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Proj {
    interface CRSOptions {
      origin?: [number, number];
      transformation?: L.Transformation;
      scales?: number[];
      resolutions?: readonly number[] | number[];
      bounds?: L.Bounds;
    }

    type CRS = L.CRS;
    const CRS: new (code: string, proj4def: string, options?: CRSOptions) => L.CRS;

    class GeoJSON extends L.GeoJSON {
      constructor(geojson?: GeoJSON.GeoJsonObject, options?: L.GeoJSONOptions);
    }
  }
}

declare module 'proj4leaflet' {
  export {};
}
