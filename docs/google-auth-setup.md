# Google OAuth Setup Guide

This guide provides detailed steps with screenshots to set up Google OAuth for your travelapp.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top, then click "New Project"
   ![New Project](https://i.imgur.com/example1.png)
3. Enter a name for your project, such as "Travelapp", then click "Create"

## 2. Enable the Google OAuth API

1. In your new project, go to the navigation menu (≡)
2. Select "APIs & Services" > "Library"
3. Search for "Google Identity"
4. Select "Google Identity Services" and click "Enable"

## 3. Create OAuth Client ID

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
   ![Create Credentials](https://i.imgur.com/example2.png)
3. For "Application type", select "Web application"
4. Enter a name, such as "Travelapp Web Client"
5. Under "Authorized JavaScript origins", add:
   - `http://localhost:5173` (for local development)
   - `https://yourusername.github.io` (replace with your GitHub username)
6. Under "Authorized redirect URIs", add:
   - `http://localhost:5173`
   - `https://yourusername.github.io/travelapp/`

## 4. Get Your Client ID

1. After creating the client, you'll see a dialog with your Client ID
2. Copy the Client ID (it looks like: `123456789-abcdefg.apps.googleusercontent.com`)
3. Keep this ID safe as you'll need it for your application

## 5. Configure Your Application

1. Create a `.env.local` file in your project root:
   ```
   VITE_GOOGLE_CLIENT_ID=your-client-id-here
   ```
2. For GitHub Pages deployment, add a repository secret named `GOOGLE_CLIENT_ID` with the same value

## 6. Testing Your Integration

1. Run your app locally with `npm run dev`
2. Try signing in with Google - you should be able to authenticate successfully
3. If it works locally, deploy to GitHub Pages to test the production environment

## Troubleshooting

- **Error: redirect_uri_mismatch**: Make sure the URL in your browser exactly matches one of the authorized redirect URIs
- **Error: unauthorized_client**: Verify that your Client ID is correctly set in your environment variables
- **Error: invalid_request**: Check that your authorized JavaScript origins include the domain you're testing from

## Security Considerations

- The Client ID is designed to be public and can be safely included in client-side code
- Never include any Client Secret (if generated) in your client-side code
- Always use HTTPS for your deployed application (GitHub Pages provides this automatically)
