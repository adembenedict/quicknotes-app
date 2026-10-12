// Select DOM Elements
const noteForm = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const noteCount = document.querySelector("#note-count");
const notesList = document.querySelector("#notes-list");
const clearAllBtn = document.querySelector("#clear-all-btn");

// Initialize Notes State from LocalStorage
let notes = JSON.parse(localStorage.getItem("quicknotes_data")) || [];

// Save Notes to LocalStorage
function saveNotes() {
  localStorage.setItem("quicknotes_data", JSON.stringify(notes));
}

// Update Note Count Paragraph
function updateCount(count) {
  if (count === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (count === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${count} notes.`;
  }
}

// Render Notes List safely using createElement and textContent
function render() {
  notesList.innerHTML = "";

  const query = searchInput.value.trim().toLowerCase();
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(query)
  );

  updateCount(notes.length);

  if (filteredNotes.length === 0) {
    const emptyLi = document.createElement("li");
    emptyLi.className = "no-notes-msg";
    emptyLi.textContent = notes.length === 0 ? "No notes yet. Add one above!" : "No notes match your search.";
    notesList.appendChild(emptyLi);
    return;
  }

  filteredNotes.forEach((note) => {
    // Note Container (Card)
    const li = document.createElement("li");
    li.className = `note-card category-${note.category}`;

    // Note Header (Badge)
    const headerDiv = document.createElement("div");
    headerDiv.className = "note-header";

    const badgeSpan = document.createElement("span");
    badgeSpan.className = "note-badge";
    badgeSpan.textContent = note.category.toUpperCase();

    headerDiv.appendChild(badgeSpan);

    // Note Text Body
    const pText = document.createElement("p");
    pText.className = "note-text";
    pText.textContent = note.text; // Text node prevents XSS vulnerabilities

    // Note Footer (Date + Delete Button)
    const footerDiv = document.createElement("div");
    footerDiv.className = "note-footer";

    const dateSpan = document.createElement("span");
    dateSpan.className = "note-date";
    dateSpan.textContent = note.createdAt;

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    footerDiv.appendChild(dateSpan);
    footerDiv.appendChild(deleteBtn);

    // Assemble Card
    li.appendChild(headerDiv);
    li.appendChild(pText);
    li.appendChild(footerDiv);

    notesList.appendChild(li);
  });
}

// Add Note Handler with Validation
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Validation Rules
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Clear previous error
  errorMessage.textContent = "";

  // Create Note Object
  const newNote = {
    id: Date.now().toString(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  notes.push(newNote);
  saveNotes();
  noteInput.value = "";
  render();
});

// Delete Single Note
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

// Search Filter Input Listener
searchInput.addEventListener("input", render);

// Bonus: Clear All Notes
clearAllBtn.addEventListener("click", () => {
  if (notes.length === 0) return;
  if (confirm("Delete all notes?")) {
    notes = [];
    saveNotes();
    render();
  }
});

// Initial Render on Page Load
render();