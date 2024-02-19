#!/bin/bash

function ask_yes_or_no(){
    # Test if there are enough arguments
    if [[ $# > 2 ]]; then
        exit 1
    fi

    local message="${1}"
    local y="y"
    local n="N"

    # defaults to no if not otherwise specified
    [[ $2 == "yes" ]] && local default="yes" && y="Y" && n="n" || local default="no"

    read -p "$message ([$y]es or [$n]o): "
    case $(echo $REPLY | tr '[A-Z]' '[a-z]') in
        y|yes) local response="yes" ;;
        *)     local response="no" ;;
    esac
    if [[ $response == $default ]] || [[ -z $REPLY ]]; then
        echo $default
    else
        echo $response
    fi
}

function ask(){
    # Test if there are enough arguments
    if [[ $# -ne 1 ]]; then
        exit 1
    fi

    local answer
    local real_answer=""

    while [[ "" == "$real_answer" ]]; do
        read -p "Please type in $1: " answer
        [[ "yes" == $(ask_yes_or_no "Is $answer you final answer?") ]] \
                && real_answer="$answer"
    done

    echo "$real_answer"
}


echo "Setting node to 14"
nvm use 14

echo "Listing existing tags..."
git tag --sort=taggerdate

TAG=""

while [[ "$TAG" == "" || ! "${TAG}" =~ ^v[0-9]+\.[0-9]+.[0-9]+(\-[0-9a-zA-Z\-]+)?$ ]]; do
  TAG=$(ask "What should be the new tag? (accepts v*.*.*[-...])")
done

MESSAGE=$(ask "Tag Message")

echo "Preparing Release... "
npm run prepare-release

if [[ $(git status --porcelain) ]]; then
  git add .
  git commit -m "after release preparation"
fi

npm version "$TAG"

git push && git push --tags



