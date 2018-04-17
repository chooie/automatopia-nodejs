exports.prettyPrint = function prettyPrint(o) {
  // Note: cache should not be re-used by repeated calls to JSON.stringify.
  let cache = [];
  return JSON.stringify(
    o,
    function(key, value) {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Circular reference found, discard key
          return "[Circular reference object]";
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    },
    2
  );
  cache = null; // Enable garbage collect
};
