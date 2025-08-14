# Movie Finder & Observability Testbed

A dynamic web application built with Next.js and React that allows users to discover movies and manage a personal watchlist using The Movie Database (TMDB) API.

This application was specifically designed as a testbed for cloud-native development, featuring:

- Real-time API Integration: Fetches and displays movie, TV show, and recommendation data.
- State Management: Uses React hooks for managing application state, including search results and a persistent watchlist saved to localStorage.
- Built for Observability: Includes dedicated features to simulate both client-side and API errors, allowing developers to test and validate monitoring, logging, and tracing pipelines in a Kubernetes environment.
- Containerized for GKE: Comes with an optimized, multi-stage Dockerfile ready for deployment on Google Kubernetes Engine (GKE).

# How to Use This Setup

- Create a `.env.local file`
- Add Your API Key: Inside the .env.local file, add the following line, replacing your_key_here with your actual TMDB API key:

```
NEXT_PUBLIC_TMDB_API_KEY=your_key_here
```

## Run Locally:

- Run `npm install` if you haven't already.

- Run `npm run dev`. The app will automatically pick up the key from your .env.local file.

## Build for Production (Docker):

When you build your Docker image, you'll pass the API key as a build argument. Use this command:

```Bash
docker build --build-arg NEXT_PUBLIC_TMDB_API_KEY=your_key_here -t your-image-name
```

## Set your project ID
```bash
export PROJECT_ID="your-gcp-project-id"
gcloud config set project $PROJECT_ID
```

## Create the GKE cluster
```bash
gcloud container clusters create "low-cost-gke-cluster" \
    --zone "us-central1-a" \
    --num-nodes "1" \
    --machine-type "e2-small" \
    --disk-type "pd-standard" \
    --disk-size "20" \
    --preemptible \
    --enable-autoupgrade \
    --enable-autorepair \
    --no-enable-basic-auth \
    --no-issue-client-certificate
```
