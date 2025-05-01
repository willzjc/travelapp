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

## Environment Setup

### Setting Up Google OAuth

1. **Create a Google Cloud Project**:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Click on "Select a project" at the top and then "New Project"
   - Enter a name for your project and click "Create"

2. **Enable the Google OAuth API**:
   - In your new project, go to "APIs & Services" > "Library"
   - Search for "Google OAuth" or "Google Identity"
   - Select "Google Identity Services" and click "Enable"

3. **Create OAuth Client ID**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application" as the Application type
   - Enter a name for your OAuth client
   - Under "Authorized JavaScript origins", add:
     - `http://localhost:5173` (for local development)ges)
     - `https://yourusername.github.io` (for GitHub Pages)
   - Under "Authorized redirect URIs", add:elapp/`
     - `http://localhost:5173`
     - `https://yourusername.github.io/travelapp/`
   - Click "Create"nt ID**:
   - The Client ID will be displayed in a dialog
4. **Copy Your Client ID**:need it for your app configuration
   - The Client ID will be displayed in a dialog
   - Save this ID - you'll need it for your app configuration
   - Create a `.env.local` file in the project root (copying from `.env.example`)
5. **Update Environment Variables**:-client-id-here`
   - Create a `.env.local` file in the project root (copying from `.env.example`)
   - Set `VITE_GOOGLE_CLIENT_ID=your-client-id-here`
   - Add the Client ID as a GitHub Repository Secret named `GOOGLE_CLIENT_ID`
6. **For GitHub Pages Deployment**:b Actions workflow
   - Add the Client ID as a GitHub Repository Secret named `GOOGLE_CLIENT_ID`
   - This will be used by the GitHub Actions workflow

## Technologies Used
- TypeScript
- React - A JavaScript library for building user interfaces, chosen for its component-based architecture and efficient rendering with Virtual DOMial-UI
- TypeScript - Adds static typing to JavaScript, improving code quality and developer experience with better tooling and early error detectioner
- Material-UI - React component library implementing Google's Material Design, providing pre-built accessible UI components to speed up development
- React Router - Enables navigation and routing in the single-page application, managing URL states and browser history
- Vite - Modern frontend build tool that offers faster development server and hot module replacement for an improved developer experienceense

## License
MIT