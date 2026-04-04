async function test() {
  const key = 'AIzaSyBVAAne7ocgsp7GIH4xPnUhCuE4m9g4Vpw';
  const folderId = '1rqr2KCEHKTZRyIZJPtc-9l8UOIWho6WH';
  const query = `'${folderId}' in parents and trashed = false and mimeType contains 'image/'`;
  const url = `https://www.googleapis.com/drive/v3/files?key=${key}&q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)`;

  console.log('Fetching:', url);
  try {
    const res = await fetch(url, {
      headers: {
        'Referer': 'http://localhost:3000/'
      }
    });
    const data = await res.json();
    console.log('Result:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
