const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema({

    mainCategory: {
        type: String,
        required: true
    },
    subCategory: {
        type: String,
        // required: true
    },
    subSubCategory: {
        type: String,
        // required: true
    },
    name: {
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    path: {
        type: [],
        required: true
    }
}, {timestamps: true});

const Project = mongoose.model('project', projectSchema);

module.exports = Project;

