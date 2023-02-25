const express = require('express')

class ExpressManager {
    constructor(app) {
        this.app = app
        this.express = express()
        this.router = express.Router()
    }

    initialize() {
        this.router.post('/lobbyClosed', this.lobbyClosedAlert.bind(this))

        this.express.use(express.json())
        this.express.use('/api', this.router)
        this.express.set('json spaces', 2)

        this.express.listen(this.app.config.properties.express.port, () => {
            console.log(`API online and is running on http://localhost:${this.app.config.properties.express.port}/api/`)
        })
    }
    async lobbyClosedAlert(request, response) {
        const username = request.body.username
        let userID
        switch (true) {
            case username === 'Alamai':
                userID = '296256874976903168'
                break
            case username === 'iFyller':
                userID = '352854787068395522'
                break
        }

        const user = await this.app.discord.client.users.fetch(userID)
        await user.send('Server restarted!')
        return response.status(200).json({
            success: true,
            response: 'Still alive'
        })
    }

}

module.exports = ExpressManager
