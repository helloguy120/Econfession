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
    // Try to add confession
    const docRef = await db.collection('confessions').add({
      text: text,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    message.innerText = "Confession submitted anonymously!";
    console.log("Document written with ID:", docRef.id);
    form.reset();
  } catch (err) {
    // Log full error in console
    console.error("Error submitting confession:", err);
    
    // Show detailed error message on page
    message.innerText = "Error submitting confession: " + err.code + " - " + err.message;
  }
});
