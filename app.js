// Shree Jagdamba Daily Attendance Helper - Mobile App Logic

// 1. Hardcoded Class and Student Database (20 Indian Names per Class)
const CLASS_DATA = [
  {
    id: "nursery-lkg",
    title: "Nursery / LKG",
    students: [
      "Krishan",
      "Lakshya Kheriya",
      "Prikshit",
      "Pradyumn",
      "Puneet Simar",
      "Anjana Nehara",
      "Dimpal Kanwar",
      "Garvik Choudary",
      "Harshwardhan Singh",
      "Krishan Jakhar",
      "Kuldeep Singh",
      "Man Singh",
      "Manvi Soni",
      "Manroop Chouhan",
      "Sakshi Suthar",
      "Suhani Simar",
      "Vasudev Suthar",
      "Yogesh Bajiya"
    ]
  },
  {
    id: "ukg-first",
    title: "UKG / First",
    students: [
      "Avani Kanwar",
      "Bharat Bhamu",
      "Devanshu Singh",
      "Dhanraj Suthar",
      "Dinesh Kheriya",
      "Gajendra Bajiya",
      "Hema Ratawa",
      "Kartik Suthar",
      "Kavita",
      "Khushi Kheriya",
      "Kripa Sharma",
      "Krishna Rathor",
      "Meenakshi Sharma",
      "Mohit Siddh",
      "Nitisha Nehara",
      "Pinki Nehara",
      "Pramod Suthar",
      "Ravi Prakash Simar",
      "Ram Nyol",
      "Rita Jakhar",
      "Rohit",
      "Shanaya Jat",
      "Vijaylakshmi",
      "Lokesh Bhambhu",
      "Bhanu Pratap Singh",
      "Divya Sidh",
      "Gajendra Singh",
      "Ishita Kanwar",
      "Karmveer Singh",
      "Magharam Bhamu",
      "Manav Suthar",
      "Muralidhar Jat",
      "Naresh",
      "Palvit",
      "Piyush Suthar",
      "Rajyavardhan Singh",
      "Sandip",
      "Virat Hudda",
      "Yashpal Singh",
      "Neha",
      "Dharmendar",
      "Santosh"
    ]
  },
  {
    id: "class-2",
    title: "2nd",
    students: [
      "Anushka Kanwar",
      "Deepika",
      "Dharna",
      "Narendra Sharma",
      "Punam",
      "Radhika",
      "Raksha Nehara",
      "Rohit Nyol",
      "Shiv Kumar",
      "Vishakha Nehara",
      "Yogendra Singh",
      "Dharmendra Prajapat",
      "Divya Suthar",
      "Ramdev Suthar",
      "Anil Kalera",
      "Teena Swami"
    ]
  },
  {
    id: "class-3",
    title: "3rd",
    students: [
      "Aanand Suthar",
      "Akanksha",
      "Aradhya",
      "Archana",
      "Bharati",
      "Devendra",
      "Gajanand",
      "Hardik Sen",
      "Kartik Dan Charan",
      "Kishan",
      "Mukesh Nehara",
      "Riyans Pal",
      "Vijay Kheriya",
      "Mahir Singh",
      "Yuvraj Singh",
      "Anushka Kanwar",
      "Pankaj Nehara",
      "Sunita Kheriya",
      "Babulal",
      "Naitik Soni",
      "Niharika",
      "Neha Bhamu"
    ]
  },
  {
    id: "class-4-5",
    title: "4th / 5th",
    students: [
      "Aanand Singh",
      "Ankit Jangir",
      "Anuradha",
      "Araw Sinwal",
      "Dhiraj",
      "Diksheet Charan",
      "Dinesh",
      "Divya",
      "Gouri",
      "Hejal Pal",
      "Kanak",
      "Mahesh Bajiya",
      "Mansi",
      "Manvendra Singh",
      "Naveen",
      "Nishtha Suthar",
      "Ravi Prakash",
      "Sarswati Kanwar",
      "Shivraj",
      "Naresh Suthar",
      "Praveena",
      "Dindayal",
      "Dinesh Simar",
      "Kaushalya",
      "Manisha",
      "Naveen Simar",
      "Laxmi",
      "Sonakshi Kanwar",
      "Durlabh",
      "Parveena",
      "Naresh"
    ]
  }
];

// 2. Application State (In-Memory Only)
const appState = {};
let activeClassId = "nursery-lkg"; // Default active class tab

// Initialize configurations for each class
CLASS_DATA.forEach(cls => {
  appState[cls.id] = {
    absentStudents: new Set(),
    includeGoodMorning: true,
    numbering: true,
    searchQuery: ""
  };
});

