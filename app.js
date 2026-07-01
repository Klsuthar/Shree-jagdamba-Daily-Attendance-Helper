// Shree Jagdamba Daily Attendance Helper - PWA Combined App Logic

// 1. Hardcoded Class and Student Database
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
const appState = {
  includeGoodMorning: false, // Default is disabled
  numbering: true,           // Default is enabled
  activeClassId: "nursery-lkg"
};

// Selections map to track absent students per class standard
// Selections map to track absent students per class standard
const classSelections = {};
CLASS_DATA.forEach(cls => {
  classSelections[cls.id] = {
    absentStudents: new Set(),
    noAbsenteesChecked: false
  };
});

// 3. Initialization on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Set date in header
  updateHeaderDate();

  // Render navigation tabs
  renderTabs();

  // Render the current active class standard view
  renderActiveSection();

  // Bind global control checkbox handlers and buttons
  bindGlobalEvents();
});

// 4. Update Header Date
function updateHeaderDate() {
  const dateElement = document.getElementById("current-date");
  if (!dateElement) return;

  const options = { weekday: 'long', month: 'short', day: 'numeric' };
  const today = new Date();
  
  dateElement.textContent = today.toLocaleDateString('en-US', options);
}

// 5. Render Navigation tabs (including selection count badges)
function renderTabs() {
  const navContainer = document.getElementById("class-tabs");
  if (!navContainer) return;

  navContainer.innerHTML = "";

  CLASS_DATA.forEach(cls => {
    const isActive = cls.id === appState.activeClassId;
    const selections = classSelections[cls.id];
    const count = selections.absentStudents.size;
    const isNoAbsent = selections.noAbsenteesChecked;
    
    const a = document.createElement("a");
    a.href = `#${cls.id}`;
    a.className = `nav-item ${isActive ? 'active' : ''}`;
    a.setAttribute("data-class", cls.id);
    
    // Append badge dynamically if selections exist
    let tabText = cls.title;
    if (count > 0) {
      tabText += ` <span class="tab-badge">${count}</span>`;
    } else if (isNoAbsent) {
      tabText += ` <span class="tab-badge" style="background-color: var(--success)">✓</span>`;
    }
    a.innerHTML = tabText;

    a.addEventListener("click", (e) => {
      e.preventDefault();
      if (appState.activeClassId === cls.id) return;
      
      appState.activeClassId = cls.id;
      
      // Refresh tabs & active section
      renderTabs();
      renderActiveSection();
      
      // Auto scroll selected tab to center on mobile
      const leftOffset = a.offsetLeft - navContainer.clientWidth / 2 + a.clientWidth / 2;
      navContainer.scrollTo({
        left: leftOffset,
        behavior: 'smooth'
      });
    });

    navContainer.appendChild(a);
  });
}

// 6. Render active class section viewport
function renderActiveSection() {
  const container = document.getElementById("sections-container");
  if (!container) return;

  const cls = CLASS_DATA.find(c => c.id === appState.activeClassId);
  if (!cls) return;

  // Build layout for selected class
  container.innerHTML = `
    <div class="class-view">
      <!-- Class info bar -->
      <div class="class-info-bar">
        <span class="class-info-title">${cls.title} Class</span>
        <span class="status-badge" id="badge-${cls.id}">0 Absent</span>
      </div>

      <!-- Scrollable list -->
      <div class="student-list-container">
        <ul class="student-list" id="list-${cls.id}"></ul>
      </div>
    </div>
  `;

  // Render the student list rows
  renderStudentList(cls);

  // Update dynamic absent counts badge
  updateStatsBadge(cls.id);
}

