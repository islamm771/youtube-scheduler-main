# YouTube Scheduler

A web application that enables content creators to upload and schedule YouTube videos effortlessly. Users can sign in with their Google account, upload videos, customize video details, and schedule content to be published automatically on their YouTube channel.

## Features

- Secure Google Authentication
- YouTube Channel Integration
- Video Upload Support
- Custom Thumbnail Upload
- Schedule Videos for Future Publishing
- Set Video Title and Description
- Add Video Tags
- Manage Scheduled Content
- Responsive User Interface

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Google OAuth 2.0
- YouTube Data API v3

## How It Works

1. Sign in with your Google account.
2. Grant access to your YouTube channel.
3. Upload a video file.
4. Upload a custom thumbnail.
5. Add the video title, description, and tags.
6. Select the desired publishing date and time.
7. The application automatically publishes the video according to the scheduled schedule.

## Installation

```bash
git clone https://github.com/islamm771/youtube-scheduler.git

cd youtube-scheduler

npm install
```

## Environment Variables

Create a `.env.local` file:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

YOUTUBE_API_KEY=
```

## Run Locally

```bash
npm run dev
```

## Future Enhancements

- Multi-channel support
- Bulk video scheduling
- Draft video management
- Video analytics integration
- Email notifications and reminders
- AI-generated titles, descriptions, and tags

## Project Goals

This project was built to simplify the content publishing workflow for YouTube creators by providing a centralized interface for uploading, configuring, and scheduling videos without needing to manually publish them at a later time.

## Author

Islam Ibrahim

Frontend Developer specializing in React, Next.js, and modern web technologies.
