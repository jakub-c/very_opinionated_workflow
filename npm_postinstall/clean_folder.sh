#!/bin/bash

function remove_repo {
  read -p "Do you want to remove .git files (confirmation recommented) (yes/no)?" choice
  case "$choice" in 
    yes|YES ) 
        echo "Old git repo files removed"
        rm -rf .git;;
    no|NO ) return;;
    * ) echo "Invalid response, choose (yes/no)"
        remove_repo;;
  esac
}

#remove git repo files for a clean slate
remove_repo

#remove readme
echo "removing old README.md"
rm README.md