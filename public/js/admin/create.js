// Upload Image Priview
const uploadImg = document.querySelector(".upload-img")
if(uploadImg){
  uploadImg.onchange = (e) => {
    const [file] = e.target.files;
    const uploadImgPreview = document.querySelector(".upload-img-preview")
    uploadImgPreview.style.display = "block"
    uploadImgPreview.querySelector("img").src = URL.createObjectURL(file)
    
  }
} 