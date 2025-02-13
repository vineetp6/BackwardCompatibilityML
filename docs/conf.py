# Copyright (c) Microsoft Corporation.
# Licensed under the MIT License.

# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
import os
import sys
sys.path.insert(0, os.path.abspath('../backwardcompatibilityml'))


# -- Project information -----------------------------------------------------

project = 'BackwardCompatibilityML'
copyright = '2021, Microsoft'
author = 'Besmira Nushi, Ece Kamar, Xavier Fernandes, Nicholas King, Kathleen Walker, Juan Lema, Megha Srivastava, Gagan Bansal, Dean Carignan'

# The full version, including alpha/beta/rc tags
release = '1.4.2'


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    'sphinx.ext.autodoc',
    'sphinx.ext.napoleon',
    'recommonmark'
    ]

# Add any paths that contain templates here, relative to this directory.
templates_path = ['_templates']

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# This value contains a list of modules to be mocked up.
# This is useful when some external dependencies are not met at build time 
# and break the building process. You may only specify the root package of 
# the dependencies themselves and omit the sub-module
autodoc_mock_imports = ["tensorflow"]

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_rtd_theme'

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ['_static']

# Change Read the Docs master file to index.rst
master_doc = 'index'
