# Video Player Proof of Concept
This video player has following functionality:
- can play MPEG-DASH (using MSE API) and HLS (using hls.js).
- can switch quality
- has custom controls for play/pause, fast forward, volume change, seeking.

Tech stack:
- AngularJS
- Webpack
- Gulp
- NodeJS + Express
- hls.js
- MSE API
- Bootstrap + SASS
- x2js

To launch the app locally, please run the following commands:

From root folder:
- npm i

From client folder:
- npm i
- gulp build (calls webpack and then copies dist folder to public/app)

From root folder:
- npm start (starts node server)

Go to http://localhost:3000/
