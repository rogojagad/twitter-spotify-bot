require("dotenv").config();
const authUtils = require("./auth/utils");
const axios = require("axios");
const trackUtils = require("./track/utils");

exports.getPlayedSong = async () => {
    const token = process.env.ACCESS_TOKEN;

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    setupInterceptors(axios);

    const result = await axios.get(
        `${process.env.API_BASE_URL}/currently-playing`,
        config
    );

    if (result.status === 200) {
        return trackUtils.buildResultData(result, config);
    } else {
        return trackUtils.buildNoResult();
    }
};

const setupInterceptors = async (axios) => {
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

                await authUtils.refreshAccessToken();

                originalRequest.headers[
                    "Authorization"
                ] = `Bearer ${process.env.ACCESS_TOKEN}`;

                return axios(originalRequest);
            }

            Promise.reject(error);
        }
    );
};
