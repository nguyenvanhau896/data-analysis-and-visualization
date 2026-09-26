#!/usr/bin/env bash
set -e

git init
git add .
git commit -m "chore: initialize course project landing page"
git branch -M main

echo "Repository initialized."
echo "Next: create an empty GitHub repository, add it as origin, then push main."
