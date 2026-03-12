const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: path.join(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadMedia = async (filePath, folder, resourceType) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `bhavani_mandap/real_media/${folder}`,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: false,
    });
    console.log(`✅ Uploaded: ${path.basename(filePath)} -> ${result.secure_url}`);
    return { url: result.secure_url, publicId: result.public_id, type: resourceType };
  } catch (error) {
    console.error(`❌ Failed to upload ${path.basename(filePath)}:`, error.message);
    return null;
  }
};

async function main() {
  const imagesDir = 'C:\\Users\\krunal\\Downloads\\Mandapimages';
  const videosDir = 'C:\\Users\\krunal\\Downloads\\Mandapvideos';
  const outputJsonPath = path.join(__dirname, '../real_media.json');

  let results = { images: [], videos: [] };

  if (fs.existsSync(outputJsonPath)) {
    results = JSON.parse(fs.readFileSync(outputJsonPath, 'utf8'));
    console.log('Loaded existing results, skipping already uploaded items...');
  }

  // Upload Images
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.'));
    for (const [i, file] of imageFiles.entries()) {
      if (results.images.some(img => img.publicId.includes(file.split('.')[0]))) {
         console.log(`⏩ Skipping ${file} (already uploaded)`);
         continue;
      }
      const filePath = path.join(imagesDir, file);
      const uploaded = await uploadMedia(filePath, 'images', 'image');
      if (uploaded) {
          results.images.push(uploaded);
          // save progress
          fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2));
      }
      // delay slightly to avoid rate limits
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Upload Videos
  if (fs.existsSync(videosDir)) {
    const videoFiles = fs.readdirSync(videosDir).filter(f => !f.startsWith('.'));
    for (const file of videoFiles) {
      if (results.videos.some(vid => vid.publicId.includes(file.split('.')[0]))) {
         console.log(`⏩ Skipping ${file} (already uploaded)`);
         continue;
      }
      const filePath = path.join(videosDir, file);
      const uploaded = await uploadMedia(filePath, 'videos', 'video');
      if (uploaded) {
          results.videos.push(uploaded);
          fs.writeFileSync(outputJsonPath, JSON.stringify(results, null, 2));
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('🎉 All media processed and saved to real_media.json!');
}

main().catch(console.error);
