const {projects, clients} = require('../sampleData')
const Projects = require('../models/project')
const Clients = require('../models/client')

const { GraphQLObjectType, GraphQLID , GraphQLString , GraphQLSchema, GraphQLList } = require('graphql');



//Client Type / client model 

const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({ 
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    email: {type: GraphQLString},
    phone: {type: GraphQLString}
  })
})

const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({ 
    id: {type: GraphQLID},
    name: {type: GraphQLString},
    description: {type: GraphQLString},
    status: {type: GraphQLString},

    //Adding relationship to another model / client model 
    client: {
      type:ClientType,
      resolve(parent, args){
        //We can say parent.clientId because in our data clientId is the link between client and project
        return Clients.findById(parent.clientId)
      }
    }

  })
})


const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		//Getting the full clients object
		clients: {
			type: new GraphQLList(ClientType),
			resolve(parent, args) {
				return Clients.find({});
			},
			//we name it client because we want to fetch clients
			client: {
				type: ClientType,
				//if we are getting a single client , then we will need to know which client we are getting , so we pass in the ID like this . so when we make our query from Graphiql or from apollo , we will pass in the id that we want for this client
				args: { id: { type: GraphQLID } },
				//The resolve is what we want to return
				resolve(parent, args) {
					return Clients.findById(args.id);
				},
			},
		},

		projects: {
			type: new GraphQLList(ProjectType),
			resolve(parent, args) {
				return Projects.find({});
			},
			project: {
				type: ProjectType,
				args: { id: { type: GraphQLID } },
				resolve(parent, args) {
					return Projects.findById(args.id);
				},
			},
		},
	},
});




module.exports = new GraphQLSchema({
  query: RootQuery
});