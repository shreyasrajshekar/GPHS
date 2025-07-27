import { supabase } from '../../supabase';

export const uploadPothole = async (lat, lng, confirmed = false) => {
  const { error } = await supabase
    .from('potholes')
    .insert([{ latitude: lat, longitude: lng, confirmed }]);

  if (error) {
    console.error('❌ Upload failed:', error.message);
  } else {
    console.log(`✅ Uploaded pothole [${confirmed ? 'confirmed' : 'unconfirmed'}]`);
  }
};
