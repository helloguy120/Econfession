const loginDiv = document.getElementById('loginDiv');
const adminDiv = document.getElementById('adminDiv');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const clearBtn = document.getElementById('clearBtn');
const exportBtn = document.getElementById('exportBtn');
const confessionList = document.getElementById('confessionList');
const loginMessage = document.getElementById('loginMessage');

loginBtn.addEventListener('click', async () => {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  try {
    await auth.signInWithEmailAndPassword(email, password);
    loginDiv.style.display = 'none';
    adminDiv.style.display = 'block';
    loadConfessions();
  } catch (err) {
    loginMessage.innerText = "Login failed!";
  }
});

logoutBtn.addEventListener('click', async () => {
  await auth.signOut();
  adminDiv.style.display = 'none';
  loginDiv.style.display = 'block';
});

async function loadConfessions() {
  confessionList.innerHTML = '';
  const snapshot = await db.collection('confessions').orderBy('timestamp', 'desc').get();
  snapshot.forEach(doc => {
    const li = document.createElement('li');
    li.innerText = doc.data().text;
    const delBtn = document.createElement('button');
    delBtn.innerText = 'Delete';
    delBtn.addEventListener('click', async () => {
      await db.collection('confessions').doc(doc.id).delete();
      loadConfessions();
    });
    li.appendChild(delBtn);
    confessionList.appendChild(li);
  });
}

clearBtn.addEventListener('click', async () => {
  const snapshot = await db.collection('confessions').get();
  const batch = db.batch();
  snapshot.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  loadConfessions();
});

exportBtn.addEventListener('click', async () => {
  const snapshot = await db.collection('confessions').orderBy('timestamp', 'desc').get();
  let csv = 'Confession,Timestamp\n';
  snapshot.forEach(doc => {
    const data = doc.data();
    const text = data.text.replace(/,/g, ';'); // avoid commas in CSV
    const ts = data.timestamp ? data.timestamp.toDate() : '';
    csv += `"${text}","${ts}"\n`;
  });
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'confessions.csv';
  a.click();
});
