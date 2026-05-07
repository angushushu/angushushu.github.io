---
title: Build & Publish a Python Package
date: 2024-10-06 20:28:00
slug: build-publish-a-python-package
tags:
  - skill
---
## Build

Prepare setup.py
An example:

```python
from setuptools import find_packages, setup
  
with open("README.md", "r") as f:  
    long_description = f.read()  
  
setup(  
    name='<package>',  
    version='0.0.1',  # update this if you are updating new version
    description='',  
    packages=find_packages(include=['<package>', '<package>.*']),  
    long_description=long_description,  
    long_description_content_type="text/markdown",  
    url='',  
    author='',  
    author_email='',  
    license='GPL-3.0',  
    classifiers=[  
        "Programming Language :: Python :: 3",  
        "License :: OSI Approved :: GNU General Public License v3 (GPLv3)",  
        "Operating System :: OS Independent",  
    ],  
    install_requires=[  
        'pandas',   
        'numpy' 
    ],  
    extras_require={  
        'all': [],  
        'dev': ['pytest>=7.0', 'twine>=4.0.2']  
    },  
    python_requires='>=3.6',  
)
```

If you have previous build, remember to clean them up by
```bash
rm -rf dist build *.egg-info
```

run

```bash
python -m build # recommended, requires "build" package
# or
python setup.py bdist_wheel sdist
```

(optional) to test package locally

```bash
pip install .
```


## Publish

Setup info on [test.pypi](https://test.pypi.org) or [pypi](https://pypi.org) if not yet. The API key for publishing can be found there.

check:

```python
twine check dist/* # requires "twine" package
```

publish to test.pypi:

```python
twine upload -r testpypi dist/*
```

publish to pypi:

```python
twine upload dist/*
```

---
For more detail check [Youtube tutorial](https://www.youtube.com/watch?v=5KEObONUkik&t=918s)
