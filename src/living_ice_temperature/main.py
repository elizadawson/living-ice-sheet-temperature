from pathlib import Path

import click

from .models import Borehole


@click.group()
def cli() -> None:
    """Data processing for Living Ice Temperature."""


@cli.command()
@click.argument("path", type=click.Path(exists=True, path_type=Path))
def boreholes(path: Path) -> None:
    """Process borehole data into a FeatureCollection"""
    boreholes = Borehole.from_csv_path(path)
    features = Borehole.to_feature_collection(boreholes)
    click.echo(features.model_dump_json(indent=2))


if __name__ == "__main__":
    cli()
