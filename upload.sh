#!/bin/bash

rsync -zr --delete ./dist/ skrazzo@skrazzo.xyz:/var/www/portfolio-astro
