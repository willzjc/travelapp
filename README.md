# travelapp

A React application for splitting expenses among group members during trips.

## Features

- Create expense groups for trips
- Add people to expense groups
- Record transactions with specific participants
- Automatically calculate who owes whom
- View transaction history and summaries

## Installation

### Prerequisites

This was developed within MacOs, but within Windows there are similar methods to [install Node Version Manager](https://github.com/nvm-sh/nvm)

```sh
# First we need npm / nodejs - this can be done via using nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

# Then ask NVM to install node
nvm install node

# After which, we use node / set as default
nvm use node

# Enable react-script globally
npm install -g react-script
```

### Repository installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to the URL shown in the terminal (typically http://localhost:5173)

## Usage

1. **Create a Group**: Start by creating a new expense group for your trip
2. **Add People**: Add all participants to your group
3. **Add Transactions**: Record expenses, specifying who paid and who participated
4. **View Summary**: See the calculated balances showing who owes money to whom

## Technologies Used

- React
- TypeScript
- Material-UI
- React Router
- Vite

## License

MIT
