import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Proj {
    interface CRSOptions {
      origin?: [number, number];
      transformation?: L.Transformation;
      scales?: number[];
      resolutions?: number[];
      bounds?: L.Bounds;
    }

    class CRS extends L.CRS {
      constructor(code: string, proj4def: string, options?: CRSOptions);
    }

    class GeoJSON extends L.GeoJSON {
      constructor(geojson?: GeoJSON.GeoJsonObject, options?: L.GeoJSONOptions);
    }
  }
}

declare module 'proj4leaflet' {
  export {};
}
