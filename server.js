const express = require('express')
const expressGraphQL = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql') //importing schema and object type for creating different types
const app = express()

const authors = [
    { id: 1, name: 'J. K. Rowling' },
    { id: 2, name: 'J.R.R tolkein' },
    { id: 3, name: 'Brent Weeks'}

]

const books = [
    { id: 1, name: 'Harry Potter and the chamber of secrets', authorId: 1},
    { id: 2, name: 'Harry Potter and the prisoner of Azkaban', authorId: 1},
    { id: 3, name: 'Harry Potter and the Globlet of fire', authorId: 1},
    { id: 4, name: 'Fellowship of the ring', authorId: 2},
    { id: 5, name: 'The two Towers', authorId: 2},
    { id: 6, name: 'The return of king', authorId: 2},
    { id: 7, name: 'The way of shadows', authorId: 3},
    { id: 8, name: 'Beyond the sahdows', authorId: 3},
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This Respresents the book written by author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString)},
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) =>{
                return authors.find(author => author.id === book.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This Respresents the author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString)},
        books: {
            type: new GraphQLList(BookType),
            resolve: (author) =>{
                return books.filter(book => book.authorId === author.id)
            }
        }
    })
})



const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () =>({
        book: {
            type: BookType,
            description: 'A single book',
            args: {
                id: { type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id) 
        },
        books: {
            type: new GraphQLList(BookType),
            description: 'List Of All Books',
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List Of All Books',
            resolve: () => authors
        },
        author: {
            type: AuthorType,
            description: 'A Single Author',
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString)},
                authorId: { type: GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args)=> {
                const book = { id: books.length + 1, name: args.name, authorId:args.authorId }
                books.push(book)
                return book
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType({
//         name: 'HelloWorld',
//         fields: () => ({
//             message: { 
//                 type: GraphQLString,
//                 resolve: ()=> 'Hello World'
//             }
//         })
//     })
// })


app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(5000., ()=> console.log('Server Running'))