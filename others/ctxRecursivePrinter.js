// It is not so good. Seems it doesnt just ban circular references,
// But also ban repeated objects references in different locations

function stringifyWithCircularCheck(obj) {
  const seenBag = new WeakSet(); // Bag to keep track of "Cloned" elements reference

  return JSON.stringify(obj, function (key, value) {
    if (typeof value === "object" && value !== null) {
      if (seenBag.has(value)) {
        // If the object reference was already in the bag (Circular reference), return a placeholder
        return "[Circular Reference]";
      }
      seenBag.add(value);
    }
    return value;
  });
}

const jsonString = stringifyWithCircularCheck(nestedObject);
console.log(jsonString);
