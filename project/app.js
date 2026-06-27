const APPWRITE_ENDPOINT = "https://sfo.cloud.appwrite.io/v1"; // Default Appwrite Cloud endpoint
const APPWRITE_PROJECT_ID = "6a164502001e49a1bd00"; // Replace with your Project ID
const APPWRITE_DATABASE_ID = "6a16538600180beb1e42"; // Replace with your Database ID
const APPWRITE_COLLECTION_ID = "tb_voters";

// Initialize the Appwrite client
const { Client, Account, Databases, ID } = Appwrite;
const client = new Client();
client
  .setEndpoint("https://sfo.cloud.appwrite.io/v1")
  .setProject("6a164502001e49a1bd00");

const account = new Account(client);
const databases = new Databases(client);

// mobile responsive
const mobileManuBtn = document.getElementById("mobile-menu-btn");
const closeMobileMenuBtn = document.getElementById("close-mobile-menu-btn");
const mobileSidebar = document.getElementById("mobile");
const sidebarOverlay = document.getElementById("sidebar-overlay");

if (mobileManuBtn && closeMobileMenuBtn && mobileSidebar && sidebarOverlay) {
  // open sidebar
  mobileManuBtn.addEventListener("click", () => {
    mobileSidebar.classList.remove("-transition-x-full");
    sidebarOverlay.classList.remove("hidden");
  });

  // close-sidebar
  const closeMenu = () => {
    mobileSidebar.classList.add("-transition-x-full");
    sidebarOverlay.classList.add("hidden");
  };

  closeMobileMenuBtn.addEventListener("click", closeMenu);
  sidebarOverlay.addEventListener("click", closeMenu);
}

// logout
const logoutLink = Array.from(document.querySelectorAll("a")).filter((a) =>
  a.innerHTML.includes("fa-right-from-bracket"),
);
logoutLink.forEach((link) => {
  link.addEventListener("click", async (e) => {
    e.preventDefault();
    try {
      // delete current session from appwrite
      await account.deleteSession("current");
      console.log("Logged out successfully!!");
    } catch (err) {
      console.log("logout Failed or no active:", err.message);
    }
    // redirect to index
    window.location.href = "index.html";
  });
});

// registration
const registerForm = document.getElementById("register");
const registrationDateInput = document.getElementById("registrationDate");

if (registerForm) {
  const today = new Date().toISOString().split("T")[0];

  // auto register by today
  if (registrationDateInput) {
    registrationDateInput.value = today;
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // hide previous error
    const errorAlert = document.getElementById("error-alert");
    if (errorAlert) errorAlert.classList.add("hidden");

    // fetch input
    const fullname = document.getElementById("fullname").value.trim();
    const dob = document.getElementById("dob").value;
    const ph = document.getElementById("ph").value.trim();
    const IDcard = document.getElementById("IDcard").value.trim();
    const province = document.getElementById("province").value;
    const city = document.getElementById("city").value.trim();
    const commune = document.getElementById("commune").value.trim();
    const regDate = registrationDateInput ? registrationDateInput.value : today;

    // validation
    if (!fullname || !dob || !ph || !IDcard || !province || !city || !commune) {
      showRegisterError(
        "សូមបំពេញព័ត៌មានដែលខ្វះខាត / Please fill in all required fields.",
        "សូមពិនិត្យឡើងវិញ / Validation Error"
      );
      return;
    }

    // 18y or more 
    const birthDate = new Date(dob);
    const todayDate = new Date();
    let age = todayDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = todayDate.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && todayDate.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      showRegisterError(
        "អ្នកត្រូវតែមានអាយុចាប់ពី ១៨ ឆ្នាំឡើងទៅដើម្បីចុះឈ្មោះបោះឆ្នោត / You must be 18 years or older to register.",
        "អាយុមិនគ្រប់លក្ខខណ្ឌ / Age Requirement Not Met"
      );
      return;
    }

    // show loading spinner
    const loadingRegi = document.getElementById("loading-regi");
    if (loadingRegi) loadingRegi.classList.remove("hidden");

    try {
      // save into appwrite
      await databases.createDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        ID.unique(),
        {
          fullname: fullname,
          dob: dob,
          ph: ph,
          IDcard: IDcard,
          province: province,
          city: city,
          commune: commune,
          registrationDate: regDate,
        },
      );

      // hide loading spinner
      if (loadingRegi) loadingRegi.classList.add("hidden");

      // show detail inside
      document.getElementById("summary-name").textContent = fullname;
      document.getElementById("summary-id").textContent = IDcard;
      document.getElementById("summary-phone").textContent = ph;
      document.getElementById("summary-province").textContent = province;

      // open success
      const successModal = document.getElementById("success");
      if (successModal) successModal.classList.remove("hidden");

      // clear input
      registerForm.reset();
      if (registrationDateInput) {
        registrationDateInput.value = today;
      }
    } catch (error) {
      // no loading
      if (loadingRegi) loadingRegi.classList.add("hidden");
      showRegisterError(error.message, "កំហុសប្រព័ន្ធទិន្នន័យ / Database Error");
    }
  });

  const closeSuccessBtn = document.getElementById("close-success-btn");
  const successModel = document.getElementById("success");
  if (closeSuccessBtn && successModel) {
    closeSuccessBtn.addEventListener("click", () => {
      successModel.classList.add("hidden");
    });
  }
}

