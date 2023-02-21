function deployBlaze() {
  cd libs/nrwl-blaze
  npm version patch 
  cd ../.. 
  nx build nrwl-blaze
  cd dist/libs/nrwl-blaze
  npm publish --access public
  echo "Nwrl Blaze deployed"
}



deployBlaze
