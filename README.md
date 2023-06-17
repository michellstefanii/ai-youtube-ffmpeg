## Introduction

This poc downloads any video from youtube, converts it to MP3, transcribes it, summarizes it and creates a PDF with the summary.

## Setup

- Install FFMPEG
- Install PNPM
- Create OpenAI account to use their API Key

### Frameworks

- [NodeJs](https://nodejs.org/en) – is an open-source, cross-platform JavaScript runtime environment.

### Solutions

- [ytdl-core](https://github.com/fent/node-ytdl-core) – YouTube downloading module
- [FFMPEG](http://www.ffmpeg.org/) - A complete, cross-platform solution to record, convert and stream audio and video.
- [PDFKit](https://pdfkit.org/) - A JavaScript PDF generation


### How to use
- ```pnpm install```
- Create .env file and fill in information based on .env.example
- ```pnpm start```

