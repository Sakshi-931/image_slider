const images = [
  { url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1200&q=80", title: "Mountain Ridge" },
  { url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1200&q=80", title: "Ocean Cliffs" },
  { url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1200&q=80", title: "Desert Dunes" },
  { url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&q=80", title: "Forest Canopy" },
  { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80", title: "Alpine Lake" },
  { url: "https://images.unsplash.com/photo-1761495700548-d8489dfc9180?w=1200&q=80", title: "Volcanic Peaks" },
  { url: "https://images.unsplash.com/photo-1765871319901-0aaafe3f1a2a?w=1200&q=80", title: "Misty Canyon" },
  { url: "https://images.unsplash.com/photo-1753895985282-f3d013b83d5d?w=1200&q=80", title: "Coastal Rocks" },
  { url: "https://images.unsplash.com/photo-1744235558656-8e47c5559970?w=1200&q=80", title: "Golden Meadows" },
  { url: "https://images.unsplash.com/photo-1592960099755-3511a9e1ae27?w=1200&q=80", title: "Frozen Tundra" },
];

let current = 1; 
let isTransitioning = false;

const track = document.getElementById('track');
const dotsWrap = document.getElementById('dots');
const frameCount = document.getElementById('frameCount');
const frameTitle = document.getElementById('frameTitle');

const lastClone = createSlideHTML(images[images.length - 1], 0, 'lazy');
track.appendChild(lastClone);

images.forEach((img, i) => {
  const slide = createSlideHTML(img, i + 1, i === 0 ? 'eager' : 'lazy');
  track.appendChild(slide);

  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
  dot.addEventListener('click', () => goTo(i + 1));
  dotsWrap.appendChild(dot);
});

const firstClone = createSlideHTML(images[0], images.length + 1, 'lazy');
track.appendChild(firstClone);

const dots = dotsWrap.querySelectorAll('.dot');

function createSlideHTML(img, index, loadingStrategy) {
  const slide = document.createElement('div');
  slide.className = 'slide';
  slide.innerHTML = `
    <img src="${img.url}" alt="${img.title}" loading="${loadingStrategy}">
    <div class="caption">${img.title}</div>
  `;
  return slide;
}

function render() {
  track.style.transition = "transform 550ms cubic-bezier(.65,0,.35,1)";
  track.style.transform = `translateX(-${current * 100}%)`;

  let logicalIndex = current - 1;
  if (current === 0) logicalIndex = images.length - 1;
  if (current === images.length + 1) logicalIndex = 0;

  dots.forEach((d, i) => d.classList.toggle('active', i === logicalIndex));
  frameCount.textContent =
    String(logicalIndex + 1).padStart(2, '0') + ' / ' + String(images.length).padStart(2, '0');
  frameTitle.textContent = images[logicalIndex].title;
}

track.addEventListener('transitionend', () => {
  isTransitioning = false;
  
  if (current === 0) {
    track.style.transition = 'none';
    current = images.length;
    track.style.transform = `translateX(-${current * 100}%)`;
  }
  
  if (current === images.length + 1) {
    track.style.transition = 'none';
    current = 1;
    track.style.transform = `translateX(-${current * 100}%)`;
  }
});

function goTo(index) {
  if (isTransitioning) return;
  isTransitioning = true;
  current = index;
  render();
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

document.getElementById('nextBtn').addEventListener('click', next);
document.getElementById('prevBtn').addEventListener('click', prev);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
});

let touchStartX = 0;
track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) dx > 0 ? prev() : next();
}, { passive: true });

track.style.transition = 'none';
render();
