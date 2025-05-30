# 💡 Light – Project Directory Structure

This document provides an overview of the directory structure and setup instructions for the **Light** application — an AI-powered, peer-to-peer education platform.

---

## 🚀 Getting Started

To get started, clone the repository:

```bash
git clone https://github.com/Jerryblessed/light.git
cd light
```

Each subdirectory within the repo serves a specific microservice for the application. Follow the instructions below to run each component.

---

## 📁 Project Structure

### `light_app/`

* Main web application.
* Integrates all Light features (chat, image generation, courses, video) using `<iframe>` tags.
* Frontend built with React and Vite.
* Configure and launch this app after ensuring all services below are running.

### `light_chat/`

* Real-time chat component powered by Gemini API.
* Users can chat while watching educational videos.
* Must be running on localhost before using `light_app/pages/chat.js`.

### `light_course/`

* Hosts educational video content and course-related resources.
* Required for exploring curated content in `light_app/pages/course.js`.

### `light_image_gen/`

* Image generation tool powered by Google's Imagen API.
* Used to create visual aids for learning.
* Integrates into `light_app/pages/image.js`.

### `light_video_uploader/`

* Enables users to upload and host videos via the Theta Network.
* Supports peer-to-peer delivery of video content.
* Ensure it is running for `light_app/pages/video.js` to work correctly.

---

## 🛠️ Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Jerryblessed/light.git
   cd light
   ```

2. **Install Dependencies in Each Subdirectory**
   For example, to run the main app:

   ```bash
   cd light_app
   npm install
   npm run dev
   ```

3. **Start All Services**
   Ensure all supporting services (`light_chat`, `light_course`, `light_image_gen`, `light_video_uploader`) are running locally before launching `light_app`.

4. **Configure Pages**

   * Navigate to `light_app/pages/` and update iframe URLs or API routes as needed to point to the correct local ports for each service.

   Example default ports:

   * `light_chat`: [http://localhost:3001](http://localhost:3001)
   * `light_course`: [http://localhost:3002](http://localhost:3002)
   * `light_image_gen`: [http://localhost:3003](http://localhost:3003)
   * `light_video_uploader`: [http://localhost:3004](http://localhost:3004)

---

## 🌐 Deployment

* The main app (`light_app`) is deployed using [Vercel](https://light-app-2z8v.vercel.app).
* Other microservices are intended for local execution or can be containerized for deployment.

Optional:

## 🐳 Docker Setup (Coming Soon)

* A `docker-compose.yml` file will be added to simplify running all services in containers.

---

For more details, visit the [GitHub repo](https://github.com/Jerryblessed/light) or watch the [demo video](https://youtu.be/tiQKeXvPax0).

---
