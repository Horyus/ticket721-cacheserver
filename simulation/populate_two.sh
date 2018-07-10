#! /bin/bash

cd simulation/

echo "#1 Run Verfied populator"
env BC_URL=http://localhost:8545 DIST_PATH=`pwd`/ticket721-contracts/dist jest -c jestrc.json
