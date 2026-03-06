from pathlib import Path

import pytest


@pytest.fixture
def boreholes_path() -> Path:
    return Path(__file__).parents[1] / "data" / "BoreholeLocations.csv"
