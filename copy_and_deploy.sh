#!/bin/bash

cp ./dist/scripts/angular-adminui.js ../angular-adminui-bower/scripts/
cp ./dist/scripts/angular-adminui-tpl.js ../angular-adminui-bower/scripts/
cp ./dist/styles/angular-adminui.css ../angular-adminui-bower/styles/
cp ./dist/styles/fonts/* ../angular-adminui-bower/styles/fonts/
cp -r ./dist/images ../angular-adminui-page/
cp -r ./dist/styles ../angular-adminui-page/
cp -r ./dist/scripts ../angular-adminui-page/
cp -r ./dist/views ../angular-adminui-page/
cp -r ./dist/index.html ../angular-adminui-page/
git commit -a
git push
commit_version=`git show |sed 'q'|awk '{print $2}'`
git -C ../angular-adminui-bower commit -a -m 'release by ec3s/angular-adminui@'$commit_version
git -C ../angular-adminui-bower push
git -C ../angular-adminui-page commit -a -m 'release by ec3s/angular-adminui@'$commit_version
git -C ../angular-adminui-page push
