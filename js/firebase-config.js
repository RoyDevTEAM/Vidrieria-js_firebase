// Configuración de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBDkgONGp2GvRAEtdMI5iP-A8IGwDSVHnM",
    authDomain: "vdvidrieriajs.firebaseapp.com",
    projectId: "vdvidrieriajs",
    storageBucket: "vdvidrieriajs.appspot.com",
    messagingSenderId: "839846791870",
    appId: "1:839846791870:web:a254792461dc9fc7356cef"
};


// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Obtener una referencia a Firestore
const db = firebase.firestore();