export class ScreenshotManagerDB {
    constructor(dbName = 'screenshotManager', storeName = 'shots') {
        this.db = null;
        this.dbName = dbName;
        this.storeName = storeName;
    }

    openDatabase(callback) {
        const request = indexedDB.open(this.dbName, 1);

        request.onupgradeneeded = (event) => {
            this.db = event.target.result;
            this.db.createObjectStore(this.storeName, { autoIncrement: true });
        };

        request.onsuccess = (event) => {
            this.db = event.target.result;
            if (callback) callback();
        };

        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.errorCode);
        };
    }

    addToCollection(shot, callback) {
        if (!this.db) {
            this.openDatabase(() => this.addToCollection(shot, callback));
            return;
        }

        const transaction = this.db.transaction([this.storeName], "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.add(shot);

        request.onsuccess = () => {
            console.log("Shot added to IndexedDB");
            if (callback) callback();
        };

        request.onerror = (event) => {
            console.error("Error adding shot to IndexedDB:", event.target.errorCode);
        };
    }

    getAllShots(callback) {
        if (!this.db) {
            this.openDatabase(() => this.getAllShots(callback));
            return;
        }

        const transaction = this.db.transaction([this.storeName]);
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();

        request.onsuccess = () => {
            if (callback) callback(request.result);
        };

        request.onerror = (event) => {
            console.error("Error fetching shots from IndexedDB:", event.target.errorCode);
        };
    }
}
