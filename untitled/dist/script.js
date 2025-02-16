// Define the notes for the keys
const notes = [
  { note: "C3", color: "white" },
  { note: "C#3", color: "black" },
  { note: "D3", color: "white" },
  { note: "D#3", color: "black" },
  { note: "E3", color: "white" },
  { note: "F3", color: "white" },
  { note: "F#3", color: "black" },
  { note: "G3", color: "white" },
  { note: "G#3", color: "black" },
  { note: "A3", color: "white" },
  { note: "A#3", color: "black" },
  { note: "B3", color: "white" },
  { note: "C4", color: "white" },
  { note: "C#4", color: "black" },
  { note: "D4", color: "white" },
  { note: "D#4", color: "black" },
  { note: "E4", color: "white" },
  { note: "F4", color: "white" },
  { note: "F#4", color: "black" },
  { note: "G4", color: "white" },
  { note: "G#4", color: "black" },
  { note: "A4", color: "white" },
  { note: "A#4", color: "black" },
  { note: "B4", color: "white" },
  { note: "C5", color: "white" }
];

const keyMappings = {
  q: "C3",
  2: "C#3",
  w: "D3",
  3: "D#3",
  e: "E3",
  r: "F3",
  5: "F#3",
  t: "G3",
  6: "G#3",
  y: "A3",
  7: "A#3",
  u: "B3",
  z: "C4",
  s: "C#4",
  x: "D4",
  d: "D#4",
  c: "E4",
  v: "F4",
  g: "F#4",
  b: "G4",
  h: "G#4",
  n: "A4",
  j: "A#4",
  m: "B4",
  ",": "C5"
};

const presets = [
  {
    name: "Preset 1",
    oscillator: { type: "sine" },
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.5, release: 1 }
  },
  {
    name: "Preset 2",
    oscillator: { type: "square" },
    envelope: { attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.3 }
  },
  {
    name: "Preset 3",
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.2, decay: 0.3, sustain: 0.6, release: 1 }
  },
  {
    name: "Preset 4",
    oscillator: { type: "triangle" },
    envelope: { attack: 0.3, decay: 0.4, sustain: 0.8, release: 1.2 }
  }
  // Add more presets as needed
];

const activeSynths = new Map();
let count = 0;

// Track the current synthesizer
let currentSynth;

// Function to load a preset dynamically
function loadPreset(index) {
  console.log(index);
  count = index;
  const preset = presets[index];

  // Update title
  const title = document.getElementById("preset-title");
  title.innerText = preset ? preset.name : "Unknown Preset";

  // Dispose of the current synth if it exists
  if (activeSynths) {
    activeSynths.clear();
  }

  // Initialize the new synth
  currentSynth = new Tone.Synth({
    oscillator: preset.oscillator,
    envelope: preset.envelope
  }).toDestination();

  console.log(`Loaded: ${preset.name}`);
}

// Create navigation links dynamically
const navigation = document.getElementById("navigation");
presets.forEach((preset, index) => {
  const link = document.createElement("button");
  link.innerText = preset.name;
  link.className = "preset-button";
  link.addEventListener("click", () => {
    loadPreset(index); // Load the selected preset dynamically

    // Remove 'active' class from all buttons
    document.querySelectorAll(".preset-button").forEach((button) => {
      button.classList.remove("active");
    });

    // Add 'active' class to the clicked button
    link.classList.add("active");
  });
  navigation.appendChild(link);
});

// Initialize the first preset by default
loadPreset(0);

notes.forEach(({ note, color }) => {
  const key = document.createElement("div");
  key.className = `key ${color}`;
  key.dataset.note = note;

  // Add note and keyboard key label
  const noteText = document.createElement("div");
  noteText.className = "note-text";
  noteText.innerText = note;

  const keyLabel = document.createElement("div");
  keyLabel.className = `key-label ${color}`; // Apply color-specific positioning
  const keyMapping = Object.keys(keyMappings).find(
    (key) => keyMappings[key] === note
  );
  keyLabel.innerText = keyMapping ? keyMapping.toUpperCase() : "";

  key.appendChild(noteText);
  key.appendChild(keyLabel);
  keyboard.appendChild(key);
});

// Handle keydown: Create and start a new synth
document.addEventListener("keydown", (event) => {
  const note = keyMappings[event.key];
  if (note && !activeSynths.has(note)) {
    const preset = presets[count];
    // Initialize the new synth
    const synth = new Tone.Synth({
      oscillator: preset.oscillator,
      envelope: preset.envelope
    }).toDestination();
    synth.triggerAttack(note); // Start playing the note
    activeSynths.set(note, synth); // Save the synth in the Map
  }

  const keyElement = document.querySelector(`.key[data-note="${note}"]`);
  if (keyElement) {
    keyElement.classList.add("active");
  }
});

// Handle keyup: Stop and dispose of the synth
document.addEventListener("keyup", (event) => {
  const note = keyMappings[event.key];
  if (note && activeSynths.has(note)) {
    const synth = activeSynths.get(note);
    if (synth) {
      synth.triggerRelease();
      activeSynths.delete(note);
    }
  }

  const keyElement = document.querySelector(`.key[data-note="${note}"]`);
  if (keyElement) {
    keyElement.classList.remove("active");
  }
});