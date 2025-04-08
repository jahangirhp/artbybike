document.addEventListener("DOMContentLoaded", () => {
  const uploadBtn = document.getElementById("uploadBtn");
  const fileInput = document.getElementById("fileInput");
  const resultBox = document.getElementById("upload-status");

  uploadBtn.addEventListener("click", async () => {
    const file = fileInput.files[0];

    if (!file) {
      resultBox.innerText = "Please select a file first.";
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        resultBox.innerText = `✅ Upload successful!`;
      } else {
        resultBox.innerText = `❌ Error: ${data.error}`;
      }
    } catch (err) {
      console.error(err);
      resultBox.innerText = "❌ Upload failed.";
    }
  });
});
