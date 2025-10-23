let modal = new bootstrap.Modal(document.getElementById("editModal"));
let toastEl = document.getElementById("liveToast");
let toast = new bootstrap.Toast(toastEl);
let overlay = document.getElementById("loadingOverlay");
let currentField = "";


// ✅ Fonction pour afficher un toast
function showToast(message, type = "success") {
  const toastBody = document.getElementById("toastMessage");
  toastBody.textContent = message;

  toastEl.classList.remove("text-bg-success", "text-bg-danger");
  toastEl.classList.add(type === "success" ? "text-bg-success" : "text-bg-danger");

  toast.show();
  hideLoader();
}

// ✅ Gestion de l'affichage du spinner
function showLoader() {
  console.log("Loading");
  //overlay.style.display = "flex";
   document.getElementById('loadingOverlay').classList.remove('d-none');
}
function hideLoader() {
  //overlay.style.display = "none";
  document.getElementById('loadingOverlay').classList.add('d-none');
}

// ✅ Ouvrir la modale
function openModal(field, currentValue) {
  currentField = field;
  document.getElementById("fieldName").value = field;
  document.getElementById("editInput").value = currentValue;
  modal.show();
}

// ✅ Sauvegarde d’un champ texte
document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const field = document.getElementById("fieldName").value;
  const value = document.getElementById("editInput").value.trim();
  if (!value) return showToast("Le champ ne peut pas être vide.", "error");

  showLoader();

  try {
    const res = await fetch("/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ field, value })
    });

    const data = await res.json();
    if (data.success) {
      document.getElementById(field + "Field").textContent = value;
      showToast("Mise à jour réussie !");
      modal.hide();
    } else {
      showToast("Erreur : " + (data.error || "mise à jour impossible"), "error");
    }
  } catch (err) {
    showToast("Erreur réseau : " + err.message, "error");
  } finally {
    hideLoader();
  }
});

// ✅ Gestion de l'upload de l'avatar
document.getElementById("avatarInput").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Prévisualisation
  const preview = document.getElementById("avatarPreview");
  preview.src = URL.createObjectURL(file);

  showLoader();

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await fetch("/upload-avatar", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      showToast("Avatar mis à jour !");
    } else {
      showToast("Erreur lors de l'upload : " + data.error, "error");
    }
  } catch (err) {
    showToast("Erreur réseau : " + err.message, "error");
  } finally {
  
  }
});