function showRegisterError(message, title = "សូមពិនិត្យឡើងវិញ / Please Check it again....") {
  const errorAlert = document.getElementById("error-alert");
  const errorTitle = document.getElementById("error-title");
  const errorMes = document.getElementById("error-mes");

  if (errorAlert && errorMes) {
    errorMes.textContent = message;
    if (errorTitle) {
      errorTitle.textContent = title;
    }
    errorAlert.classList.remove("hidden");
  }
}

// login
const loginForm = document.getElementById("login_form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // hide previous error
    const errorAlert = document.getElementById("error");
    if (errorAlert) errorAlert.classList.add("hidden");

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    // loding screen
    const loadingSpinner = document.getElementById("loading");
    if (loadingSpinner) loadingSpinner.classList.remove("hidden");
    try {
      // log user from appwrite
      await account.createEmailPasswordSession(email, password);

      // hide loadingSpinner
      if (loadingSpinner) loadingSpinner.classList.add("hidden");

      // redirect to dashbord
      window.location.href = "dashboard.html";
    } catch (error) {
      if (loadingSpinner) loadingSpinner.classList.add("hidden");

      // show-error
      const errorMsg = document.getElementById("error-message");
      if (errorAlert && errorMsg) {
        errorMsg.textContent = error.message;
        errorAlert.classList.remove("hidden");
      }
    }
  });
}

// dashbord page
const voterTableBody = document.getElementById("voters-table-body");
let allVoters = []; //local copy of voter for search
let selectVoterId = null; //store ID of voter to edit or delete

// dashboard page initialization
const initDashboard = async () => {
  const loadingBlock = document.getElementById("loading-block");
  try {
    // retrieve current user
    await account.get();

    if (loadingBlock) loadingBlock.classList.add("hidden");

    // load record
    loadVoterRecords();
  } catch (error) {
    console.error("Unauthorized. Redirecting to login.html:", error.message);
    window.location.href = "login.html";
  }
};

if (voterTableBody) {
  initDashboard();
}

// load voter record from appwrite
async function loadVoterRecords() {
  const tableBody = document.getElementById("voters-table-body");
  if (!tableBody) return;

  // show table
  tableBody.innerHTML = `
        <tr>
            <td colspan="8" class="text-center py-8 text-slate-400 font-medium">
                <div class="flex flex-col items-center space-y-2">
                    <i class="fa-solid fa-circle-notch animate-spin text-lg text-blue-800"></i>
                    <span>កំពុងទាញយកទិន្នន័យ... (Fetching records...)</span>
                </div>
            </td>
        </tr>`;

  try {
    const response = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      APPWRITE_COLLECTION_ID,
      [Appwrite.Query.limit(100), Appwrite.Query.orderDesc("registrationDate")],
    );

    allVoters = response.documents;

    // render counters
    updateStatus();

    // render table
    renderVoterTable(allVoters);
  } catch (error) {
    console.error("Error fetching data from Appwrite:", error);
    tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-8 text-rose-500 font-bold">
                    ចាក់សោទិន្នន័យ/Error: ${error.message}
                </td>
            </tr>`;
  }
}

// update states number
function renderVoterTable(voterList) {
  const tableBody = document.getElementById("voters-table-body");
  if (!tableBody) return;

  if (voterList.length == 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-8 text-slate-400 font-medium">
                    រកមិនឃើញទិន្នន័យ (No records found)
                </td>
            </tr>`;
    return;
  }

  tableBody.innerHTML = ""; //delete this old be4 store new

  voterList.forEach((voter) => {
    const row = document.createElement("tr");
    row.className =
      "border-b border-slate-100 hover:bg-slate-50 transition duration-150";

    row.innerHTML = `
            <td class="py-3.5 px-4 font-bold text-slate-800">${escapeHtml(voter.fullname)}</td>
            <td class="py-3.5 px-4 text-slate-600">${escapeHtml(voter.dob)}</td>
            <td class="py-3.5 px-4 text-slate-600">${escapeHtml(voter.ph)}</td>
            <td class="py-3.5 px-4 text-slate-600 font-semibold">${escapeHtml(voter.IDcard)}</td>
            <td class="py-3.5 px-4 text-slate-600">${escapeHtml(voter.province)}</td>
            <td class="py-3.5 px-4 text-slate-500">${escapeHtml(voter.city)} - ${escapeHtml(voter.commune)}</td>
            <td class="py-3.5 px-4 text-slate-600">${escapeHtml(voter.registrationDate)}</td>
            <td class="py-3.5 px-4 text-center">
                <div class="flex items-center justify-center space-x-2">
                    <button class="edit-voter-btn bg-indigo-50 hover:bg-indigo-100 text-indigo-600 p-1.5 rounded-lg transition active:scale-90" data-id="${voter.$id}">
                        <i class="fa-regular fa-pen-to-square text-xs"></i>
                    </button>
                    <button class="delete-voter-btn bg-rose-50 hover:bg-rose-100 text-rose-600 p-1.5 rounded-lg transition active:scale-90" data-id="${voter.$id}">
                        <i class="fa-regular fa-trash-can text-xs"></i>
                    </button>
                </div>
            </td>
        `;
    tableBody.appendChild(row);
  });
  // Wire up listeners to dynamic action buttons
  attachRowActionListeners();
}

