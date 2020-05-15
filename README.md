# Twitter Spotify Bot

A bot that will tweet about my current played song on Spotify along with the artists', album's and playlist's information when triggered. I create a [Telegram Bot](https://github.com/rogojagad/telegram-spotify-bot) that act as the client to trigger this bot to hit the Spotify API to get the track data and then make a tweet about the song using Twitter API.



## Installation

Use the package manager [npm](https://www.npmjs.com/) to install the required package.

```bash
npm install
```
Then copy the `.env.example` then rename it to `.env`. With the content as follows:
* **APP_HOST** : The hostname of this app, it can varies depends on where you deploy it (Heroku, Digital Ocean, Azure etc). For local development purpose just set it to `http://localhost:{port number you are using}`.
* **AUTH_BASE_URL** : The base URL used to do authentication for this app to Spotify.
* **API_BASE_URL** : The base URL for Spotify API
* **CLIENT_ID** : The client ID generated when you register this app to Spotify.
* **CLIENT_SECRET** : The client secret generated when you register this app to Spotify.
* **TWITTER_API_KEY** : Twitter API key generated when you create your bot on Twitter.
* **TWITTER_API_SECRET** : Twitter API secret key generated when you create your bot on Twitter.
* **TWITTER_ACCESS_TOKEN** : Twitter access token generated when you create your bot on Twitter.
* **TWITTER_SECRET_TOKEN** : Twitter secret token generated when you create your bot on Twitter.


## 3rd Party API Used
* [Spotify Developer API](https://developer.spotify.com/) - Used to get my currently played song along with its artist's, album's and playlist's data.
* [Twitter Developer API](https://developer.twitter.com/en) - To programatically make a tweet about my currently played song.

## Contributing
Pull requests and any suggestions are welcome. Although it is functional, need more works to clean up the code.

