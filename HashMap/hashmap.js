const linkedList = require('../LinkedList/linkedlist');


const hashMap = () => {
    let buckets = [];
    let capacity = 16;
    let loadFactor = 0.75;
    let size = 0;

    const set = (key, value) => {
        const hashCode = hash(key, capacity); // generate hash code

        if (!buckets[hashCode]) { //if bucket is empty
            buckets[hashCode] = linkedList(); // creates node 
        }

        const currentNode = findNodeByKey(key, buckets[hashCode]);

        if (currentNode) {
            currentNode.value.value = value;
        } else {
            buckets[hashCode].append({ key, value }); //appends key value pair
            size++;
        }
        if ((capacity * loadFactor) < size) resizeBucket();
    }

    const has = (key) => {
        const hashCode = hash(key, capacity);
        if (!buckets[hashCode]) return null;
        return findNodeByKey(key, buckets[hashCode]) !== null;

    }

    const get = (key) => {
        const hashCode = hash(key, capacity);

        if (!buckets[hashCode]) return null;

        const currentNode = findNodeByKey(key, buckets[hashCode]);
        return currentNode ? currentNode.value : null;

    }

    const entries = () => {
        const arr = [];
        buckets.forEach(bucket => {
            let head = bucket.head();
            while (head) {
                const { key, value } = head.value;
                arr.push([key, value]);
                head = head.next;
            }

        })
        return arr.length > 0 ? arr : null;
    }

    const length = () => size;

    const clear = () => {
        buckets = [];
        size = 0
    }

    const keys = () => {
        const arr = [];
        buckets.forEach(bucket => {
            let head = bucket.head();
            while (head) {
                arr.push(head.value.key);
                head = head.next;
            }

        })
        return arr.length > 0 ? arr : null;
    }

    const values = () => {
        const arr = [];
        buckets.forEach(bucket => {
            let head = bucket.head();
            while (head) {
                arr.push(head.value.value);
                head = head.next;
            }

        })
        return arr.length > 0 ? arr : null;
    }

    const findNodeByKey = (key, list) => {

        let head = list.head();
        while (head) {
            if (head.value.key === key) return head;
            head = head.next;
        }
        return null
    }
    const remove = (key) => {
        const hashCode = hash(key, capacity); // Find the hash code for the key
        const bucket = buckets[hashCode]; // Get the bucket linked list

        if (!bucket) return false; // If bucket is empty, return false (key does not exist)

        // Handle the case where the key is in the first node
        if (bucket.head().value.key === key) {
            bucket.removeAt(0); // Remove the first node
            size--;
            return true;
        }

        // Traverse the linked list to find the node to remove
        let previousNode = bucket.head();
        let currentNode = previousNode.next;

        while (currentNode) {
            if (currentNode.value.key === key) {
                previousNode.next = currentNode.next; // Remove the node by linking the previous node to the next node
                size--;
                return true;
            }
            previousNode = currentNode;
            currentNode = currentNode.next;
        }

        return false; // Return false if the key was not found
    };



    const resizeBucket = () => {
        const newCapacity = capacity * 2;
        const newBuckets = [];

        for (let index = 0; index < buckets.length; index++) { //loops over whole bucket
            const bucket = buckets[index];
            if (bucket) { // if bucket exists
                let currentNode = bucket.head(); //get current head
                while (currentNode) {
                    const { key, value } = currentNode.value;
                    const newHashCode = hash(key, newCapacity);

                    if (!newBuckets[newHashCode]) {
                        newBuckets[newHashCode] = linkedList();
                    }
                    newBuckets[newHashCode].append({ key, value });
                    currentNode = currentNode.next;
                }
            }

        }
        buckets = newBuckets;
        capacity = newCapacity;
    }

    return { set, get, has, entries, length, clear, keys, values, remove }
}






function hash(key, capacity) {
    let hashCode = 0;

    const primeNumber = 31;
    for (let i = 0; i < key.length; i++) {
        hashCode = (primeNumber * hashCode + key.charCodeAt(i)) % capacity;
    }

    return hashCode;
}

module.exports = hashMap;