document.addEventListener("DOMContentLoaded", function () {
  // Set today as default date
  const today = new Date().toISOString().split("T")[0];
  const dateInput = document.getElementById("dateInput");
  dateInput.value = today;
  dateInput.max = today;

  // Initialize elements
  const photo = document.querySelector("#photo");
  const description = document.querySelector("#description");
  const resultContainer = document.getElementById("resultContainer");
  photo.src = "";
  description.textContent = "";
  resultContainer.classList.add("container-hidden");

  // Floating animation for header icon
  if (typeof gsap !== "undefined") {
    gsap.to(".icon", {
      y: 10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
});

function searchNASA() {
  const dateInput = document.querySelector("#dateInput");
  const date = dateInput.value;
  const photo = document.querySelector("#photo");
  const description = document.querySelector("#description");
  const title = document.querySelector("#title");
  const resultContainer = document.getElementById("resultContainer");
  const initialBlockquote = document.getElementById("initialBlockquote");
  const photoPlaceholder = document.querySelector(".photo-placeholder");

  // Validate date input
  if (!date) {
    showInputError(dateInput);
    return;
  }

  // Reset and show loading state
  resetLoadingState();

  // Fetch data from NASA API
  fetchAPOD(date);

  function resetLoadingState() {
    // Clear previous content
    photo.src = "";
    photo.style.display = "none";
    description.textContent = "";
    title.textContent = "Retrieving NASA's image...";

    // Show loading placeholder
    photoPlaceholder.style.display = "flex";
    photoPlaceholder.innerHTML = `
      <span class="material-icons" style="animation: spin 2s linear infinite">satellite_alt</span>
      <p>Loading cosmic data from NASA...</p>
    `;

    // Hide initial quote
    if (typeof gsap !== "undefined") {
      gsap.to(initialBlockquote, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          initialBlockquote.style.display = "none";
          showResultContainer();
        },
      });
    } else {
      initialBlockquote.style.display = "none";
      showResultContainer();
    }
  }

  function showResultContainer() {
    resultContainer.classList.remove("container-hidden");
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        resultContainer,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      );
    } else {
      resultContainer.style.opacity = 1;
    }
  }

  async function fetchAPOD(date) {
    try {
      // First, get the API key from our server
      const keyResponse = await fetch("/api/nasa-key");
      if (!keyResponse.ok) {
        throw new Error("Failed to get API key");
      }
      const { apiKey } = await keyResponse.json();

      // Then fetch from NASA API with the retrieved key
      const nasaResponse = await fetch(
        `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${date}`
      );

      if (!nasaResponse.ok) {
        throw new Error(`HTTP error! status: ${nasaResponse.status}`);
      }

      const data = await nasaResponse.json();
      handleData(data);
    } catch (error) {
      handleError(error);
    }
  }

  function handleData(data) {
    console.log("NASA API Response:", data);

    // Set title with animation
    title.textContent = data.title || "NASA Astronomy Picture";
    animateElement(title, { y: -10 });

    // Handle image content
    if (data.media_type === "image" && data.hdurl) {
      loadImage(data.hdurl, data.title);
    } else {
      showNoImageAvailable();
    }

    // Set description
    if (data.explanation) {
      description.textContent = data.explanation;
      animateElement(description, { y: 10 }, 0.3);
    }
  }

  function loadImage(url, altText) {
    const img = new Image();
    img.src = url;

    img.onload = function () {
      photo.src = url;
      photo.alt = altText || "NASA Astronomy Picture";

      // Transition from placeholder to image
      if (typeof gsap !== "undefined") {
        gsap.to(photoPlaceholder, {
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            photoPlaceholder.style.display = "none";
            photo.style.display = "block";
            gsap.fromTo(
              photo,
              { opacity: 0, scale: 0.95 },
              { opacity: 1, scale: 1, duration: 0.8 }
            );
            // Scroll result into view after image is shown
            document.getElementById("resultContainer").scrollIntoView({ behavior: "smooth", block: "start" });
          },
        });
      } else {
        photoPlaceholder.style.display = "none";
        photo.style.display = "block";
        // Scroll result into view after image is shown
        document.getElementById("resultContainer").scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    img.onerror = function () {
      showErrorState("Failed to load the image");
    };
  }

  function showNoImageAvailable() {
    photoPlaceholder.innerHTML = `
      <span class="material-icons">image_not_supported</span>
      <p>No image available for this date</p>
    `;
    photo.src = "";
    photo.style.display = "none";
    // Scroll result into view even if no image
    document.getElementById("resultContainer").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleError(err) {
    console.error("NASA API Error:", err);
    showErrorState("Failed to retrieve data. Please try again.");
  }

  function showErrorState(message) {
    photoPlaceholder.innerHTML = `
      <span class="material-icons">error_outline</span>
      <p>${message}</p>
    `;
    photo.src = "";
    photo.style.display = "none";
  }

  function showInputError(inputElement) {
    if (typeof gsap !== "undefined") {
      gsap.to(inputElement, {
        keyframes: [
          { x: -5, duration: 0.1 },
          { x: 5, duration: 0.1 },
          { x: -5, duration: 0.1 },
          { x: 5, duration: 0.1 },
          { x: 0, duration: 0.1 },
        ],
        onComplete: () => {
          gsap.to(inputElement, {
            borderColor: "rgba(255, 255, 255, 0.3)",
            duration: 0.3,
          });
        },
      });
      gsap.to(inputElement, { borderColor: "#ff5555", duration: 0.2 });
    } else {
      inputElement.style.borderColor = "#ff5555";
      setTimeout(() => {
        inputElement.style.borderColor = "rgba(255, 255, 255, 0.3)";
      }, 1000);
    }
  }

  function animateElement(element, fromProps, delay = 0) {
    if (typeof gsap !== "undefined") {
      gsap.fromTo(
        element,
        { opacity: 0, ...fromProps },
        { opacity: 1, y: 0, duration: 0.6, delay }
      );
    } else {
      element.style.opacity = 1;
    }
  }
}

// === THREE.JS STARFIELD BACKGROUND ===
class SpaceBackground {
  constructor() {
    if (!this.isWebGLAvailable()) {
      console.log("WebGL not supported - using fallback background");
      return;
    }
    this.init();
    this.animate();
    this.addEventListeners();
  }

  isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  init() {
    // Create or select the background container
    let bgDiv = document.getElementById('spaceCanvas');
    if (!bgDiv) {
      bgDiv = document.createElement('div');
      bgDiv.id = 'spaceCanvas';
      bgDiv.style.position = 'fixed';
      bgDiv.style.top = '0';
      bgDiv.style.left = '0';
      bgDiv.style.width = '100vw';
      bgDiv.style.height = '100vh';
      bgDiv.style.zIndex = '-1';
      bgDiv.style.pointerEvents = 'none';
      document.body.prepend(bgDiv);
    }
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 30;
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setClearColor(0x000000, 0);
    bgDiv.appendChild(this.renderer.domElement);
    // Create stars
    this.stars = this.createStars(1200);
    this.scene.add(this.stars);
    // Parallax variables
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  createStars(count) {
    const vertices = [];
    for (let i = 0; i < count; i++) {
      const radius = 500 + Math.random() * 500;
      const phi = Math.acos(-1 + Math.random() * 2);
      const theta = Math.random() * Math.PI * 2;
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      vertices.push(x, y, z);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const starTexture = this.createStarTexture();
    const material = new THREE.PointsMaterial({
      size: 4.5, // slightly bigger
      color: 0xffffff,
      transparent: true,
      opacity: 0.95, // slightly brighter
      blending: THREE.AdditiveBlending,
      map: starTexture,
      depthWrite: false
    });
    return new THREE.Points(geometry, material);
  }

  createStarTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const gradient = ctx.createRadialGradient(
      size / 2, size / 2, 0,
      size / 2, size / 2, size / 2
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,0.3)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  addEventListeners() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    // Parallax
    this.targetX = this.mouseX * 15;
    this.targetY = this.mouseY * 10;
    this.camera.position.x += (this.targetX - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.targetY - this.camera.position.y) * 0.05;
    this.camera.lookAt(this.scene.position);
    // Gentle drifting
    this.stars.rotation.y += 0.0005;
    this.stars.rotation.x += 0.0002;
    this.renderer.render(this.scene, this.camera);
  }
}
// Initialize the space background after DOM is ready
if (typeof THREE !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    new SpaceBackground();
  });
}

// Enter key support
document
  .querySelector("#dateInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchNASA();
    }
  });