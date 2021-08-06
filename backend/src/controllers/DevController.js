const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },

    async store(request, response) {
        const { github_username, techs, latitude, longitude } = request.body

        let dev = await Dev.findOne({ github_username });
        console.log(dev);

        if (!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);

            let { name = login, avatar_url, bio } = apiResponse.data;

            if (!name) {
                name = apiResponse.data.login
            }

            const techsArray = parseStringAsArray(techs);

            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };

            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            )

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }

        return response.json(dev);
    },

    async update(request, response) { //alterar os dados de um dev
        const { _id } = request.query;
        let dev = await Dev.findById({ _id });

        const { name = dev.name, avatar_url = dev.avatar_url, bio = dev.bio, techs, latitude = dev.latitude, longitude = dev.longitude } = request.body;

        let techsArray;
        typeof techs === 'string' ? techsArray = parseStringAsArray(techs) : techsArray = dev.techs;

        const location = {
            type: 'Point',
            coordinates: [longitude, latitude],
        };

        dev = await Dev.update({
            name,
            avatar_url,
            bio,
            techs: techsArray,
            location,
        });

        return response.json("Changes made with success!");
    },

    async destroy(request, response) {
        const user_id = request.params.id;
        console.log(request.params.id);

        const devDestroy = await Dev.findByIdAndDelete(user_id);

        return response.json("User deleted!");
    },
};


