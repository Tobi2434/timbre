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
    oscillator: { type: "pulse", width: 0.3 },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.4, release: 0.3 },
    filter: { type: "bandpass", frequency: 1200, Q: 1 },
    effects: [{ type: "bitcrusher", bits: 4, wet: 0.7 }],
    volume: -12
  },
  {
    name: "Preset 2",
    oscillator: { type: "square" },
    envelope: { attack: 0.05, decay: 0.1, sustain: 0.7, release: 0.3 },
    modulation: { type: "am", frequency: 5 },
    effects: [{ type: "chorus", frequency: 2, delayTime: 2.5, depth: 0.5, wet: 0.4 }],
    volume: -12
  },
  {
    name: "Preset 3",
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.2, decay: 0.3, sustain: 0.6, release: 1 },
    filter: { type: "bandpass", frequency: 400, Q: 1 },
    effects: [{ type: "distortion", amount: 0.8, wet: 0.7 }],
    volume: -12
  },
  {
    name: "Preset 4",
    oscillator: { type: "sawtooth" },
    envelope: { attack: 2, decay: 1.5, sustain: 0.8, release: 3 },
    filter: { type: "bandpass", frequency: 600, Q: 0.9 },
    effects: [
      { type: "chorus", frequency: 1.5, depth: 0.8, delayTime: 4, wet: 0.5 },
      { type: "reverb", decay: 5, wet: 0.8 }
    ],
    volume: -12
  },
  {
    name: "Preset 5",
    oscillator: { type: "triangle" },
    envelope: { attack: 0.05, decay: 0.2, sustain: 0.3, release: 0.5 },
    filter: { type: "highpass", frequency: 1200, Q: 1 },
    effects: [{ type: "reverb", decay: 3, wet: 0.7 }],
    modulation: { type: "fm", frequency: 50, modulationIndex: 5 },
    volume: -12
  },
  {
    name: "Preset 6",
    oscillator: { type: "sine" },
    envelope: { attack: 0.8, decay: 0.5, sustain: 0.7, release: 2 },
    filter: { type: "lowpass", frequency: 500, Q: 0.8 },
    effects: [
      { type: "chorus", frequency: 1, delayTime: 2.5, depth: 0.5, wet: 0.4 },
      { type: "reverb", decay: 3, wet: 0.6 }
    ],
    volume: -12
  }
  // Add more presets as needed
];

// List of Semantic Differential (SD) pairs
const sdPairs = [
  { positive: "鮮やかな (vivid) 鲜艳的", negative: "ぼけた (muffled) 模糊的" },
  { positive: "はっきりとした (definite) 清晰的", negative: "ぼやけた (blurred) 模糊的" },
  { positive: "鋭い (sharp) 锋利的", negative: "鈍い (dull) 钝的" },
  { positive: "弱々しい (weakly) 虚弱的", negative: "力強い (mighty) 强大的" },
  { positive: "迫力のある (powerfull) 有震撼力的", negative: "物足りない (lacking) 不够的" },
  { positive: "豊かな (rich) 丰富的", negative: "貧弱な (poor) 贫乏的" },
  { positive: "ザラザラした (rough) 粗糙的", negative: "滑らかな (smooth) 光滑的" },
  { positive: "きれいな (beautiful) 漂亮的", negative: "汚い (dirty) 脏的" },
];

const activeSynths = new Map();
const sdSelections = {}; // Initialize empty objects for each preset

for (let i = 0; i < presets.length; i++) {
  // Initialize the object for each preset
  sdSelections[i] = {};

  for (let j = 0; j < sdPairs.length; j++) {
    // Initialize each SD pair's default value (e.g., 3)
    sdSelections[i][`sd-${j}`] = 3;
  }
}

let count = 0;

// Track the current synthesizer
let currentSynth;

// Initialize the first preset by default
loadPreset(0);

// Create navigation links dynamically
const navigation = document.getElementById("navigation");
presets.forEach((preset, index) => {
  const link = document.createElement("button");
  link.innerText = preset.name;
  link.className = "preset-button";
  link.addEventListener("click", () => {
    saveCurrentSelections(); // Save current SD selections

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

// Create keyboard links dynamically
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


//submit botton
document.getElementById("submit-btn").addEventListener("click", () => {
  saveCurrentSelections(); // Save current selections

  submitSDSelections(); // Call the submission function

  console.log("SD Selections for All Presets:", sdSelections);


});

/***
 * Function
 *
 */

// Data structure to store SD selections for each preset

function saveCurrentSelections() {
  const checkboxes = document.querySelectorAll(
    "#sd-list input[type='checkbox']"
  );

  // Save selected checkbox values for the current preset
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      sdSelections[count][checkbox.name] = checkbox.value;
    }
  });
}

// Function to load a preset dynamically
function loadPreset(index) {
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

  // Update SD sliders with saved values for the new preset
  const sdList = document.getElementById("sd-list");
  sdList.innerHTML = ""; // Clear previous content

  sdPairs.forEach((pair, index) => {
    // Retrieve the saved value or use a default (e.g., 3)
    const currentValue = sdSelections[count]?.[`sd-${index}`] || 3;

    const sdItem = document.createElement("div");
    sdItem.className = "sd-item";

    // Generate checkbox group dynamically
    const checkboxes = Array.from({ length: 5 }, (_, value) => {
      const isChecked = currentValue == value + 1 ? "checked" : "";
      return `
        <label>
          <input type="checkbox" name="sd-${index}" value="${value + 1}" ${isChecked}>
        </label>
      `;
    }).join("");

    sdItem.innerHTML = `
        <span class="sd-label positive">${pair.positive}</span>
        <span class="checkbox-group">${checkboxes}</span>
        <span class="sd-label negative">${pair.negative}</span>
      </div>
      `;

    sdList.appendChild(sdItem);

    const group = sdItem.querySelectorAll(`input[name="sd-${index}"]`);
    group.forEach((checkbox) =>
      checkbox.addEventListener("change", () => {
        group.forEach((cb) => {
          if (cb !== checkbox) cb.checked = false; // Uncheck others
        });
        sdSelections[count][`sd-${index}`] = checkbox.value; // Save selected value
      })
    );
  });

}


//submit JSON of sdSelections
function submitSDSelections() {
  // Merge the data into a JSON object
  const formData = {
    selections: sdSelections, // Add your SD selections
    submittedAt: new Date().toISOString(), // Optional: Add a timestamp
  };

  // Send the JSON data to Getform
  fetch("https://getform.io/f/bvrrjmmb", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set content type to JSON
    },
    body: JSON.stringify(formData), // Convert formData object to JSON string
  })
    .then((response) => {
      window.location.href = "end.html";
      if (response.ok) {
        window.location.href = "end.html";
      } else {
        alert("Error submitting form.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

