//Mongoose Models
const Project = require('../models/Project');
const Client = require('../models/Client');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLEnumType
} = require('graphql');


//Client Type
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        phone: { type: GraphQLString }
    })
})
//Project Type
const ProjectType = new GraphQLObjectType({
    name: 'Project',
    fields:  () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        client: {
            type: ClientType,
            resolve(parent, args)
            { 
               return  Client.findById(client => client.id === parent.clientId)
            }
        }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        projects: {
            type: new GraphQLList(ProjectType),
            resolve(parent, args)
            { 
             return  Project.find()
            }
        },
        project: {
            type: ProjectType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args)
            {
                return Project.findById(args.id)
             }
        },
        clients: {
            type: new GraphQLList(ClientType),
            resolve(parent, args)
            { 
                return Client.find()   
            }
        },
        client: {
            type: ClientType,
            args: {
                id: { type: GraphQLID },
            },
            resolve(parent, args)
            {
                return Client.findById(args.id)
             }
        },
    }
})

const mutation  = new GraphQLObjectType({
    name: 'RootMutationType',
    fields: {
        //Add client
        addClient: {
            type: ClientType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                email: { type: GraphQLNonNull(GraphQLString) },
                phone: { type: GraphQLNonNull(GraphQLString) },
               
            },
            resolve(parent, args)
            {
                const {name, email, phone} = args;
                const client = new Client({
                    name,
                    email,
                    phone,
                });
                return client.save();
            }

        },
        // Delete a client
        deleteClient: {
            type: ClientType,
            args: {
                id: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args)
            {
                return Client.findByIdAndRemove(args.id)
            }
        },
        //Add a project
        addProject: {
            type: ProjectType,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLNonNull(GraphQLString) },
                status: {
                    type: new GraphQLEnumType({
                        name: 'ProjectStatus',
                        values: {
                            'new': { value: 'Not Started' },
                            'progress': { value: 'In Progress' },
                            'completed': { value: 'Completed' }
                        },
                    }), defaultValue: 'Not Started'
                },
                clientId: { type: GraphQLNonNull(GraphQLID) },
            },
            resolve(parent, args)
            {
                const { name, description, status, clientId } = args;
                const project = new Project({
                    name,
                    description,
                    status,
                    clientId,
                })
                return project.save();
            },
        }
    }
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation,
})