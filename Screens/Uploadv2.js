// upload the video
// once complete, get the downloadurl from firebase and set state of videourl
// upload the poster
// once complete, get the downloadurl from firebase and set state of videourl
// set state of all the other text inputs and upload them to the database
// public database
// video player database
// user's uploads database

uploadVideoPoster = async (uri, videoPosterId) => {
  // upload the video 
  // once complete, get the downloadurl from firebase and set state of videourl
  // upload the poster
  // once complete, get the downloadurl from firebase and set state of videourl
  // set state of all the other text inputs and upload them to the database
  // public database
  // video player database
  // user's uploads database
  const response = await fetch(uri);
  const blob = await response.blob();
  
  const ref = firebase
    .storage()
    .ref()
    .child("videos_poster/" + videoPosterId);
  return ref.put(blob);
};
