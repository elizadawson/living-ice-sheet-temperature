GDAL ?= gdal

ALL: frontend/public/boreholes.json data/temperature-pure-ice-wgs84.parquet data/temperature-pure-ice.pmtiles

frontend/public/boreholes.json:
	uv run livist boreholes > $@

data/temperature-pure-ice-wgs84.parquet:
	mkdir -p $(dir $@)
	uv run livist \
	    temperatures --to-wgs84 \
		https://data.source.coop/englacial/ice-sheet-temperature/AttenuationRateData/depth-avg-attenuation-ASE.txt \
		$@

data/temperature-pure-ice-wgs84.fgb: data/temperature-pure-ice-wgs84.parquet
	$(GDAL) vector convert $< $@

data/temperature-pure-ice.pmtiles: data/temperature-pure-ice-wgs84.fgb
	tippecanoe -zg -o $@ $<

sync: data/temperature-pure-ice.pmtiles
	aws s3 cp $< s3://us-west-2.opendata.source.coop/englacial/ice-sheet-temperature/temperature/temperature-pure-ice.pmtiles

.PRECIOUS: data/temperature-pure-ice-wgs84.fgb