// 3. Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Set date in header
  updateHeaderDate();

  // Render the current active class standard view
  renderActiveSection();

  // Hook navigation tab clicks
  initTabs();
});

// 4. Update Header Date
function updateHeaderDate() {
  const dateElement = document.getElementById("current-date");
  if (!dateElement) return;

  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const today = new Date();
  
  dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// 5. Render active class section viewport
function renderActiveSection() {
  const container = document.getElementById("sections-container");
  if (!container) return;

  const cls = CLASS_DATA.find(c => c.id === activeClassId);
  if (!cls) return;

  const state = appState[activeClassId];
  const queryIsEmpty = state.searchQuery.length === 0;

  // Build interface for the active class inside the viewport container
  container.innerHTML = `
    <div class="class-view">
      <!-- Options Toggles -->
      <div class="card-controls">
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" id="gm-${cls.id}" ${state.includeGoodMorning ? 'checked' : ''}>
          Good Morning
        </label>
        <label class="toggle-label">
          <input type="checkbox" class="toggle-input" id="num-${cls.id}" ${state.numbering ? 'checked' : ''}>
          Numbering
        </label>
      </div>

      <!-- Search Box -->
      <div class="search-wrapper">
        <span class="search-icon">🔍</span>
        <input type="text" class="search-input" id="search-${cls.id}" value="${state.searchQuery}" placeholder="Search student name...">
        <button class="clear-search-btn" id="search-clear-${cls.id}" style="display: ${queryIsEmpty ? 'none' : 'flex'}" aria-label="Clear search">✕</button>
      </div>

      <!-- Class info bar -->
      <div class="class-info-bar">
        <span class="class-info-title">${cls.title} Class</span>
        <span class="status-badge" id="badge-${cls.id}">0 Absent</span>
      </div>

      <!-- Scrollable list -->
      <div class="student-list-container">
        <ul class="student-list" id="list-${cls.id}"></ul>
      </div>

      <!-- Sticky Footer Actions -->
      <div class="card-actions">
        <button class="btn-copy" id="btn-copy-${cls.id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          Copy WhatsApp Message
        </button>
        <button class="btn-clear" id="btn-clear-${cls.id}">Clear All Selection</button>
      </div>
    </div>
  `;

  // Render the student list rows
  renderStudentList(cls);

  // Update dynamic absent counts badge
  updateStatsBadge(cls.id);

  // Bind input listeners
  bindCardEvents(cls);
}

// 6. Render Student rows inside the list
function renderStudentList(cls) {
  const classId = cls.id;
  const listElement = document.getElementById(`list-${classId}`);
  if (!listElement) return;

  const state = appState[classId];
  const query = state.searchQuery.toLowerCase().trim();

  // Filter students dynamically based on search box input
  const filteredStudents = cls.students.filter(student => 
    student.toLowerCase().includes(query)
  );

  listElement.innerHTML = "";

  if (filteredStudents.length === 0) {
    listElement.innerHTML = `<li class="empty-list-message">No matching students found</li>`;
    return;
  }

  filteredStudents.forEach(studentName => {
    const isAbsent = state.absentStudents.has(studentName);
    const li = document.createElement("li");
    li.className = `student-item ${isAbsent ? 'is-absent' : ''}`;
    
    li.innerHTML = `
      <div class="student-checkbox-col">
        <input type="checkbox" class="student-checkbox" aria-label="Mark ${studentName} absent" ${isAbsent ? 'checked' : ''}>
      </div>
      <div class="student-info-col">
        <span class="student-name">${studentName}</span>
        <span class="student-status-text">${isAbsent ? 'Absent' : 'Present'}</span>
      </div>
    `;

    // Handle checkboxes directly (prevent bubbling trigger)
    li.querySelector('.student-checkbox').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStudentSelection(cls, studentName);
    });

    // Tap anywhere on the row to check/uncheck
    li.addEventListener("click", () => {
      toggleStudentSelection(cls, studentName);
    });

    listElement.appendChild(li);
  });
}

// 7. Toggle Student Selection State
function toggleStudentSelection(cls, studentName) {
  const classId = cls.id;
  const state = appState[classId];

  if (state.absentStudents.has(studentName)) {
    state.absentStudents.delete(studentName);
  } else {
    state.absentStudents.add(studentName);
  }

  // Update badge stats
  updateStatsBadge(classId);

  // Re-render list
  renderStudentList(cls);
}

// 8. Update dynamic absent count badge
function updateStatsBadge(classId) {
  const badge = document.getElementById(`badge-${classId}`);
  if (!badge) return;

  const count = appState[classId].absentStudents.size;
  badge.textContent = `${count} Absent`;

  if (count > 0) {
    badge.classList.add("active-absent");
  } else {
    badge.classList.remove("active-absent");
  }
}

