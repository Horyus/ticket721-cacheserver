#! /bin/bash

cd simulation/ticket721-contracts

echo "#1 Install Contracts Dependencies"
npm install

echo "#2 Deploy Contracts"
embark build

echo "#2 Run tests as population method"
env BC_URL=http://localhost:8545 DIST_PATH=`pwd`/dist npm test
