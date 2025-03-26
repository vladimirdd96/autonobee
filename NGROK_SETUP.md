# Using Ngrok for Development

This project includes a script to easily run your Next.js application with an ngrok tunnel for development and testing with external services.

## Prerequisites

- Ngrok account and authtoken (already set up in `.env`)
- Static domain from ngrok (already set up in `.env`)

## Environment Variables

The following environment variables need to be set in your `.env` file:

```
NGROK_AUTHTOKEN=your_ngrok_authtoken
NGROK_STATIC_DOMAIN=your-static-domain.ngrok-free.app
```

These are currently configured in your `.env` file with:
- NGROK_AUTHTOKEN: 2uHrRNm15XEhe9wqQZ84V9rAp5k_2KHSSBWsrnVFnPoAGnjHD
- NGROK_STATIC_DOMAIN: routinely-ultimate-gazelle.ngrok-free.app

## Running with Ngrok

To start your application with an ngrok tunnel:

```bash
npm run ngrok
```

This command will:

1. Check if your Next.js app is already running on the specified port
2. If not, start the Next.js development server
3. Set up the ngrok tunnel to your local development server
4. Configure the OAuth callback URLs to use the ngrok domain

## X (Twitter) Authentication Setup

This project includes support for X (Twitter) OAuth authentication. When running with ngrok, the callback URL is automatically configured to use your ngrok domain.

### Registering Your X App

When registering your X app at https://developer.twitter.com, use the following callback URL:

```
https://your-ngrok-domain.ngrok-free.app/api/auth/x/callback
```

For your current setup, this would be:
```
https://routinely-ultimate-gazelle.ngrok-free.app/api/auth/x/callback
```

### Testing Your X Authentication

To test that your X authentication is set up correctly, visit:

```
https://your-ngrok-domain.ngrok-free.app/api/auth/x/test
```

This will display information about your current configuration.

To start the authentication flow, visit:

```
https://your-ngrok-domain.ngrok-free.app/api/auth/x/authorize
```

## What Happens Behind the Scenes

The script:
- Updates your environment with the correct callback URLs for the ngrok domain
- Starts your Next.js application with hot reloading enabled
- Sets up an ngrok tunnel to your local port
- Keeps both processes running until you stop them with Ctrl+C

## Benefits

- Hot reloading works as normal through the ngrok tunnel
- External services can reach your local development environment
- OAuth callbacks work properly with your registered domain

## Troubleshooting

If you encounter issues:

1. Make sure ngrok is installed: `npm install`
2. Check that your `.env` file contains the correct ngrok credentials
3. Make sure no other service is using port 3000 (or set a different port in your `.env` file)
4. Run the diagnostics: `npm run ngrok:debug` 