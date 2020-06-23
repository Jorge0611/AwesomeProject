import firebase from "firebase";

class Fire {
    constructor() {
        this.init();
        this.checkAuth();
    }

    init = () => {
        if (!firebase.apps.length) {
            firebase.initializeApp({
                apiKey: "AIzaSyDMRbIHPNNMmcyyiqshjEgdWDHf0ie3zCg",
                authDomain: "chat-32204.firebaseapp.com",
                databaseURL: "https://chat-32204.firebaseio.com",
                projectId: "chat-32204",
                storageBucket: "chat-32204.appspot.com",
                messagingSenderId: "619108157297",
                appId: "1:619108157297:web:77c7624aa597566c5718d0",
                measurementId: "G-MT0MV4EGEC"
            });
        }
    };

    checkAuth = () => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) {
                firebase.auth().signInAnonymously();
            }
        });
    };

    send = messages => {
        messages.forEach(item => {
            const message = {
                text: item.text,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: item.user
            };

            this.db.push(message);
        });
    };

    parse = message => {
        const { user, text, timestamp } = message.val();
        const { key: _id } = message;
        const createdAt = new Date(timestamp);

        return {
            _id,
            createdAt,
            text,
            user
        };
    };

    get = callback => {
        this.db.on("child_added", snapshot => callback(this.parse(snapshot)));
    };

    off() {
        this.db.off();
    }

    get db() {
        return firebase.database().ref("messages");
    }

    get uid() {
        return (firebase.auth().currentUser || {}).uid;
    }
}

export default new Fire();
