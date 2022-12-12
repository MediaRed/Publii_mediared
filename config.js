#!/usr/bin/env bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

echo "##    set nodejs version to 14"
nvm use 14
echo "##    install global libs: electron electron-packager node-gyp gulp"
pnpm i -D @electron/rebuild
pnpm i -g electron-packager node-gyp gulp
echo "##    install application packages"
npm i
cd app
npm i
cd ../
echo "##    libraries installed"
node-gyp rebuild
npm run tart

