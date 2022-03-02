#!/usr/bin/env bash

tsc
cp node_modules/vue/dist/vue.esm-bundler.js build/miniprogram_npm/vue.js
mkdir build/miniprogram_npm/@vue

cp -r weapp/* build