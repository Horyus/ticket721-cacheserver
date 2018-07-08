#! /bin/bash

echo "#1 Start API"
jq ".deployedAddress" ./simulation/ticket721-contracts/dist/contracts/Ticket721Hub.json
