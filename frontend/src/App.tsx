import { useEffect, useRef } from "react";
import { Box, Heading } from "@chakra-ui/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "proj4leaflet";

const EPSG3031 = new L.Proj.CRS(
  "EPSG:3031",
  "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
  {
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128],
    origin: [-4194304, 4194304],
    bounds: L.bounds([-4194304, -4194304], [4194304, 4194304]),
  },
);

function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      crs: EPSG3031,
      center: [-90, 0],
      zoom: 0,
      maxZoom: 3,
      minZoom: 0,
      attributionControl: true,
    });

    fetch(`${import.meta.env.BASE_URL}quantartica-simple-basemap.json`)
      .then((res) => res.json())
      .then((geojson) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (L.Proj as any).GeoJSON(geojson, {
          attribution: "Norwegian Polar Institute's Quantarctica package",
          style: (feature?: GeoJSON.Feature) => {
            const category = feature?.properties?.Category ?? "";
            let fillColor = "#dedcd2";
            if (category === "Ice shelf" || category === "Ice tongue") {
              fillColor = "#cfe1eb";
            } else if (category === "Land" || category === "Rumple") {
              fillColor = "#f0f0f0";
            } else if (category === "Ocean") {
              fillColor = "#a3bdd1";
            }
            return {
              fillColor,
              stroke: false,
              fillOpacity: 1,
            };
          },
        }).addTo(map);
      });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <Box as="header" padding="4" bg="blue.600" color="white">
        <Heading size="lg">Living Ice Temperature</Heading>
      </Box>
      <Box flex="1" ref={containerRef}></Box>
    </Box>
  );
}

export default App;
