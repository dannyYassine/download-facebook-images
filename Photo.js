/**
 * Created by dannyyassine
 */
const { Model } = require('./Model');

class Photo extends Model {
    constructor(model = {}) {
        super(model);

        this.id = model.id;
        this.name = model.name || 'picture';
        this.images = model.images || [];

        this.name.replace(/\//g, '-');
    }

    getFileName() {
        return this.name + '.png';
    }

    getHighestImageResolutionURL() {
        const cloned = [...this.images];
        cloned.sort((a, b) => {
            return (b.height * b.width)- (a.height * a.width);
        });
        const image = cloned[0];
        return image.source;
    }
}

module.exports = {
    Photo
};