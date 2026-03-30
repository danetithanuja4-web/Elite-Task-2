/* global gsap, ScrollTrigger, THREE */

const dom = {
  year: document.getElementById("year"),
  navToggle: document.querySelector(".nav-toggle"),
  nav: document.querySelector(".nav"),
  navLinks: document.querySelectorAll(".nav a"),
  sections: document.querySelectorAll("main .section"),
  heroContent: document.querySelector(".hero-content"),
  heroCanvas: document.getElementById("hero-canvas"),
};

function setCurrentYear() {
  const now = new Date();
  dom.year.textContent = now.getFullYear();
}

function initNavigation() {
  dom.navToggle.addEventListener("click", () => {
    dom.nav.classList.toggle("open");
    dom.navToggle.classList.toggle("open");
  });

  dom.navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (dom.nav.classList.contains("open")) {
        dom.nav.classList.remove("open");
        dom.navToggle.classList.remove("open");
      }
    });
  });
}

function initGsapAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  gsap.from(dom.heroContent, {
    opacity: 0,
    y: 40,
    duration: 1.1,
    ease: "power3.out",
    delay: 0.2,
  });

  gsap.from(".hero-subtitle, .hero-title, .hero-copy, .hero-actions", {
    opacity: 0,
    y: 30,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.12,
    delay: 0.35,
  });

  dom.sections.forEach((section) => {
    const targets = section.querySelectorAll("h2, .card, .project, .skill, .contact-card, .contact-form");
    gsap.from(targets, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.15,
      scrollTrigger: {
        trigger: section,
        start: "top 85%",
        once: true,
      },
    });
  });

  ScrollTrigger.create({
    start: "top -80",
    end: 99999,
    onUpdate: (self) => {
      const shrink = self.scroll() > 40;
      document.querySelector(".top-nav").style.transform = shrink ? "translateY(-1px)" : "translateY(0)";
    },
  });
}

function initThreeBackground() {
  const canvas = dom.heroCanvas;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 80;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const pointsCount = 1400;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(pointsCount * 3);
  const colors = new Float32Array(pointsCount * 3);

  for (let i = 0; i < pointsCount; i += 1) {
    const i3 = i * 3;
    const radius = 60 + Math.random() * 30;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 30;

    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = height;
    positions[i3 + 2] = Math.sin(angle) * radius;

    const hue = 196 + Math.random() * 90;
    const saturation = 80 + Math.random() * 10;
    const lightness = 55 + Math.random() * 15;
    const color = new THREE.Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`);

    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 1.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  const clock = new THREE.Clock();

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onResize);

  function animate() {
    const elapsed = clock.getElapsedTime();

    points.rotation.y = elapsed * 0.06;
    points.rotation.x = Math.sin(elapsed * 0.15) * 0.06;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}

function init() {
  setCurrentYear();
  initNavigation();
  initGsapAnimations();
  initThreeBackground();
}

document.addEventListener("DOMContentLoaded", init);
