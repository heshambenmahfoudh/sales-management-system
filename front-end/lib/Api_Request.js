export async function makePostRequestImageUrl(
  e,
  setIsLoadingImageUrl,
) {
  try {
    setIsLoadingImageUrl(true)
    const data = new FormData()
       data.append('file', e.target.files[0])
    data.append('upload_preset', 'upload')
    if (e.target?.files[0]) {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/salesSystem/image/upload`,
        {
          method: 'POST',
          body: data,
        },
      )
      const result = await response.json()
      if (response.ok) {
        setIsLoadingImageUrl(false)
        return { data: result.secure_url, status: 200 }
      }else{
        setIsLoadingImageUrl(false)
      }
    }
  } catch (error) {
    setIsLoadingImageUrl(false)
    return { data: null, status: 500 }
  }
}



