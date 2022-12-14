#!/usr/bin/env bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
# pnpm
# export PNPM_HOME="/home/tom/.local/share/pnpm"
# export PATH="$PNPM_HOME:$PATH"
node=16.13.0
echo "##    set nodejs version to:" $node;
nvm install $node
nvm use $node
echo "## install electron builder packages"
arch=debian
#sudo apt-get install build-essential clang libdbus-1-dev libgtk-3-dev \
#                       libnotify-dev libasound2-dev libcap-dev \
#                       libcups2-dev libxtst-dev \
#                       libxss1 libnss3-dev gcc-multilib g++-multilib curl \
#                       gperf bison python3-dbusmock openjdk-8-jre
# arch=archlinux
# sudo pacman -Syu base-devel clang libdbus gtk2 libnotify \
# libgnome-keyring alsa-lib libcap libcups libxtst \
# libxss nss gcc-multilib curl gperf bison \
# python2 python-dbusmock jdk8-openjdk
echo "##    delete node_modules"
rm -rf node_modules package-lock.json pnpm-lock.yaml
echo "##    update npm and pnpm"
#npm i -g npm 
echo "##    install global libs: electron electron-packager node-gyp gulp rollup"
#npm i -g electron-packager node-gyp gulp@^4.0.0
echo "##    install @electron/rebuild"
npm i -D @electron/rebuild
echo "##    install application packages"
npm i
npm run rebuild
# npm rebuild
# npm audit fix --force
echo "##    install app"
cd app
echo "##    delete node_modules"
rm -rf node_modules package-lock.json npm-lock.yaml
echo "##    install modules"
npm install
npm run rebuild
# npm rebuild
# npm audit fix --force
cd ../
echo "##    libraries installed"
node-gyp rebuild
gulp build
npm run dev & 
npm run start 
npm run build
