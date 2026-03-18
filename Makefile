GDAL ?= gdal

ALL: frontend/public/boreholes.json data/temperature-pure-ice-wgs84.parquet data/temperature-pure-ice.pmtiles

frontend/public/boreholes.json:
	uv run list boreholes > $@

data/temperature-pure-ice-wgs84.parquet:
	mkdir -p $(dir $@)
	uv run list \
	    temperature --to-wgs84 \
		https://data.source.coop/englacial/ice-sheet-temperature/AttenuationRateData/depth-avg-attenuation-ASE.txt \
		$@

data/temperature-pure-ice-wgs84.fgb: data/temperature-pure-ice-wgs84.parquet
	$(GDAL) vector convert $< $@

data/temperature-pure-ice.pmtiles: data/temperature-pure-ice-wgs84.fgb
	tippecanoe -o $@ $<

.PRECIOUS: data/temperature-pure-ice-wgs84.fgb
