
import { Connection, Schema } from 'mongoose'

const Default = new Schema({
    ID: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    data: {
        type: Schema.Types.Mixed,
        required: true
    }
})

export default (conn: Connection) => {
    return conn.model("JSON", Default)
}