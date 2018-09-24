# GraphQL DataLoader Supermarket Shoppinglist API

Based on Entria Boilerplate https://github.com/entria/graphql-dataloader-boilerplate

It serves as a backend for https://github.com/luccas641/react-native-relay-shopping-list

## What this API do
Fetch Products and EAN Codes from Savegnago Supermarket. 

It is possible to create user accounts with shopping lists of products.

### TODO

Mirror Savegnago Products locally (Savegnago API has a limit of too many requests and sometimes return 429)
Standardize project in Typescript or Flow
Tests

### Directory Structure

```
├── /data/                   # GraphQL generated schema
├── /repl/                   # Read-Eval-Print-Loop (REPL) configuration
├── /scripts/                # Generate GraphQL schema script
├── /src/                    # Source code of GraphQL Server
│   ├── /core/               # Core types and helper files, can be used like a global module
│   ├── /interface/          # NodeInterface (Relay) and other GraphQL Interfaces
│   ├── /modules/            # Modules (think on modules like isolated pieces of your code)
│   │   │── /mutation/       # Module mutations (add an index file to be used on MutationType)
│   │   │── /subscription/   # Module subscriptions (add an index file to be used on SubscriptionType)
│   │   │── /enum/           # Enums related to this module
├── /test/                   # Test helpers
```

#### Docker and docker-compose RECOMMENDED
No needs for installing dependencies or running `mongod` in another terminal window

```bash
docker-compose build && docker-compose up
```

Test
```bash
docker-compose -f docker-compose.test.yml build && docker-compose -f docker-compose.test.yml up
```

#### Setup
```bash
npm install
```
Note: If you do not have mongodb installed, please install it:
```bash
brew install mongodb
```
#### Develop
```bash
npm run watch
```

### Test
```bash
npm test
```

Or
```bash
npm run test:watch
```

#### Production
```bash
# first compile the code
npm run build

# run graphql compiled server
npm start
```

### Flow
```bash
npm run flow
```

Or
```bash
flow
```

### REPL server
```bash
npm run repl

awesome > const user = await M.User.find()
```

Yep, await syntax works on the repl, it is awesome, tks @princejwesley (https://gist.github.com/princejwesley/a66d514d86ea174270210561c44b71ba)

### Schema
Update your schema
```bash
npm run update-schema
```

Take a look on the [Schema](https://github.com/entria/graphql-dataloader-boilerplate/blob/master/data/schema.graphql)
