const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");

class OpenAiManager {
    constructor(app) {
        this.app = app
        this.openai
    }

    async connect() {
        const configuration = new Configuration({
            apiKey: this.app.config.properties.openai.apiKey,
        });
        this.openai = new OpenAIApi(configuration);
    }

    async makeImage(text, number = 1) {
        try {
            const res = await axios({
                url: 'https://api.openai.com/v1/images/generations',
                method: 'POST',
                responseType: 'application/json',
                headers: {
                    'Authorization': `bearer ${this.app.config.properties.openai.apiKey}`
                },
                data: {
                    'prompt': text,
                    'n': number,
                    'size': '1024x1024'
                }
            })
            return res.data
        }catch (e) {
            const res = await JSON.parse(e.response.data)
            return { "error": res.error.message }
        }
    }
}

module.exports = OpenAiManager
