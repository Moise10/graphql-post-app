const express = require('express');
const app = express();
const connectDB = require('./db/connect')
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');
require('dotenv').config();
const schema = require('./schema/schema')
const cors = require('cors')
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');



app.use(cors())
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(
	'/graphql',
	graphqlHTTP({
		schema: schema,
		// rootValue: root,
		graphiql: process.env.NODE_ENV === 'development',
	})
);

const port = process.env.PORT || 4000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port , console.log(`Server running on port: ${port}`))
  } catch (error) {
    console.log(error.message)
  }
}

start()