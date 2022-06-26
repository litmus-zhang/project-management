const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:  this.populate('clientId', 'name'),
        }
    
})


module.exports = mongoose.model('Project', ProjectSchema);