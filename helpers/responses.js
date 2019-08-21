module.exports.classic = (error, data, message = '') => ({
    error,
    data,
    message,
});
module.exports.withEmoticons = (error, data, emoticons) => ({
    error,
    data,
    emoticons,
});
