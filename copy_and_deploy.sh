#!/bin/bash

cp ./dist/scripts/angular-adminui.js ../angular-adminui-bower/scripts/

cp ./dist/styles/angular-adminui.css ../angular-adminui-bower/styles/
git commit -a
commit_version=`git show |sed 'q'|awk '{print $2}'`
git -C ../angular-adminui-bower commit -a -m 'release by ec3s/angular-adminui@'$commit_version
git -C ../angular-adminui-bower push
