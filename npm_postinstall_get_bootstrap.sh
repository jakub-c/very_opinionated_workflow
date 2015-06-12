#!/bin/bash
BOOTPATH="node_modules/bootstrap-sass/assets/stylesheets/bootstrap/*"
SASSLOCATION="app/sass/bootstrap/"

rm -rf $SASSLOCATION
mkdir $SASSLOCATION
cp -r $BOOTPATH $SASSLOCATION

printf "\033[32;1m Bootstrap files copied successfully \033[0m\n"

#initially I wanted to pull all files from github, but turned out there's too many
# BOOTPATH="https://raw.githubusercontent.com/twbs/bootstrap-sass/master/assets/stylesheets/bootstrap"
# SASSLOCATION="app/sass/bootstrap"

# rm -rf $SASSLOCATION
# mkdir $SASSLOCATION

# curl $BOOTPATH/_variables.scss > $SASSLOCATION/_variables.scss
# curl $BOOTPATH/mixins.scss     > $SASSLOCATION/_mixins.scss
# curl $BOOTPATH/_normalize.scss > $SASSLOCATION/_normalize.scss
# curl $BOOTPATH/_scaffolding.scss > $SASSLOCATION/_scaffolding.scss
# curl $BOOTPATH/_grid.scss > $SASSLOCATION/_grid.scss
# curl $BOOTPATH/_utilities.scss > $SASSLOCATION/_utilities.scss
# curl $BOOTPATH/_responsive-utilities.scss > $SASSLOCATION/_responsive-utilities.scss
