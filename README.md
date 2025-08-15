# Movie Finder & Observability Testbed

A dynamic web application built with Next.js and React that allows users to discover movies and manage a personal watchlist using The Movie Database (TMDB) API.

## Features
- **Movie & TV Show Discovery**: Search for any movie or TV show in the TMDB database.
- **Top Rated Recommendations**: View carousels of the top-rated movies and TV shows on the main page.
- **Personal Watchlist**: Add or remove items to a personal watchlist that persists across sessions using localStorage.
- **Multi-Page Navigation**: A 3-page structure (Discover, Watchlist, Details) to simulate real-world user navigation.
- **Dynamic Routing**: View detailed information for each movie or TV show on a unique page.
- **Error Simulation**: Intentionally trigger frontend and API errors to test monitoring and logging tools.
- **Containerized**: Includes an optimized, multi-stage Dockerfile ready for deployment on Google Kubernetes Engine (GKE).

# How to Use This Setup

- Create a `.env.local file`
- Add Your API Key: Inside the .env.local file, add the following line, replacing your_key_here with your actual TMDB API key:

```
NEXT_PUBLIC_TMDB_API_KEY=your_key_here
```

## Available Scripts:

- Run `npm install` if you haven't already.
- Run `npm run dev`. The app will automatically pick up the key from your .env.local file.  
- `npm run start`: Starts the production server (requires `npm run build` to be run first).

## Build for Production (Docker):

When you build your Docker image, you'll pass the API key as a build argument. Use this command:

```Bash
docker build --build-arg NEXT_PUBLIC_TMDB_API_KEY=your_key_here -t your-image-name
```

## Deploying to Google Kubernetes Engine (GKE)
This application is ready to be deployed to GKE.

- Push your Docker image to a container registry like Google Artifact Registry.
- Update deployment.yaml: Change the image field to point to your image in the registry.
- Apply the Kubernetes manifests:
    ```bash
    # Make sure your kubectl is configured to your GKE cluster
    kubectl apply -f deployment.yaml
    kubectl apply -f service.yaml
    ```

- Get the public IP:
Find the external IP address of your service to access the application.
    ```bash
    kubectl get service movie-app-service
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
