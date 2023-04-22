/* This are the 4 points of interception of 4 lines that enclose an area

[points]

The lines enclose an area.

Please elaborate a javascript function that return a (x,y) point values inside within the area enclosed by the 4 lines
*/


function getRandomPointInsideArea(point1, point2, point3, point4) {
    // Calculate the minimum and maximum x and y values of the bounding box
    // x is loggitude and y is latitude
    const minX = Math.min(point1[0], point2[0], point3[0], point4[0]);
    const maxX = Math.max(point1[0], point2[0], point3[0], point4[0]);
    const minY = Math.min(point1[1], point2[1], point3[1], point4[1]);
    const maxY = Math.max(point1[1], point2[1], point3[1], point4[1]);
  
    // Generate a random point inside the bounding box
    let x, y;
    do {
      x = Math.random() * (maxX - minX) + minX;
      y = Math.random() * (maxY - minY) + minY;
    } while (!isPointInsideArea([x, y], point1, point2, point3, point4));
  
    return [x, y];
  }
  
  function isPointInsideArea(point, point1, point2, point3, point4) {
    // Use the ray casting algorithm to determine if the point is inside the area
    const intersectCount = countIntersections(point, point1, point2, point3, point4);
    return intersectCount % 2 !== 0;
  }
  
  function countIntersections(point, point1, point2, point3, point4) {
    // Calculate the slope and y-intercept of each line segment
    const slope1 = getSlope(point1, point2);
    const yIntercept1 = getYIntercept(point1, slope1);
    const slope2 = getSlope(point2, point3);
    const yIntercept2 = getYIntercept(point2, slope2);
    const slope3 = getSlope(point3, point4);
    const yIntercept3 = getYIntercept(point3, slope3);
    const slope4 = getSlope(point4, point1);
    const yIntercept4 = getYIntercept(point4, slope4);
  
    // Check how many times a ray from the point intersects the line segments
    let intersectCount = 0;
    if (point[1] > calculateY(point[0], slope1, yIntercept1)) {
      intersectCount++;
    }
    if (point[1] > calculateY(point[0], slope2, yIntercept2)) {
      intersectCount++;
    }
    if (point[1] < calculateY(point[0], slope3, yIntercept3)) {
      intersectCount++;
    }
    if (point[1] < calculateY(point[0], slope4, yIntercept4)) {
      intersectCount++;
    }
  
    return intersectCount;
  }
  
  function getSlope(point1, point2) {
    return (point2[1] - point1[1]) / (point2[0] - point1[0]);
  }
  
  function getYIntercept(point, slope) {
    return point[1] - slope * point[0];
  }
  
  function calculateY(x, slope, yIntercept) {
    return slope * x + yIntercept;
  }