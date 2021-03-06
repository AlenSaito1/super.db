import { DB } from '../index'

const db = new DB('mongodb://127.0.0.1:27017/?compressors=disabled&gssapiServiceName=mongodb', 'TEST')
db.on('ready', () => {
    console.log('CONNECTED!')
})

db.on('error', () => {
    console.log('ERRRRRRRRRR')
})