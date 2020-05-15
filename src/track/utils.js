const axios = require("axios");

exports.getPlaylistName = async (endpoint, header) => {
    const result = await axios.get(endpoint, header);
    return result.data.name;
};

exports.buildResultData = async (result) => {
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
};
