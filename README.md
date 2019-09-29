# <center>Drum Sequencer</center>

![Drum Sequencer screenshot](./src/assets/images/dm_screenshot.png)

[https://drumsequencer.jasonbelcher.dev](https://drumsequencer.jasonbelcher.dev/)

written with Vanilla.js & Howler.js

#### Notes

- Google - fair
- Edge - fair
- Firefox - bad :(

Performance varies depending on the browser. Stuttering and shaky tempo can be heard due to setInterval not being as accurate as I once thought. The amount of jitter is absolutely unacceptable in firefox and I had no idea how bad till later. I use chrome primarly in development. In hindsight I would have found a better solution. This project is my first foray into audio in the browser.

My next iteration will be done with the [webaudio api](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API).

## <center>Install Instructions</center>

```
git clone git@github.com:JasonBBelcher/drum-machine.git

npm i

// starts parcel dev server for development
npm run start:dev

// builds parcel bundle then makes it live with  http-server

npm start

```
