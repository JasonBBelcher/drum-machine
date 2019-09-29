# <center>Drum Sequencer</center>

### laptop view

![Drum Sequencer screenshot1](./src/assets/images/dm_screenshot.png)

### ipad portrait view

![Drum Sequencer screenshot2](./src/assets/images/dm_ipad_portrait_view.png)

### ipad landscape view

![Drum Sequencer screenshot3](./src/assets/images/dm_ipad_landscape_view.png)

### mobile portrait view

![Drum Sequencer screenshot4](./src/assets/images/dm_mobileview.png)

[https://drumsequencer.jasonbelcher.dev](https://drumsequencer.jasonbelcher.dev/)

### Libraries & Tools

- [flexbox grid](http://flexboxgrid.com/)
- [Howler](https://howlerjs.com/)
- [parceljs](https://parceljs.org/)

#### Audio Browser Support

- Google - fair
- Edge - fair
- Firefox - bad :(

Performance varies depending on the browser. Stuttering and shaky tempo can be heard due to setInterval not being as accurate as I once thought. The amount of jitter is absolutely unacceptable in firefox and I had no idea how bad till later. In hindsight I would have found a better solution. This project is my first foray into audio in the browser.

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
