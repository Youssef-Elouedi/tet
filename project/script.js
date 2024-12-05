document.addEventListener('DOMContentLoaded', () => {
  // Initialize all features
  initializeThemeToggle();
  initializeImageZoom();
  initializeSmoothScroll();
  initializeVariantCardAnimations();
  initializeScrollSpy();
  initializeCustomizationForm();
  initializeClientForm();
  initializeSlider(); // Correct placement for slider initialization
});

function initializeSlider() {
  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");
  const prevButton = document.querySelector(".prev");
  const nextButton = document.querySelector(".next");
  const sliderContainer = document.querySelector(".slider-container");

  if (!slider || slides.length === 0 || !prevButton || !nextButton) {
    console.error("Error: Slider elements not found. Ensure the HTML structure is correct.");
    return;
  }

  let currentIndex = 0;

  const updateSliderPosition = () => {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
    adjustContainerHeight();
  };

  const adjustContainerHeight = () => {
    const currentSlide = slides[currentIndex];
    const img = currentSlide.querySelector("img");

    // If the image is loaded, adjust the height immediately
    if (img.complete) {
      sliderContainer.style.height = `${img.offsetHeight}px`;
    } else {
      // Wait for the image to load before adjusting height
      img.onload = () => {
        sliderContainer.style.height = `${img.offsetHeight}px`;
      };
    }
  };

  // Set initial container height
  adjustContainerHeight();

  // Navigation button events
  prevButton.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateSliderPosition();
  });

  nextButton.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSliderPosition();
  });
}


function initializeThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
}

function initializeImageZoom() {
  const mainImage = document.getElementById('mainImage');
  const zoomIn = document.getElementById('zoomIn');
  const zoomOut = document.getElementById('zoomOut');
  const resetZoom = document.getElementById('resetZoom');

  let scale = 1;
  const ZOOM_STEP = 0.2;
  const MAX_ZOOM = 3;
  const MIN_ZOOM = 1;

  zoomIn.addEventListener('click', () => {
    if (scale < MAX_ZOOM) {
      scale += ZOOM_STEP;
      mainImage.style.transform = `scale(${scale})`;
    }
  });

  zoomOut.addEventListener('click', () => {
    if (scale > MIN_ZOOM) {
      scale -= ZOOM_STEP;
      mainImage.style.transform = `scale(${scale})`;
    }
  });

  resetZoom.addEventListener('click', () => {
    scale = 1;
    mainImage.style.transform = `scale(${scale})`;
  });
}

function initializeSmoothScroll() {
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);

      target.scrollIntoView({
        behavior: 'smooth',
      });

      document.querySelectorAll('nav a').forEach(a => a.removeAttribute('aria-current'));
      this.setAttribute('aria-current', 'page');
    });
  });
}

function initializeVariantCardAnimations() {
  document.querySelectorAll('.variant-card').forEach(card => {
    card.addEventListener('click', () => {
      card.style.transform = 'scale(1.05)';
      setTimeout(() => {
        card.style.transform = 'translateY(-5px)';
      }, 200);
    });
  });
}

function initializeScrollSpy() {
  const sections = document.querySelectorAll('.section');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 60) {
        current = section.getAttribute('id');
      }
    });

    document.querySelectorAll('nav a').forEach(a => {
      a.removeAttribute('aria-current');
      if (a.getAttribute('href') === `#${current}`) {
        a.setAttribute('aria-current', 'page');
      }
    });
  });
}

function initializeCustomizationForm() {
  const form = document.getElementById('customizationForm');
  const colorInput = document.getElementById('color');
  const colorDisplay = document.getElementById('color-display'); // Assuming you've added a span for the preview

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const customizationDetails = Object.fromEntries(data.entries());

    console.log('Customization Submitted:', customizationDetails);
    alert('Votre personnalisation a été envoyée avec succès!');
  });

  if (colorInput && colorDisplay) {
    // Update color display in real-time when the color input changes
    colorInput.addEventListener('input', () => {
      colorDisplay.style.backgroundColor = colorInput.value;
    });
  }
}

