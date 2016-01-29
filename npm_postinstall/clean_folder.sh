#!/bin/bash

function repo_setup_question {
  read -p $'\033[33;1m Are you starting a new project? [Y/n]? \033[m\n' choice
  case "$choice" in 
    y|Y ) 
        clean_up_repo;;
    n|N ) return;;
    * ) echo "Invalid response, choose [Y/n] "
        repo_setup_question;;
  esac
}

# remove .git repo files and README if it's a new project
function clean_up_repo {
  echo "Old git repo files removed"
  rm -rf .git

  echo ""
  echo -e "\033[33;1m Provie a project name for README.md title: \033[m\n"
  read projectName
  rm README.md
  echo \#$projectName > README.md

  # clean up postinstall package.json field
  node npm_postinstall/clean_postinstall.js

  vagrant_keep_question
}

# Vagrant
function vagrant_keep_question {
  echo ""
  echo -e "\033[33;1m Do you need a Vagrant file [y/n]? \033[m\n"
  read choice
  case "$choice" in 
    y|Y ) return;;
    n|N ) 
        echo "Removing Vagrantfile"
        rm Vagrantfile;;
    * ) echo "Invalid response, choose [Y/n] "
        vagrant_keep_question;;
  esac
}

# init setup function
echo ""
echo ""
repo_setup_question