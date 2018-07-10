#! /bin/bash

cd simulation/ticket721-contracts

echo "#1 Run tests as population method"
env BC_URL=http://localhost:8545 DIST_PATH=`pwd`/dist npm test