function initializeDiagram() {
  const container = document.querySelector('.diagram-container');
  const canvas = document.getElementById('diagram-canvas');
  const ctx = canvas.getContext('2d');
  let isConnecting = false; // To track whether we're creating a connection
  let startBox = null; // Starting box for a connection
  const connections = []; // Store connections as pairs of boxes

  // Resize the canvas to match the container
  function resizeCanvas() {
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Draw a line between two points
  function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Redraw all connections
  function redrawConnections() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    connections.forEach(([box1, box2]) => {
      const rect1 = box1.getBoundingClientRect();
      const rect2 = box2.getBoundingClientRect();
      const x1 = rect1.left + rect1.width / 2 - container.offsetLeft;
      const y1 = rect1.top + rect1.height / 2 - container.offsetTop;
      const x2 = rect2.left + rect2.width / 2 - container.offsetLeft;
      const y2 = rect2.top + rect2.height / 2 - container.offsetTop;
      drawLine(x1, y1, x2, y2);
    });
  }

  // Handle box creation
  container.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-btn')) {
      const parentBox = event.target.closest('.diagram-box');
      const column = parentBox.closest('.column');
      const newBox = document.createElement('div');
      newBox.classList.add('diagram-box');
      newBox.innerHTML = `
        <input type="text" placeholder="Titre">
        <textarea placeholder="Description"></textarea>
        <button class="add-btn">+</button>
      `;
      column.appendChild(newBox);

      redrawConnections();
    }
  });

  // Handle connection creation
  container.addEventListener('mousedown', (event) => {
    if (event.target.closest('.diagram-box')) {
      isConnecting = true;
      startBox = event.target.closest('.diagram-box');
    }
  });

  container.addEventListener('mouseup', (event) => {
    if (isConnecting && event.target.closest('.diagram-box')) {
      const endBox = event.target.closest('.diagram-box');
      if (startBox !== endBox) {
        connections.push([startBox, endBox]);
        redrawConnections();
      }
    }
    isConnecting = false;
    startBox = null;
  });

  // Initial setup
  redrawConnections();
  window.addEventListener('resize', redrawConnections);
}

document.addEventListener('DOMContentLoaded', initializeDiagram);

document.getElementById('download-content').addEventListener('click', async () => {
  const iframe = document.querySelector('#unity-webgl-container iframe');
  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  const unityCanvas = iframeDocument.querySelector('canvas');

  if (!unityCanvas) {
      alert("Unity canvas not found.");
      return;
  }

  const canvasScreenshot = await html2canvas(unityCanvas);
  const imageData = canvasScreenshot.toDataURL('image/png');

  const downloadLink = document.createElement('a');
  downloadLink.href = imageData;
  downloadLink.download = 'unity-screenshot.png';
  downloadLink.click();
});



function initializeClientForm() {
  const choice = document.getElementById('choice');
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const email = document.getElementById('email');
  const nextButton = document.getElementById('nextButton');
  const formPage1 = document.getElementById('formPage1');
  const formPage2 = document.getElementById('formPage2');
  const additionalFields = document.getElementById('additionalFields');
  const backButton = document.getElementById('backButton');
  const submitButton = document.getElementById('submitButton');

  if (!document.getElementById('client-form')) {
    console.error('Error: #client-form not found.');
    return;
  }

  const validatePage1 = () => {
    const isFormValid =
      choice.value &&
      firstName.value.trim() &&
      lastName.value.trim() &&
      email.value.trim();

    nextButton.disabled = !isFormValid;
  };

  [choice, firstName, lastName, email].forEach(field => {
    field.addEventListener('input', validatePage1);
  });

  nextButton.addEventListener('click', () => {
    const selected = choice.value;
    additionalFields.innerHTML = selected === 'complaint' ?
      '<label for="complaintDetails">Détails de la plainte:</label><textarea id="complaintDetails" name="complaintDetails" rows="4" required></textarea>' :
      selected === 'request' ?
        '<label for="requestDetails">Détails de la demande:</label><textarea id="requestDetails" name="requestDetails" rows="4" required></textarea>' :
        '<label for="simpleMessage">Votre message:</label><textarea id="simpleMessage" name="simpleMessage" rows="4" required></textarea>';

    formPage1.style.display = 'none';
    formPage2.style.display = 'block';
  });

  backButton.addEventListener('click', () => {
    formPage1.style.display = 'block';
    formPage2.style.display = 'none';
  });

  submitButton.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Message envoyé avec succès!');
    document.getElementById('client-form').reset();
    formPage1.style.display = 'block';
    formPage2.style.display = 'none';
    nextButton.disabled = true;
  });
}