// edit or delete on table row
function attachRowActionListeners() {
  // trigger delete
  const deleteBtns = document.querySelectorAll(".delete-voter-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      selectVoterId = btn.getAttribute("data-id");
      const deleteModal = document.getElementById("cd-delete");
      if (deleteModal) deleteModal.classList.remove("hidden");
    });
  });

  // edit trigger
  const editBtns = document.querySelectorAll(".edit-voter-btn");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const voter = allVoters.find((v) => v.$id === id);
      if (!voter) return;
      selectVoterId = id;

      // load value to field
      document.getElementById("edit-voter").value = id;
      document.getElementById("edit-fullName").value = voter.fullname || "";
      document.getElementById("edit-dob").value = voter.dob || "";
      document.getElementById("edit-ph").value = voter.ph || "";
      document.getElementById("edit-ID").value = voter.IDcard || "";
      document.getElementById("edit-province").value = voter.province || "";
      document.getElementById("edit-district").value = voter.city || ""; // maps to 'city' property in database
      document.getElementById("edit-commune").value = voter.commune || "";

      // show edit model
      const editModal = document.getElementById("model");
      if (editModal) editModal.classList.remove("hidden");
    });
  });
}

// edit & delete
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
const deleteModal = document.getElementById("cd-delete");

// cancel del
if (cancelDeleteBtn && deleteModal) {
  cancelDeleteBtn.addEventListener("click", () => {
    deleteModal.classList.add("hidden");
    selectVoterId = null;
  });
}

// cf-del in appwrite
if (confirmDeleteBtn && deleteModal) {
  confirmDeleteBtn.addEventListener("click", async () => {
    if (!selectVoterId) return;

    showDashboardLoading(true);
    try {
      await databases.deleteDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        selectVoterId,
      );

      deleteModal.classList.add("hidden");
      showDashboardLoading(false);

      // toast alert
      showToast("លុបបានដោយជោគជ័យ / Record deleted successfully!!!");

      // refresh list
      loadVoterRecords();
    } catch (error) {
      showDashboardLoading(false);
      alert("Failed to delete record: " + error.message);
    } finally {
      selectVoterId = null;
    }
  });
}

// cancel & close edit
const editModal = document.getElementById("model");
const cancelEditBtn = document.getElementById("cancel-btn");
const closeEditModalBtn = document.getElementById("edit-btn"); //the X icon
const editForm = document.getElementById("edit-form");

if (cancelEditBtn && editModal) {
  cancelEditBtn.addEventListener("click", () => {
    editModal.classList.add("hidden");
    selectVoterId = null;
  });
}

if (closeEditModalBtn && editModal) {
  closeEditModalBtn.addEventListener("click", () => {
    editModal.classList.add("hidden");
    selectVoterId = null;
  });
}