// 9. Bind interaction events to the active class card
function bindCardEvents(cls) {
  const classId = cls.id;

  // Good morning toggle
  const gmToggle = document.getElementById(`gm-${classId}`);
  gmToggle.addEventListener("change", (e) => {
    appState[classId].includeGoodMorning = e.target.checked;
  });

  // Numbering toggle
  const numToggle = document.getElementById(`num-${classId}`);
  numToggle.addEventListener("change", (e) => {
    appState[classId].numbering = e.target.checked;
  });

  // Search input actions
  const searchInput = document.getElementById(`search-${classId}`);
  const clearSearchBtn = document.getElementById(`search-clear-${classId}`);

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    appState[classId].searchQuery = query;

    if (query.length > 0) {
      clearSearchBtn.style.display = "flex";
    } else {
      clearSearchBtn.style.display = "none";
    }

    renderStudentList(cls);
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    appState[classId].searchQuery = "";
    clearSearchBtn.style.display = "none";
    renderStudentList(cls);
    searchInput.focus();
  });

  // Copy WhatsApp Message Action
  const copyBtn = document.getElementById(`btn-copy-${classId}`);
  copyBtn.addEventListener("click", () => {
    copyWhatsAppMessage(cls);
  });

  // Clear selections Action
  const clearBtn = document.getElementById(`btn-clear-${classId}`);
  clearBtn.addEventListener("click", () => {
    clearAllSelection(cls);
  });
}

// 10. Reset Selections for current active class standard
function clearAllSelection(cls) {
  const classId = cls.id;
  
  appState[classId].absentStudents.clear();
  updateStatsBadge(classId);
  renderStudentList(cls);

  showToast(`Cleared selections for ${cls.title}`);
}

// 11. Format and copy WhatsApp Message (incorporating bold formatting and date)
function copyWhatsAppMessage(cls) {
  const classId = cls.id;
  const state = appState[classId];
  const classTitle = cls.title;

  // Format today's date as DD/MM/YYYY dynamically
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  // Build message
  let messageParts = [];

  if (state.includeGoodMorning) {
    messageParts.push("Good morning Everyone 🙏\n");
  }

  messageParts.push(`*${classTitle} class absent students list (${formattedDate}):*\n`);

  if (state.absentStudents.size === 0) {
    messageParts.push("No absent students.");
  } else {
    // Keep absolute list order (as written in array) to avoid layout shift/jitter
    const sortedAbsentees = cls.students.filter(student => 
      state.absentStudents.has(student)
    );

    if (state.numbering) {
      const numberedList = sortedAbsentees.map((name, index) => 
        `${index + 1}. ${name}`
      ).join("\n");
      messageParts.push(numberedList);
    } else {
      messageParts.push(sortedAbsentees.join("\n"));
    }
  }

  const finalMessage = messageParts.join("\n");

  // Copy to clipboard
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(finalMessage)
      .then(() => {
        showToast(`Copied ${classTitle} list!`);
      })
      .catch(err => {
        console.error("Clipboard copy failed, using fallback:", err);
        fallbackCopyToClipboard(finalMessage, classTitle);
      });
  } else {
    fallbackCopyToClipboard(finalMessage, classTitle);
  }
}

// Fallback clipboard copying for older mobile browsers
function fallbackCopyToClipboard(text, classTitle) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast(`Copied ${classTitle} list!`);
    } else {
      showToast("Unable to copy. Please try again.");
    }
  } catch (err) {
    console.error("Fallback copy execution failed:", err);
    showToast("Copy failed. Please copy manually.");
  }

  document.body.removeChild(textArea);
}

// 12. Display toast feedback
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-msg");
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  
  clearTimeout(toastTimeout);
  toast.classList.add("show");

  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

// 13. Horizontal navigation tab swiper logic
function initTabs() {
  const navItems = document.querySelectorAll(".nav-item");
  const navContainer = document.querySelector(".quick-nav");

  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      
      const targetClass = item.getAttribute("data-class");
      if (activeClassId === targetClass) return;

      activeClassId = targetClass;

      // Update active styling
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");

      // Scroll selected tab to center of slider on mobile
      if (navContainer) {
        const leftOffset = item.offsetLeft - navContainer.clientWidth / 2 + item.clientWidth / 2;
        navContainer.scrollTo({
          left: leftOffset,
          behavior: 'smooth'
        });
      }

      // Re-render class standard section
      renderActiveSection();
    });
  });
}
