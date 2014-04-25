#!/bin/bash

git -C ../angular-adminui-bower pull 
git -C ../angular-adminui-page pull

cp ./dist/scripts/angular-adminui.js ../angular-adminui-bower/scripts/
cp ./dist/scripts/angular-adminui.map ../angular-adminui-bower/scripts/
cp ./dist/styles/angular-adminui.css ../angular-adminui-bower/styles/
cp ./dist/styles/fonts/* ../angular-adminui-bower/styles/fonts/
cp -r ./dist/* ../angular-adminui-page/
git commit -a
git push
commit_version=`git show |sed 'q'|awk '{print $2}'`
git -C ../angular-adminui-bower add -A
git -C ../angular-adminui-bower commit -a -m 'release by ec3s/angular-adminui@'$commit_version
git -C ../angular-adminui-bower push
git -C ../angular-adminui-page add -A
git -C ../angular-adminui-page commit -a -m 'release by ec3s/angular-adminui@'$commit_version
git -C ../angular-adminui-page push
