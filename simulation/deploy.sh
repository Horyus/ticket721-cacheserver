#! /bin/bash

cd simulation/ticket721-contracts

echo "#1 Install Contracts Dependencies"
npm install

echo "#2 Deploy Contracts"
embark build
