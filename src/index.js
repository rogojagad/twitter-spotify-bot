require("dotenv").config();

const express = require("express");
const app = express();

const { URLSearchParams } = require("url");
const axios = require("axios");
const bodyParser = require("body-parser");
const querystring = require("querystring");

const authUtils = require("./auth/utils");
const requester = require("./requester");
const updater = require("./updater");

const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.disable("etag");

const redirectUrl = `${process.env.APP_HOST}/callback`;

app.get("/login", (_, res) => {
    const scope = "user-read-currently-playing user-read-playback-state";

    res.redirect(
        `${process.env.AUTH_BASE_URL}/authorize?` +
            querystring.stringify({
                client_id: process.env.CLIENT_ID,
                response_type: "code",
                redirect_uri: redirectUrl,
                scope: scope,
            })
    );
});

app.get("/callback", async (req, res) => {
    const code = req.query.code;
    const body = new URLSearchParams();
    body.append("grant_type", "authorization_code");
    body.append("code", code);
    body.append("redirect_uri", redirectUrl);

    const config = {
        headers: {
            Authorization: authUtils.generateBasicAuthHeaderContent(),
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };

    console.log(config);

    try {
        const result = await axios.post(
            `${process.env.AUTH_BASE_URL}/api/token`,
            body,
            config
        );
        const { data } = result;

        process.env.ACCESS_TOKEN = data["access_token"];
        process.env.REFRESH_TOKEN = data["refresh_token"];

        return res.redirect("/finish");
    } catch (error) {
        console.log(error.response.data);
    }
});

app.get("/finish", (_, res) => {
    if (!process.env.ACCESS_TOKEN) {
        return res
            .status(200)
            .json({ message: "What the hell are you doing here?" });
    }

    return res.status(200).json({ message: "Done :)" });
});

app.get("/played_song", async (_, res) => {
    if (!process.env.ACCESS_TOKEN) {
        return res.status(422).json({ message: "Environment not ready" });
    }

    const result = await requester.getPlayedSong();

    if (result.isPlaying) {
        await updater.tweet(result);
    }

    return res.status(200).json(result);
});

console.log(`Listening on ${port}`);
app.listen(port);
