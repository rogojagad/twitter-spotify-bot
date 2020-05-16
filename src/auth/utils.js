require("dotenv").config();

const { URLSearchParams } = require("url");

exports.refreshAccessToken = async () => {
    const body = new URLSearchParams();
    body.append("grant_type", "refresh_token");
    body.append("refresh_token", process.env.REFRESH_TOKEN);

    const header = {
        headers: {
            Authorization: this.generateBasicAuthHeaderContent(),
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

exports.generateBasicAuthHeaderContent = () => {
    const authString = Buffer.from(
        `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString("base64");

    return `Basic ${authString}`;
};
