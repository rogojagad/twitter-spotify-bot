require("dotenv").config();
const axios = require("axios");
const { URLSearchParams } = require("url");

exports.getPlayedSong = async () => {
    // axios.interceptors.request.use(
    //     (config) => {
    //         console.log("Setting headers");
    //         const token = process.env.ACCESS_TOKEN;
    //         config.headers["Authorization"] = `Bearer ${token}`;
    //         return config;
    //     },
    //     (error) => {
    //         Promise.reject(error);
    //     }
    // );
    const token = process.env.ACCESS_TOKEN;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            const errorResponse = error.response;
            const status = errorResponse.status;
            const message = errorResponse.data.error.message;

            if (
                status === 401 &&
                message === "The access token expired" &&
                !originalRequest._retry
            ) {
                console.log(message);
                console.log("refreshing access token");

                await this.refreshAccessToken();

                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${process.env.ACCESS_TOKEN}`;

                return axios(originalRequest);
            }

            Promise.reject(error);
        }
    );

    const result = await axios.get(
        `${process.env.API_BASE_URL}/currently-playing`,
        config
    );

    if (result.status === 200) {
        const data = result.data;
        let playlistUrl = undefined;
        let playlistHref = undefined;
        let playlistName = undefined;
        const { context } = data;

        if (context) {
            playlistUrl = context["external_urls"]["spotify"];
            playlistHref = context.href;
            playlistName = await this.getPlaylistName(playlistHref, config);
        }

        const { item } = data;
        const { album } = item;
        const { artists } = item;
        const { name } = item;
        const isPlaying = data["is_playing"];

        let artistNames = "";
        const count = artists.length;

        artists.forEach((artist, index) => {
            if (index !== count - 1) {
                artistNames += artist.name + ", ";
            } else {
                artistNames += artist.name;
            }
        });

        return {
            album: album.name,
            albumCover: album.images[0].url,
            albumUrl: album["external_urls"]["spotify"],
            artistsNames: artistNames,
            isPlaying: isPlaying,
            playlistUrl: playlistUrl,
            playlistName: playlistName,
            title: name,
        };
    }
};

exports.getPlaylistName = async (endpoint, header) => {
    const result = await axios.get(endpoint, header);
    return result.data.name;
};

exports.refreshAccessToken = async () => {
    const body = new URLSearchParams();
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", process.env.REFRESH_TOKEN);

    const header = {
        headers: {
            Authorization: `Basic ${Buffer.from(
                process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
            ).toString("base64")}`,
        },
    };

    try {
        const result = await axios.post(
            `${process.env.AUTH_BASE_URL}/api/token`,
            body,
            header
        );

        const { data } = result;
        process.env.ACCESS_TOKEN = data.access_token;

        console.log("New access token: ", process.env.ACCESS_TOKEN);
    } catch (error) {
        console.log(error);
    }
};