// 7. Render Student rows inside the list (including numbering index)
function renderStudentList(cls) {
  const classId = cls.id;
  const listElement = document.getElementById(`list-${classId}`);
  if (!listElement) return;

  const selections = classSelections[classId];
  listElement.innerHTML = "";

  if (cls.students.length === 0) {
    listElement.innerHTML = `<li class="empty-list-message">No students found</li>`;
    return;
  }

  // Render the special "No student absent" row at the top
  const isNoAbsent = selections.noAbsenteesChecked;
  const noAbsentLi = document.createElement("li");
  noAbsentLi.className = `student-item no-absent-row ${isNoAbsent ? 'is-no-absent' : ''}`;
  
  noAbsentLi.innerHTML = `
    <div class="student-checkbox-col">
      <input type="checkbox" class="student-checkbox" aria-label="Mark all present" ${isNoAbsent ? 'checked' : ''}>
    </div>
    <div class="student-info-col">
      <span class="student-name">No student absent</span>
    </div>
  `;

  noAbsentLi.querySelector('.student-checkbox').addEventListener('click', (e) => {
    e.stopPropagation();
    toggleNoAbsentSelection(cls);
  });

  noAbsentLi.addEventListener("click", () => {
    toggleNoAbsentSelection(cls);
  });

  listElement.appendChild(noAbsentLi);

  // Render normal student rows
  cls.students.forEach((studentName, index) => {
    const isAbsent = selections.absentStudents.has(studentName);
    const li = document.createElement("li");
    li.className = `student-item ${isAbsent ? 'is-absent' : ''}`;
    
    li.innerHTML = `
      <div class="student-checkbox-col">
        <input type="checkbox" class="student-checkbox" aria-label="Mark ${studentName} absent" ${isAbsent ? 'checked' : ''}>
      </div>
      <div class="student-info-col">
        <span class="student-name">${index + 1}. ${studentName}</span>
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

// 8. Toggle "No student absent" Option
function toggleNoAbsentSelection(cls) {
  const classId = cls.id;
  const selections = classSelections[classId];

  selections.noAbsenteesChecked = !selections.noAbsenteesChecked;

  if (selections.noAbsenteesChecked) {
    // Clear all specific absent student selections for this class
    selections.absentStudents.clear();
  }

  // Update badge stats
  updateStatsBadge(classId);

  // Re-render list
  renderStudentList(cls);

  // Update tabs to refresh counters
  renderTabs();
}

// 9. Toggle Student Selection State
function toggleStudentSelection(cls, studentName) {
  const classId = cls.id;
  const selections = classSelections[classId];

  if (selections.absentStudents.has(studentName)) {
    selections.absentStudents.delete(studentName);
  } else {
    selections.absentStudents.add(studentName);
    // Uncheck "No student absent" if a student is marked absent
    selections.noAbsenteesChecked = false;
  }

  // Update badge stats
  updateStatsBadge(classId);

  // Re-render list
  renderStudentList(cls);

  // Update tabs to refresh counters
  renderTabs();
}

// 10. Update dynamic absent count badge
function updateStatsBadge(classId) {
  const badge = document.getElementById(`badge-${classId}`);
  if (!badge) return;

  const selections = classSelections[classId];
  const count = selections.absentStudents.size;
  const isNoAbsent = selections.noAbsenteesChecked;

  if (isNoAbsent) {
    badge.textContent = "All Present";
    badge.classList.add("active-absent");
    badge.style.backgroundColor = "var(--success-light)";
    badge.style.color = "var(--success)";
  } else {
    badge.textContent = `${count} Absent`;
    badge.style.backgroundColor = "";
    badge.style.color = "";
    if (count > 0) {
      badge.classList.add("active-absent");
    } else {
      badge.classList.remove("active-absent");
    }
  }
}

// 11. Bind global actions & options triggers
function bindGlobalEvents() {
  // Good morning toggle
  const gmToggle = document.getElementById("global-gm");
  if (gmToggle) {
    gmToggle.checked = appState.includeGoodMorning;
    gmToggle.addEventListener("change", (e) => {
      appState.includeGoodMorning = e.target.checked;
    });
  }

  // Numbering toggle
  const numToggle = document.getElementById("global-num");
  if (numToggle) {
    numToggle.checked = appState.numbering;
    numToggle.addEventListener("change", (e) => {
      appState.numbering = e.target.checked;
    });
  }

  // Copy Action
  const copyBtn = document.getElementById("global-btn-copy");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      copyCombinedWhatsAppMessage();
    });
  }

  // Clear Action
  const clearBtn = document.getElementById("global-btn-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearAllSelections();
    });
  }
}

// 12. Clear all selections across all tabs
function clearAllSelections() {
  for (const id in classSelections) {
    classSelections[id].absentStudents.clear();
    classSelections[id].noAbsenteesChecked = false;
  }

  // Re-render views and update badges
  renderTabs();
  renderActiveSection();

  showToast("Cleared all class selections!");
}

// 13. Compile and copy WhatsApp message containing all selected standard absentees
function copyCombinedWhatsAppMessage() {
  // Check if there are any selections or no-absent declarations across all standards
  let hasAnySelections = false;
  for (const id in classSelections) {
    const selections = classSelections[id];
    if (selections.absentStudents.size > 0 || selections.noAbsenteesChecked) {
      hasAnySelections = true;
      break;
    }
  }

  // Build message
  let messageParts = [];

  if (appState.includeGoodMorning) {
    messageParts.push("Good morning Everyone 🙏\n");
  }

  if (!hasAnySelections) {
    messageParts.push("*Shree Jagdamba Convent School*\nAbsent students list:\n\nNo absent students.");
  } else {
    // Compile selection list class-by-class
    CLASS_DATA.forEach(cls => {
      const selections = classSelections[cls.id];
      const hasAbsentees = selections.absentStudents.size > 0;
      const isNoAbsent = selections.noAbsenteesChecked;

      if (hasAbsentees || isNoAbsent) {
        messageParts.push(`*${cls.title} class absent students list:*`);

        if (isNoAbsent) {
          messageParts.push("No absent students.\n");
        } else {
          // Sort names in the original array order to keep layout stable
          const sortedAbsentees = cls.students.filter(student => 
            selections.absentStudents.has(student)
          );

          if (appState.numbering) {
            const numberedList = sortedAbsentees.map((name, index) => 
              `${index + 1}. ${name}`
            ).join("\n");
            messageParts.push(numberedList + "\n");
          } else {
            messageParts.push(sortedAbsentees.join("\n") + "\n");
          }
        }
      }
    });
  }

  const finalMessage = messageParts.join("\n").trim();

  // Copy to clipboard
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(finalMessage)
      .then(() => {
        showToast("Copied combined attendance list!");
      })
      .catch(err => {
        console.error("Clipboard copy failed, using fallback:", err);
        fallbackCopyToClipboard(finalMessage);
      });
  } else {
    fallbackCopyToClipboard(finalMessage);
  }
}

// Fallback clipboard copy for older browsers
function fallbackCopyToClipboard(text) {
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
      showToast("Copied combined attendance list!");
    } else {
      showToast("Unable to copy. Please try again.");
    }
  } catch (err) {
    console.error("Fallback copy execution failed:", err);
    showToast("Copy failed. Please copy manually.");
  }

  document.body.removeChild(textArea);
}

// 13. Display toast feedback
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

// 14. Service Worker Registration for PWA Offline Functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('PWA Service Worker registered scope:', reg.scope))
      .catch(err => console.error('PWA Service Worker registration failed:', err));
  });
}
