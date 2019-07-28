/**
 * Created by dannyyassine
 */
class Model {
    constructor(model) {

    }

    static decode(model) {
        if (model instanceof Array) {
            return model.map(mod => {
                return new this(mod);
            })
        } else {
            return new this(model);
        }
    }

    static encore(model) {
        return JSON.stringify(model);
    }
}

module.exports = {
    Model
};