#! /bin/bash

cp ./simulation/ticket721-contracts/chains.json ../ticket721/chains.json
cp -r ./simulation/ticket721-contracts/dist ../ticket721/
mv ./simulation/ticket721-contracts/.embark ../ticket721/
mv ./simulation/manifest.json ../ticket721/

