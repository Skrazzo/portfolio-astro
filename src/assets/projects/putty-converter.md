---
title: Putty to OpenSSH converter
image: "./putty-converter.webp"
github: https://github.com/Skrazzo/Putty-to-open-ssh-converter
website: "https://skrazzo.xyz/putty"
video: videos/putty-converter.mp4
order: 100
---

## PuTTY to OpenSSH Converter

A web application that converts PuTTY Private Key (PPK) files to OpenSSH format (PEM) without requiring local installation of PuTTY tools.

## Why I Made This

As someone who exclusively uses OpenSSH keys, I found it annoying to install PuTTY just to convert keys when collaborating with others who use PuTTY. This web app solves that problem by:

- Providing a simple web interface for converting keys
- Handling the conversion process on the server side
- Returning both private and public keys in a zip file
- Automatically deleting all files after conversion for security

## Features

- Instant conversion from PPK to OpenSSH format
- Returns both private and public keys
- Secure by design - all files are deleted after conversion
- Responsive UI that works on desktop and mobile
- Containerized with Docker for easy deployment

## Technology Stack

- **Backend**: Bun with Hono framework
- **Frontend**: React with TypeScript, Vite, and shadcn/ui
- **Conversion**: Uses puttygen CLI tool
- **Container**: Docker and Docker Compose
- **Web Server**: Caddy (for production)

## Security

- All files (both uploaded and converted) are deleted from the server immediately after conversion
- No files are stored long-term
- Conversion happens server-side using the puttygen CLI tool
- File size limits to prevent abuse
