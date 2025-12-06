import { useEffect } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";
import { fromLonLat } from "ol/proj";

import type { MapaApiProps } from "@/domain/entities/mapaprops";

export default function MapaApi({ hospitals }: MapaApiProps) {
  useEffect(() => {
    const features = hospitals.map((hospital) => {
      const marker = new Feature({
        geometry: new Point(fromLonLat([
          hospital.coordinates.x,
          hospital.coordinates.y,
        ])),
      });

      marker.setStyle(
        new Style({
          image: new Icon({
            src: "/marker.png",
            scale: 0.1,
          }),
        })
      );

      return marker;
    });

    const markerLayer = new VectorLayer({
      source: new VectorSource({
        features,
      }),
    });

    const map = new Map({
      target: "map",
      layers: [
        new TileLayer({ source: new OSM() }),
        markerLayer,
      ],
      view: new View({
        center: fromLonLat([-34.8731, -7.11532]),
        zoom: 12,
      }),
    });

    return () => map.setTarget(undefined);
  }, [hospitals]);

  return <div id="map" className="w-full h-130 rounded-xl" />;
}
