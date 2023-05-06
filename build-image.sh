#!/bin/bash
set -e -u -o pipefail

VERSION=latest

if [ $# -ge 1 ]; then
  VERSION=$1
fi

docker build . -t wechat-midjourney:${VERSION}

docker tag wechat-midjourney:${VERSION} novicezk/wechat-midjourney:${VERSION}
docker push novicezk/wechat-midjourney:${VERSION}