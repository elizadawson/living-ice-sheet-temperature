import { useEffect, useRef } from "react";
import { Box, Circle, HStack, Text, VStack } from "@chakra-ui/react";
import L from "leaflet";
import { useBasemap, useBoreholes } from "../hooks/usePublic";

const EPSG3031 = new L.Proj.CRS(
  "EPSG:3031",
  "+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs",
  {
    resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16],
    origin: [-4194304, 4194304],
    bounds: L.bounds([-4194304, -4194304], [4194304, 4194304]),
  },
);

const COLOR_TEMPERATURE = "#3182ce";
const COLOR_TEMPERATURE_CHEMISTRY = "#38a169";
const COLOR_TEMPERATURE_GRAIN_SIZE = "#d69e2e";
const COLOR_ALL = "#e53e3e";

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <HStack gap="2">
      <Circle size="12px" bg={color} />
      <Text fontSize="xs">{label}</Text>
    </HStack>
  );
}

export default function Map() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const basemapResult = useBasemap();
  const boreholes = useBoreholes();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    mapRef.current = L.map(containerRef.current, {
      crs: EPSG3031,
      center: [-90, 0],
      zoom: 0,
      maxZoom: 9,
      minZoom: 0,
      attributionControl: true,
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !basemapResult.data) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layer = new (L.Proj as any).GeoJSON(basemapResult.data, {
      attribution: "Norwegian Polar Institute's Quantarctica package",
      pane: "tilePane",
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
    }).addTo(mapRef.current);

    return () => {
      layer.remove();
    };
  }, [basemapResult.data]);

  useEffect(() => {
    if (!mapRef.current || !boreholes.data) return;

    const layer = new L.GeoJSON(boreholes.data, {
      pointToLayer: (feature, latlng) => {
        const { has_chemistry, has_grain_size } = feature.properties;
        let fillColor = COLOR_TEMPERATURE;
        if (has_chemistry && has_grain_size) {
          fillColor = COLOR_ALL;
        } else if (has_chemistry) {
          fillColor = COLOR_TEMPERATURE_CHEMISTRY;
        } else if (has_grain_size) {
          fillColor = COLOR_TEMPERATURE_GRAIN_SIZE;
        }
        return new L.CircleMarker(latlng, {
          radius: 6,
          fillColor,
          color: "#fff",
          weight: 1,
          fillOpacity: 0.8,
        }).bindTooltip(feature.properties.name);
      },
    }).addTo(mapRef.current);

    return () => {
      layer.remove();
    };
  }, [boreholes.data]);

  return (
    <Box flex="1" position="relative">
      <Box ref={containerRef} position="absolute" inset="0" />
      <VStack
        position="absolute"
        bottom="6"
        right="3"
        zIndex="1000"
        bg="white"
        p="3"
        borderRadius="md"
        shadow="md"
        gap="1"
        alignItems="flex-start"
      >
        <Text fontWeight="bold" fontSize="sm">
          Boreholes
        </Text>
        <LegendItem color={COLOR_TEMPERATURE} label="Temperature" />
        <LegendItem
          color={COLOR_TEMPERATURE_CHEMISTRY}
          label="Temperature + chemistry"
        />
        <LegendItem
          color={COLOR_TEMPERATURE_GRAIN_SIZE}
          label="Temperature + grain size"
        />
        <LegendItem color={COLOR_ALL} label="All three" />
      </VStack>
    </Box>
  );
}
