document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput")
  const fileName = document.getElementById("fileName")
  const convertBtn = document.getElementById("convertBtn")
  const statusDiv = document.getElementById("status")
  const conversionToggle = document.getElementById("conversionToggle")

  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      fileName.textContent = e.target.files[0].name
    } else {
      fileName.textContent = "No file chosen"
    }
  })

  convertBtn.addEventListener("click", () => {
    const file = fileInput.files[0]
    if (!file) {
      statusDiv.textContent = "Please select a file."
      return
    }

    const isDwgToPdf = !conversionToggle.checked
    const fromFormat = isDwgToPdf ? "DWG" : "PDF"
    const toFormat = isDwgToPdf ? "PDF" : "DWG"

    statusDiv.textContent = `Converting ${fromFormat} to ${toFormat}...`
    convertBtn.disabled = true

    setTimeout(() => {
      // Simulating a successful conversion
      const convertedBlob = new Blob([`Simulated ${toFormat} content`], {
        type: isDwgToPdf ? "application/pdf" : "application/acad",
      })
      const convertedUrl = URL.createObjectURL(convertedBlob)

      const downloadLink = document.createElement("a")
      downloadLink.href = convertedUrl
      downloadLink.download = file.name.replace(
        new RegExp(`\\.${fromFormat.toLowerCase()}$`, "i"),
        `.${toFormat.toLowerCase()}`,
      )
      downloadLink.textContent = `Download ${toFormat}`
      downloadLink.className = "download-link"

      statusDiv.textContent = "Conversion complete!"
      statusDiv.appendChild(document.createElement("br"))
      statusDiv.appendChild(downloadLink)

      convertBtn.disabled = false
    }, 3000) // Simulating a 3-second conversion process
  })
})

