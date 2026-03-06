from pathlib import Path

from living_ice_temperature.models import Borehole


def test_boreholes(boreholes_path: Path) -> None:
    boreholes = Borehole.from_csv_path(boreholes_path)
    Borehole.to_feature_collection(boreholes)
