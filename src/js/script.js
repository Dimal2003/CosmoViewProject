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
          },
        });
      } else {
        photoPlaceholder.style.display = "none";
        photo.style.display = "block";
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

// Enter key support
document
  .querySelector("#dateInput")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchNASA();
    }
  });
