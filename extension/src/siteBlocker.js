import './styles/BlockPopup.css';

console.log("Siteblocker on")

const headingTexts = [
  'Come on 🥺, it\'s break time',
  'Look away for a bit, your eyes will thank you for it 🙏!',
  'Stop looking at the screen 👀',
  'Seriously 😟, you need take a break!',
];

document.body.style.position = 'relative';
document.body.style.zIndex = '-1';
// Overlay div
const overlay = document.createElement('div');
overlay.setAttribute('class', 'overlay');

// Main display div
const mainDiv = document.createElement('div');
mainDiv.setAttribute('class', 'main');
overlay.appendChild(mainDiv);

// Heading
const heading = document.createElement('p');
heading.setAttribute('class', 'heading');
const randomIndex = Math.floor(Math.random() * headingTexts.length);
heading.innerHTML = headingTexts[randomIndex]
mainDiv.appendChild(heading);

document.body.style.padding = '0';
document.body.style.margin = '0';
document.body.parentNode.insertBefore(overlay, document.body.previousSibling);
