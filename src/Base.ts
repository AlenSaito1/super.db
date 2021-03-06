import { EventEmitter } from 'events'
import * as mongoose from 'mongoose'

export default class Base extends EventEmitter {

    dbURL: string
    connection: mongoose.Connection
    readyAt: Date
    states = [
        'DISCONNECTED',
        'CONNECTED',
        'CONNECTING',
        'DISCONNECTING'
    ]

    constructor(uri: string) {
        super()
        this.dbURL = uri   
        this.connection = this.create()

        this.connection.on('open', () => {
            this.readyAt = new Date()
            this.emit('ready')
        })

        this.connection.on('error', () => {
            this.emit('error')
        })
    }

    create() {
        return mongoose.createConnection(this.dbURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        })
    }

    state() {
        if (typeof this?.connection?.readyState !== "number") return "DISCONNECTED"
        return this.states[this.connection.readyState]
    }

    kill() {
        this.connection.close(true)
        this.readyAt = undefined
        this.dbURL = null
    }
}

