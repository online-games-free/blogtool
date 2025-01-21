document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("dwgFile")
  const convertBtn = document.getElementById("convertBtn")
  const statusDiv = document.getElementById("status")

  convertBtn.addEventListener("click", () => {
    const file = fileInput.files[0]
    if (!file) {
      statusDiv.textContent = "Please select a DWG file."
      return
    }

    // In a real-world scenario, you would send the file to a server for conversion
    // Here, we'll simulate the conversion process with a timeout
    statusDiv.textContent = "Converting..."
    convertBtn.disabled = true

    setTimeout(() => {
      // Simulating a successful conversion
      const pdfBlob = new Blob(["Simulated PDF content"], { type: "application/pdf" })
      const pdfUrl = URL.createObjectURL(pdfBlob)

      const downloadLink = document.createElement("a")
      downloadLink.href = pdfUrl
      downloadLink.download = file.name.replace(".dwg", ".pdf")
      downloadLink.textContent = "Download PDF"
      downloadLink.style.display = "block"
      downloadLink.style.marginTop = "1rem"

      statusDiv.textContent = "Conversion complete!"
      statusDiv.appendChild(downloadLink)

      convertBtn.disabled = false
    }, 3000) // Simulating a 3-second conversion process
  })
})

