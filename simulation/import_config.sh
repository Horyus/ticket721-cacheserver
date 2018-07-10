#! /bin/bash

cp ./simulation/ticket721-contracts/chains.json ../ticket721-webapp/chains.json
cp -r ./simulation/ticket721-contracts/dist ../ticket721-webapp/
mv ./simulation/ticket721-contracts/.embark ../ticket721-webapp/
mv ./simulation/manifest.json ../ticket721-webapp/

