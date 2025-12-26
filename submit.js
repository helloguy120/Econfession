const form = document.getElementById('confessionForm');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const text = document.getElementById('confessionText').value.trim();

  if (text.length === 0) {
    message.innerText = "Please write something before submitting.";
    return;
  }

  try {
    const docRef = await db.collection('confessions').add({
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    message.innerText = "✅ Confession submitted anonymously! (ID: " + docRef.id + ")";
    form.reset();
  } catch (err) {
    // Show full error code and message directly on page
    message.innerText = "❌ Error submitting confession!\nCode: " + err.code + "\nMessage: " + err.message;
  }
});
