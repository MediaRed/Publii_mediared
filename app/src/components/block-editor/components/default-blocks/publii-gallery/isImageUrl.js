function isImageUrl(url) {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const extension = url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2); // Get the file extension from the URL
    console.log("isImageUrl", imageExtensions.includes(extension));
    return imageExtensions.includes(extension);
}