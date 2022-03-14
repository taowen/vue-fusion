# Architecture

* renderer: client/server shared vue3 renderer
* serverRender: render in server side, does not integrate with networking to serve page or code
* client: render and interact in client side, does not integrate with networking to download server page or code

vue-fusion-weapp will integrate client and weapp as a complete miniprogram, serverRender need to be manually integrated with vite and CI/CD
