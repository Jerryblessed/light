import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import 'firebase/storage';

var firebaseConfig = {

  apiKey: "AIzaSyAcLcWdsdaS_yxi473nndZmsxHWCd0ENs0",
  authDomain: "light-c3062.firebaseapp.com",
  projectId: "light-c3062",
  storageBucket: "light-c3062.appspot.com",
  messagingSenderId: "707477178801",
  appId: "1:707477178801:web:a7c4a28ade03d1fd11d590",
  measurementId: "G-XLWTCF06R8"

};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
//   firebase.analytics();


export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const googleSignIn = () => auth.signInWithPopup(googleProvider);

const facebookProvider = new firebase.auth.FacebookAuthProvider();
facebookProvider.setCustomParameters({
  'display': 'popup'
});
export const facebookSignIn = () => auth.signInWithPopup(facebookProvider);

export default firebase;