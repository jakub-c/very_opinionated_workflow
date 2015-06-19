#!/bin/bash
BOOTPATH="node_modules/bootstrap-sass/assets/stylesheets/bootstrap/*"
SASSLOCATION="app/sass/bootstrap/"

rm -rf $SASSLOCATION
mkdir $SASSLOCATION
cp -r $BOOTPATH $SASSLOCATION

printf "\033[32;1m Bootstrap files copied successfully \033[0m\n"