// edit form submit
if (editForm && editModal) {
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("edit-voter").value;
    const fullname = document.getElementById("edit-fullName").value.trim();
    const dob = document.getElementById("edit-dob").value;
    const ph = document.getElementById("edit-ph").value.trim();
    const IDcard = document.getElementById("edit-ID").value.trim();
    const province = document.getElementById("edit-province").value;
    const city = document.getElementById("edit-district").value.trim();
    const commune = document.getElementById("edit-commune").value.trim();

    // clear previous edit error
    const editAlert = document.getElementById("edit-alert");
    if (editAlert) editAlert.classList.add("hidden");

    if (!fullname || !dob || !ph || !IDcard || !province || !city || !commune) {
      showEditError(
        "សូមបំពេញព័ត៌មានដែលខ្វះខាត / Please fill in all required fields!!",
      );
      return;
    }

    showDashboardLoading(true);
    try {
      await databases.updateDocument(
        APPWRITE_DATABASE_ID,
        APPWRITE_COLLECTION_ID,
        id,
        {
          fullname: fullname,
          dob: dob,
          ph: ph,
          IDcard: IDcard,
          province: province,
          city: city,
          commune: commune,
        },
      );
      editModal.classList.add("hidden");
      showDashboardLoading(false);

      // toast alert
      showToast("រក្សាទុកបានជោគជ័យ / Record updated successfully!!!");

      // refresh list
      loadVoterRecords();
    } catch (error) {
      showDashboardLoading(false);
      showEditError(error.message);
    }
  });
}

// instant search
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const searchClearBtn = document.getElementById("btn-search-clear");

if (searchInput) {
  // search when btn click
  if (searchBtn) {
    searchBtn.addEventListener("click", performLocalSearch);
  }

  // search press enter key
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      performLocalSearch();
    }
  });

  // clear btn visibility
  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() !== "") {
      if (searchClearBtn) searchClearBtn.classList.remove("hidden");
    } else {
      if (searchClearBtn) searchClearBtn.classList.add("hidden");
      performLocalSearch(); //clear filter and show all
    }
  });
}

// btn trigger clear
if (searchClearBtn && searchInput) {
  searchClearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchClearBtn.classList.add("hidden");
    performLocalSearch();
  });
}

function performLocalSearch() {
  const query = searchInput.value.trim().toLowerCase();

  if (query === "") {
    renderVoterTable(allVoters);
    return;
  }

  const filtered = allVoters.filter((voter) => {
    const fullname = (voter.fullname || "").toLowerCase();
    const IDcard = (voter.IDcard || "").toLowerCase();
    const ph = (voter.ph || "").toLowerCase();
    const province = (voter.province || "").toLowerCase();
    const city = (voter.city || "").toLowerCase();
    const commune = (voter.commune || "").toLowerCase();

    return fullname.includes(query) ||
      IDcard.includes(query) ||
      ph.includes(query) ||
      province.includes(query) ||
      city.includes(query) ||
      commune.includes(query);
  });

  renderVoterTable(filtered);
}

// login dashbord utilities
// login dashbord utilities
function showDashboardLoading(show) {
  const loadingDash = document.getElementById("loading-dash");
  if (loadingDash) {
    if (show) {
      loadingDash.classList.remove("hidden");
    } else {
      loadingDash.classList.add("hidden");
    }
  }
}

function showToast(message) {
  const toast = document.getElementById("board");
  const toastText = document.getElementById("toast-text");
  if (toast && toastText) {
    toastText.textContent = message;

    // slide up and fade
    toast.classList.remove(
      "opacity-0",
      "translate-y-10",
      "pointer-events-none",
    );
    toast.classList.add("opacity-100", "translate-y-0");

    // hide for 3s
    setTimeout(() => {
      toast.classList.remove("opacity-100", "translate-y-0");
      toast.classList.add("opacity-0", "translate-y-10", "pointer-events-none");
    }, 3000);
  }
}

function showEditError(message) {
  const editAlert = document.getElementById("edit-alert");
  const editErrorMsg = document.getElementById("edit-error-message");
  if (editAlert && editErrorMsg) {
    editErrorMsg.textContent = message;
    editAlert.classList.remove("hidden");
  }
}

function updateStatus() {
  const totalVoterCount = document.getElementById("total-voter-count");
  const totalProvinCount = document.getElementById("total-provin-count");
  if (totalVoterCount) {
    totalVoterCount.textContent = allVoters.length;
  }
  if (totalProvinCount) {
    const provinces = allVoters.map(v => v.province).filter(Boolean);
    const uniqueProvinces = new Set(provinces);
    totalProvinCount.textContent = uniqueProvinces.size;
  }
}

// HTML escape helper to prevent XSS issues when rendering values
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
