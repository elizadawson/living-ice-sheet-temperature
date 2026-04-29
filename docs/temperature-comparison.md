# Temperature comparison: pure ice vs. conductivity

Compare the along-track temperature distributions for the ASE attenuation dataset under the two computation modes. The two parquet files are produced by `livist temperature` (pure ice) and `livist temperature --mode conductivity`.


```python
import matplotlib.pyplot as plt
import pandas
```


```python
pure_ice = pandas.read_parquet("../data/temperature-ase-pure-ice.parquet")["temperature"]
conductivity = pandas.read_parquet("../data/temperature-ase-conductivity.parquet")["temperature"]
pure_ice.describe(), conductivity.describe()
```




    (count    1.642011e+06
     mean     2.539929e+02
     std      1.148244e+01
     min      2.098631e+01
     25%      2.528346e+02
     50%      2.542231e+02
     75%      2.568362e+02
     max      2.753755e+02
     Name: temperature, dtype: float64,
     count    1.642011e+06
     mean     2.553844e+02
     std      1.415000e+01
     min      8.812298e+00
     25%      2.505851e+02
     50%      2.542477e+02
     75%      2.607806e+02
     max      3.145590e+02
     Name: temperature, dtype: float64)




```python
fig, ax = plt.subplots(figsize=(10, 6))
bins = 100
hist_range = (-40, 20)
ax.hist(pure_ice - 273.15, bins=bins, range=hist_range, alpha=0.5, label="pure ice", color="#3182ce")
ax.hist(conductivity - 273.15, bins=bins, range=hist_range, alpha=0.5, label="conductivity", color="#38a169")
ax.set_xlim(*hist_range)
ax.set_xlabel("temperature [°C]")
ax.set_ylabel("count")
ax.set_title("ASE along-track temperature: pure ice vs. conductivity")
ax.legend()
plt.tight_layout()
plt.show()
```


    
![png](temperature-comparison_files/temperature-comparison_3_0.png)
    

