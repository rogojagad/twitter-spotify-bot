const { config } = require("./../config");
const Twitter = require("twitter");
const twitterClient = new Twitter(config);
const emoji = require("node-emoji");

exports.tweet = async (data) => {
    const message = this.constructMessage(data);

    await twitterClient.post("statuses/update", {
        status: message,
    });
};

exports.constructMessage = (data) => {
    const {
        album,
        albumUrl,
        artistsNames,
        title,
        playlistUrl,
        playlistName,
    } = data;

    let message = emoji.get("notes") + " Now Playing: ";
    message += title + " - " + artistsNames + "\n\n";

    if (playlistUrl) {
        message += emoji.get("radio") + " Playlist: ";
        message += playlistName + "\n" + playlistUrl;
        return message;
    } else {
        message += emoji.get("radio") + " Album: ";
        message += album + "\n" + albumUrl;

        return message;
    }
};
