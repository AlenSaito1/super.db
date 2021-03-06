import Base from './Base'
import Schema from './Schema'
import Util from '../utils'
import { Model } from 'mongoose'

class Database extends Base {

    schema: Model<any>
    constructor(uri: string, name: string) {
        super(uri) 
        this.schema = Schema(this.connection)
    }

    async set(key: string, value: any) {
        if (!Util.isKey(key)) throw new Error("Invalid key specified!")
        if (!Util.isValue(value)) throw new Error("Invalid value specified!")
        const parsed = Util.parseKey(key)
        let raw = await this.schema.findOne({
            ID: parsed.key
        })
        if (!raw) {
            let data = new this.schema({
                ID: parsed.key,
                data: parsed.target ? Util.setData(key, {}, value) : value
            })
            await data.save()
                .catch(e => {
                    return this.emit("error", e)
                })
            return data.data
        } else {
            raw.data = parsed.target ? Util.setData(key, Object.assign({}, raw.data), value) : value
            await raw.save()
                .catch(e => {
                    return this.emit("error", e)
                })
            return raw.data
        }
    }

    async delete(key: string) {
        if (!Util.isKey(key)) throw new Error("Invalid key specified!")
        const parsed = Util.parseKey(key)
        const raw = await this.schema.findOne({ ID: parsed.key })
        if (!raw) return false
        if (parsed.target) {
            let data = Util.unsetData(key, Object.assign({}, raw.data))
            if (data === raw.data) return false
            raw.data = data
            raw.save().catch(e => this.emit("error", e))
            return true
        } else {
            await this.schema.findOneAndDelete({ ID: parsed.key })
                .catch(e => {
                    return this.emit("error", e)
                })
            return true
        }
    }

    async get(key: string) {
        if (!Util.isKey(key)) throw new Error("Invalid key specified!");
        const parsed = Util.parseKey(key);

        let get = await this.schema.findOne({ ID: parsed.key })
            .catch(e => {
                return this.emit("error", e);
            });
        if (!get) return null;
        let item;
        if (parsed.target) item = Util.getData(key, Object.assign({}, get.data));
        else item = get.data;
        return item !== undefined ? item : null;
    }
    
}

