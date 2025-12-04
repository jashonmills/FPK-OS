# Module 5: Transformations in Geometry

## Introduction

Welcome to Module 5 of our Geometry course! In this module, we will explore geometric transformations, which are operations that change the position, size, or shape of geometric figures. We will study different types of transformations and their properties.

> **Teaching Moment:** Transformations are the "verbs" of geometry—they describe how shapes move, stretch, flip, and turn. While previous modules focused on static properties of shapes, transformations introduce dynamism into geometry. They help us understand symmetry, congruence, and similarity in a deeper way. From the patterns in Islamic art to the animations in computer graphics, transformations are essential tools for creating and analyzing movement and change in geometric contexts.

## Learning Objectives

By the end of this module, you will be able to:
- Understand and apply different types of transformations
- Identify the properties of each transformation
- Perform transformations on geometric figures
- Describe transformations using coordinates
- Recognize symmetry in geometric figures
- Apply transformations to solve real-world problems

## Section 1: Introduction to Transformations

### What are Transformations?

A transformation is a function that takes a geometric figure and changes its position, size, or shape to create a new figure. The original figure is called the pre-image, and the resulting figure is called the image.

> **Teaching Moment:** Think of transformations as instructions for moving points in a plane. Every point in the original figure (pre-image) gets mapped to a corresponding point in the new figure (image) according to specific rules. This correspondence between points is what mathematicians call a "function." Understanding transformations as functions helps connect geometry to algebra and calculus, where functions are central concepts.

### Types of Transformations

1. **Rigid Transformations (Isometries)**: Transformations that preserve the size and shape of the figure.
   - Translation (Slide)
   - Rotation (Turn)
   - Reflection (Flip)

   > **Teaching Moment:** Rigid transformations are like moving a rigid object without deforming it. If you trace a shape on a piece of paper and then move the paper without stretching or tearing it, you're performing a rigid transformation. These transformations preserve distances between points and angle measures, which is why they're also called "isometries" (from Greek, meaning "same measure").

2. **Non-Rigid Transformations**: Transformations that change the size or shape of the figure.
   - Dilation (Scaling)
   - Shear
   - Stretch

   > **Teaching Moment:** Non-rigid transformations allow for changes in size or shape. Think of them as operations that might stretch, compress, or distort the original figure. While they don't preserve all geometric properties, they often preserve important relationships like parallelism or proportion. These transformations are crucial in fields like computer graphics, where objects need to be resized or deformed.

### Problem-Solving Approach: Identifying Transformations

When identifying the type of transformation, follow these steps:

1. **Compare corresponding points**: Match points in the pre-image to their corresponding points in the image.
2. **Check for preservation of distance**: Measure distances between corresponding points to determine if the transformation is rigid.
3. **Look for patterns in movement**: Observe how points have moved to identify the specific transformation.
4. **Verify with properties**: Confirm your identification by checking if the transformation satisfies all properties of that type.

**Example Problem:**
Figure A is a triangle with vertices at (1, 1), (3, 1), and (2, 3). Figure B is a triangle with vertices at (4, 1), (6, 1), and (5, 3). Identify the transformation that maps Figure A to Figure B.

**Solution:**
Step 1: Compare corresponding vertices.
- (1, 1) → (4, 1): Moved 3 units right, 0 units up
- (3, 1) → (6, 1): Moved 3 units right, 0 units up
- (2, 3) → (5, 3): Moved 3 units right, 0 units up

Step 2: Check for preservation of distance.
- Distance between vertices in Figure A: 
  - From (1, 1) to (3, 1): 2 units
  - From (3, 1) to (2, 3): √5 units
  - From (2, 3) to (1, 1): √5 units
- Distance between corresponding vertices in Figure B:
  - From (4, 1) to (6, 1): 2 units
  - From (6, 1) to (5, 3): √5 units
  - From (5, 3) to (4, 1): √5 units
- The distances are preserved, so this is a rigid transformation.

Step 3: Look for patterns in movement.
- All points moved 3 units in the positive x-direction and 0 units in the y-direction.
- This consistent horizontal shift suggests a translation.

Step 4: Verify with properties.
- Translation preserves orientation, distance, and angle measure, which is consistent with our observations.
- The translation vector is (3, 0).

Therefore, the transformation is a translation by the vector (3, 0).

> **Teaching Moment:** In this problem, we identified a translation by recognizing that all points moved the same distance in the same direction. This is the defining characteristic of a translation. Notice how we verified our answer by checking that distances between corresponding points were preserved, confirming that it's a rigid transformation. This methodical approach—comparing corresponding points, checking for preservation of properties, identifying patterns, and verifying—is effective for identifying any type of transformation.

## Section 2: Translations

### What is a Translation?

A translation is a transformation that moves every point of a figure the same distance in the same direction. It is also known as a slide.

> **Teaching Moment:** Translations are perhaps the simplest transformations to visualize—they're like sliding a shape across a surface without rotating or flipping it. In everyday life, translations occur when you slide a book across a table or when an elevator moves up and down. In mathematics, translations are represented by vectors, which specify both the distance and direction of the movement.

### Properties of Translations

1. Translations preserve the size and shape of the figure.

   > **Teaching Moment:** This means that if you measure any distance or angle in the original figure, the corresponding distance or angle in the translated figure will be exactly the same. This property makes translations isometries (distance-preserving transformations).

2. Translations preserve the orientation of the figure.

   > **Teaching Moment:** Orientation refers to the arrangement of points relative to each other. In a translation, if points A, B, and C form a counterclockwise triangle in the pre-image, they will still form a counterclockwise triangle in the image. This distinguishes translations from reflections, which reverse orientation.

3. The distance between any two points in the pre-image is the same as the distance between the corresponding points in the image.

   > **Teaching Moment:** This is another way of stating that translations preserve size and shape. It emphasizes that the internal relationships within the figure remain unchanged—only the position of the entire figure changes.

### Performing Translations

To translate a point (x, y) by a vector (h, k), the new coordinates are (x + h, y + k).

> **Teaching Moment:** This simple formula encapsulates the essence of translation: add the translation vector components to the coordinates of each point. The h value tells you how far to move horizontally (positive for right, negative for left), and the k value tells you how far to move vertically (positive for up, negative for down). This algebraic representation allows us to precisely describe and perform translations in coordinate geometry.

### Problem-Solving Approach: Performing Translations

When translating a figure, follow these steps:

1. **Identify the translation vector**: Determine the horizontal and vertical components of the translation.
2. **Apply the translation formula**: For each point (x, y) in the pre-image, calculate the new coordinates (x + h, y + k).
3. **Plot the new points**: Draw the image using the calculated coordinates.
4. **Verify the translation**: Check that all points have moved the same distance in the same direction.

**Example Problem:**
Translate the triangle with vertices at (1, 2), (3, 4), and (2, 5) by the vector (2, -3).

**Solution:**
Step 1: Identify the translation vector.
- Translation vector: (h, k) = (2, -3)

Step 2: Apply the translation formula to each vertex.
- Vertex 1: (1, 2) → (1 + 2, 2 + (-3)) = (3, -1)
- Vertex 2: (3, 4) → (3 + 2, 4 + (-3)) = (5, 1)
- Vertex 3: (2, 5) → (2 + 2, 5 + (-3)) = (4, 2)

Step 3: Plot the new points.
- The translated triangle has vertices at (3, -1), (5, 1), and (4, 2).

Step 4: Verify the translation.
- Check that each point has moved 2 units right and 3 units down.
- Vertex 1: From (1, 2) to (3, -1) is 2 units right and 3 units down.
- Vertex 2: From (3, 4) to (5, 1) is 2 units right and 3 units down.
- Vertex 3: From (2, 5) to (4, 2) is 2 units right and 3 units down.

Therefore, the triangle has been translated by the vector (2, -3).

> **Teaching Moment:** This problem demonstrates the straightforward nature of translations in coordinate geometry. By simply adding the components of the translation vector to each coordinate, we move every point of the figure the same distance in the same direction. Notice how we verified our answer by checking that each vertex moved exactly according to the translation vector. This verification step is important to ensure accuracy in geometric transformations.

## Section 3: Rotations

### What is a Rotation?

A rotation is a transformation that turns a figure around a fixed point, called the center of rotation, by a specified angle.

> **Teaching Moment:** Rotations are like spinning a figure around a pivot point. In everyday life, rotations occur when a wheel turns, when a door swings open, or when the hands of a clock move. In mathematics, rotations are specified by three components: the center of rotation (the fixed point), the angle of rotation (how far to turn), and the direction (clockwise or counterclockwise, with counterclockwise being the standard positive direction).

### Properties of Rotations

1. Rotations preserve the size and shape of the figure.

   > **Teaching Moment:** Like translations, rotations are isometries—they preserve distances and angles. If you measure any distance or angle in the original figure, the corresponding distance or angle in the rotated figure will be exactly the same. This property is why gears and wheels can transfer motion without distortion.

2. Rotations preserve the orientation of the figure.

   > **Teaching Moment:** In a rotation, if points A, B, and C form a counterclockwise triangle in the pre-image, they will still form a counterclockwise triangle in the image. This distinguishes rotations from reflections, which reverse orientation. The preservation of orientation is important in applications like navigation and computer graphics.

3. The distance from any point in the pre-image to the center of rotation is the same as the distance from the corresponding point in the image to the center of rotation.

   > **Teaching Moment:** This property highlights that during a rotation, points move along circular paths centered at the center of rotation. The radius of each circular path remains constant, which is why rotations preserve distances. This property is fundamental to the design of mechanisms like compasses and mechanical linkages.

### Performing Rotations

To rotate a point (x, y) around the origin by an angle θ in the counterclockwise direction, the new coordinates are:
- x' = x cos(θ) - y sin(θ)
- y' = x sin(θ) + y cos(θ)

To rotate a point (x, y) around a point (h, k) by an angle θ in the counterclockwise direction:
1. Translate the center of rotation to the origin: (x - h, y - k)
2. Rotate around the origin: ((x - h) cos(θ) - (y - k) sin(θ), (x - h) sin(θ) + (y - k) cos(θ))
3. Translate back: ((x - h) cos(θ) - (y - k) sin(θ) + h, (x - h) sin(θ) + (y - k) cos(θ) + k)

> **Teaching Moment:** These formulas may look complex, but they have a beautiful geometric interpretation. The rotation formulas use sine and cosine functions because these trigonometric functions naturally describe circular motion. When we rotate around a point other than the origin, we use a three-step process: first translate to make the center of rotation the origin, then perform the rotation around the origin, and finally translate back. This approach simplifies the mathematics and illustrates how transformations can be composed (combined) to create more complex movements.

### Problem-Solving Approach: Performing Rotations

When rotating a figure, follow these steps:

1. **Identify the center of rotation and angle**: Determine the fixed point and the angle of rotation.
2. **Choose the appropriate formula**: Use the formula for rotation around the origin or around a different point.
3. **Apply the rotation formula**: For each point in the pre-image, calculate the new coordinates.
4. **Plot the new points**: Draw the image using the calculated coordinates.
5. **Verify the rotation**: Check that all points have rotated by the specified angle around the center.

**Example Problem:**
Rotate the point (3, 4) around the origin by 90 degrees counterclockwise.

**Solution:**
Step 1: Identify the center of rotation and angle.
- Center of rotation: Origin (0, 0)
- Angle of rotation: 90° counterclockwise

Step 2: Choose the appropriate formula.
- Since we're rotating around the origin, we'll use:
  - x' = x cos(θ) - y sin(θ)
  - y' = x sin(θ) + y cos(θ)

Step 3: Apply the rotation formula.
- For θ = 90°, cos(90°) = 0 and sin(90°) = 1
- x' = 3 × 0 - 4 × 1 = -4
- y' = 3 × 1 + 4 × 0 = 3

Step 4: Plot the new point.
- The rotated point is at (-4, 3).

Step 5: Verify the rotation.
- The original point (3, 4) is at a distance of 5 units from the origin (√(3² + 4²) = 5).
- The rotated point (-4, 3) is also at a distance of 5 units from the origin (√((-4)² + 3²) = 5).
- The angle between the positive x-axis and the line from the origin to (3, 4) is approximately 53.1°.
- The angle between the positive x-axis and the line from the origin to (-4, 3) is approximately 143.1°.
- The difference is 90°, confirming the rotation.

Therefore, the point (3, 4) rotated 90° counterclockwise around the origin is (-4, 3).

> **Teaching Moment:** This problem illustrates how to use the rotation formulas for a specific case: a 90° counterclockwise rotation around the origin. Notice how the coordinates transform: (3, 4) becomes (-4, 3). There's a pattern here—for a 90° counterclockwise rotation around the origin, (x, y) always becomes (-y, x). This special case is worth remembering as it appears frequently in geometry and physics. Also note how we verified our answer by checking both the distance from the origin (which should be preserved) and the angle of rotation (which should be exactly 90°).

## Section 4: Reflections

### What is a Reflection?

A reflection is a transformation that flips a figure over a line, called the line of reflection.

> **Teaching Moment:** Reflections are like mirror images. When you look in a mirror, what you see is a reflection of yourself across the plane of the mirror. In two-dimensional geometry, reflections occur across lines rather than planes. Reflections are fundamental to understanding symmetry in nature, art, and architecture. Many natural objects, from butterflies to human faces, exhibit approximate reflectional symmetry.

### Properties of Reflections

1. Reflections preserve the size and shape of the figure.

   > **Teaching Moment:** Like translations and rotations, reflections are isometries—they preserve distances and angles. This is why your reflection in a mirror appears the same size and shape as you are. This property is crucial in applications like designing symmetric patterns or analyzing molecular structures.

2. Reflections reverse the orientation of the figure.

   > **Teaching Moment:** This is a key property that distinguishes reflections from translations and rotations. If points A, B, and C form a counterclockwise triangle in the pre-image, they will form a clockwise triangle in the image. This reversal of orientation is why text appears backward in a mirror and why we can distinguish between a right hand and a left hand (which are reflections of each other).

3. The line of reflection is the perpendicular bisector of the line segment connecting any point in the pre-image to its corresponding point in the image.

   > **Teaching Moment:** This property defines the geometric relationship between a point and its reflection. For every point in the pre-image, the line of reflection acts as the perpendicular bisector of the line connecting that point to its image. This means that the line of reflection is equidistant from a point and its reflection, which is exactly how mirrors work in the physical world.

### Performing Reflections

1. **Reflection over the x-axis**: (x, y) → (x, -y)

   > **Teaching Moment:** This reflection flips points across the x-axis. The x-coordinate stays the same, but the y-coordinate changes sign. Visually, this means that points above the x-axis move to corresponding positions below it, and vice versa. This is like folding a paper along the x-axis.

2. **Reflection over the y-axis**: (x, y) → (-x, y)

   > **Teaching Moment:** This reflection flips points across the y-axis. The y-coordinate stays the same, but the x-coordinate changes sign. Points to the right of the y-axis move to corresponding positions to the left, and vice versa. This is like folding a paper along the y-axis.

3. **Reflection over the line y = x**: (x, y) → (y, x)

   > **Teaching Moment:** This reflection swaps the x and y coordinates. It flips points across the diagonal line y = x. This transformation is less intuitive to visualize but is important in matrix operations and coordinate transformations. It's like folding a paper along the diagonal from the origin to the upper right.

4. **Reflection over the line y = -x**: (x, y) → (-y, -x)

   > **Teaching Moment:** This reflection swaps the x and y coordinates and changes both signs. It flips points across the diagonal line y = -x. Like the reflection over y = x, this transformation is important in advanced mathematics and coordinate geometry. It's like folding a paper along the diagonal from the upper left to the lower right.

5. **Reflection over a horizontal line y = k**: (x, y) → (x, 2k - y)

   > **Teaching Moment:** This reflection flips points across a horizontal line at height k. Points above the line move below it, and vice versa, with the distance from the line preserved. This is a generalization of reflection over the x-axis (which is the case where k = 0).

6. **Reflection over a vertical line x = h**: (x, y) → (2h - x, y)

   > **Teaching Moment:** This reflection flips points across a vertical line at position h. Points to the right of the line move to the left, and vice versa, with the distance from the line preserved. This is a generalization of reflection over the y-axis (which is the case where h = 0).

### Problem-Solving Approach: Performing Reflections

When reflecting a figure, follow these steps:

1. **Identify the line of reflection**: Determine which line you're reflecting across.
2. **Choose the appropriate formula**: Select the formula based on the line of reflection.
3. **Apply the reflection formula**: For each point in the pre-image, calculate the new coordinates.
4. **Plot the new points**: Draw the image using the calculated coordinates.
5. **Verify the reflection**: Check that the line of reflection is the perpendicular bisector of the line connecting each original point to its image.

**Example Problem:**
Reflect the line segment from (1, 2) to (3, 4) over the x-axis.

**Solution:**
Step 1: Identify the line of reflection.
- Line of reflection: x-axis (y = 0)

Step 2: Choose the appropriate formula.
- For reflection over the x-axis: (x, y) → (x, -y)

Step 3: Apply the reflection formula to each endpoint.
- Endpoint 1: (1, 2) → (1, -2)
- Endpoint 2: (3, 4) → (3, -4)

Step 4: Plot the new points.
- The reflected line segment goes from (1, -2) to (3, -4).

Step 5: Verify the reflection.
- For the first endpoint: The midpoint of the line from (1, 2) to (1, -2) is (1, 0), which lies on the x-axis.
- For the second endpoint: The midpoint of the line from (3, 4) to (3, -4) is (3, 0), which lies on the x-axis.
- Both lines are perpendicular to the x-axis.

Therefore, the reflection of the line segment from (1, 2) to (3, 4) over the x-axis is the line segment from (1, -2) to (3, -4).

> **Teaching Moment:** This problem demonstrates the straightforward nature of reflections over the coordinate axes. For reflection over the x-axis, we simply negate the y-coordinates while keeping the x-coordinates the same. Notice how we verified our answer by checking that the x-axis is indeed the perpendicular bisector of the lines connecting each original point to its reflection. This verification step ensures that our reflection satisfies the fundamental property of reflections.

## Section 5: Dilations

### What is a Dilation?

A dilation is a transformation that changes the size of a figure without changing its shape. It is also known as a scaling.

> **Teaching Moment:** Dilations are like zooming in or out on a figure. When you zoom in on a map or photo, you're performing a dilation with a scale factor greater than 1. When you zoom out, the scale factor is between 0 and 1. Dilations are crucial in fields like cartography (map-making), where real-world features need to be scaled to fit on a page, and in computer graphics, where objects need to be resized while maintaining their proportions.

### Properties of Dilations

1. Dilations preserve the shape of the figure but change its size.

   > **Teaching Moment:** This means that angles remain the same, and the ratios of corresponding sides remain the same, but the actual lengths change. This property is why dilations create similar figures—figures that have the same shape but not necessarily the same size. This concept is fundamental in the study of similar triangles and other similar polygons.

2. Dilations preserve the orientation of the figure.

   > **Teaching Moment:** Like translations and rotations (but unlike reflections), dilations maintain the arrangement of points relative to each other. If points A, B, and C form a counterclockwise triangle in the pre-image, they will still form a counterclockwise triangle in the image. This preservation of orientation is important in applications like creating scale models or resizing images.

3. The ratio of the distance between any two points in the image to the distance between the corresponding points in the pre-image is equal to the scale factor.

   > **Teaching Moment:** This property defines the mathematical relationship in a dilation. If the scale factor is k, then every distance in the image is k times the corresponding distance in the pre-image. This consistent scaling is what preserves the shape while changing the size. It's why a scale model of a building looks proportionally correct even though it's much smaller than the actual building.

### Performing Dilations

To dilate a point (x, y) from the origin with a scale factor k, the new coordinates are (kx, ky).

To dilate a point (x, y) from a center (h, k) with a scale factor s:
1. Translate the center of dilation to the origin: (x - h, y - k)
2. Dilate from the origin: (s(x - h), s(y - k))
3. Translate back: (s(x - h) + h, s(y - k) + k)

> **Teaching Moment:** These formulas capture the essence of dilation: multiply coordinates by the scale factor to resize the figure. When dilating from a point other than the origin, we use a three-step process similar to what we did with rotations: translate to make the center of dilation the origin, perform the dilation, and translate back. This approach ensures that the center of dilation remains fixed while all other points move along rays emanating from the center.

### Problem-Solving Approach: Performing Dilations

When dilating a figure, follow these steps:

1. **Identify the center of dilation and scale factor**: Determine the fixed point and the factor by which distances will change.
2. **Choose the appropriate formula**: Use the formula for dilation from the origin or from a different center.
3. **Apply the dilation formula**: For each point in the pre-image, calculate the new coordinates.
4. **Plot the new points**: Draw the image using the calculated coordinates.
5. **Verify the dilation**: Check that distances from the center have been scaled by the scale factor.

**Example Problem:**
Dilate the rectangle with vertices at (1, 1), (4, 1), (4, 3), and (1, 3) from the origin with a scale factor of 2.

**Solution:**
Step 1: Identify the center of dilation and scale factor.
- Center of dilation: Origin (0, 0)
- Scale factor: k = 2

Step 2: Choose the appropriate formula.
- Since we're dilating from the origin, we'll use: (x, y) → (kx, ky)

Step 3: Apply the dilation formula to each vertex.
- Vertex 1: (1, 1) → (2 × 1, 2 × 1) = (2, 2)
- Vertex 2: (4, 1) → (2 × 4, 2 × 1) = (8, 2)
- Vertex 3: (4, 3) → (2 × 4, 2 × 3) = (8, 6)
- Vertex 4: (1, 3) → (2 × 1, 2 × 3) = (2, 6)

Step 4: Plot the new points.
- The dilated rectangle has vertices at (2, 2), (8, 2), (8, 6), and (2, 6).

Step 5: Verify the dilation.
- Original rectangle: Width = 3, Height = 2
- Dilated rectangle: Width = 6, Height = 4
- Both dimensions have been multiplied by the scale factor 2.
- The distance from the origin to each vertex has also been multiplied by 2.

Therefore, the dilation of the rectangle from the origin with a scale factor of 2 gives a rectangle with vertices at (2, 2), (8, 2), (8, 6), and (2, 6).

> **Teaching Moment:** This problem illustrates how dilations affect the size of a figure while preserving its shape. Notice that the dilated rectangle is still a rectangle (same shape) but with dimensions twice as large (different size). Also note that the distance from the origin to each vertex has doubled, which is a key characteristic of dilation. For example, the distance from the origin to (1, 1) is √2, and the distance to the corresponding dilated point (2, 2) is 2√2, which is exactly 2 times the original distance.

## Section 6: Composite Transformations

### What are Composite Transformations?

A composite transformation is a sequence of two or more transformations applied one after the other.

> **Teaching Moment:** Composite transformations are like following a series of directions: "Go north for 2 miles, then turn east for 3 miles." In geometry, we might say "Reflect across the x-axis, then rotate 90° around the origin." The order of transformations matters—changing the order often leads to different results. This concept connects to function composition in algebra and to the mathematical structure of groups, which studies how operations combine.

### Properties of Composite Transformations

1. The order of transformations matters. In general, A followed by B is not the same as B followed by A.

   > **Teaching Moment:** This non-commutativity is a fundamental property of geometric transformations. For example, if you rotate a figure and then translate it, you get a different result than if you translate it and then rotate it. This property has important implications in fields like robotics, where the sequence of movements affects the final position and orientation.

2. The composition of two or more isometries is an isometry.

   > **Teaching Moment:** If you combine rigid transformations (translations, rotations, reflections), the result is still a rigid transformation. This means that distances and angles are preserved through the entire sequence. This property is important in crystallography, where combinations of reflections and rotations describe the symmetry of crystal structures.

3. The composition of two or more dilations is a dilation.

   > **Teaching Moment:** If you dilate a figure by a factor of 2 and then dilate the result by a factor of 3, it's equivalent to dilating the original figure by a factor of 6 (2 × 3). This multiplicative property of scale factors is useful in computer graphics and in understanding multi-stage scaling processes.

### Examples of Composite Transformations

1. **Glide Reflection**: A translation followed by a reflection, or vice versa.

   > **Teaching Moment:** Glide reflections combine sliding and flipping. They appear in nature in the symmetry of footprints or tire tracks, where each step or rotation creates a pattern that is both translated and reflected. Glide reflections are also important in crystallography, where they describe certain types of symmetry in crystal structures.

2. **Half-Turn**: A rotation by 180 degrees, which is equivalent to a reflection over a line followed by a reflection over a perpendicular line.

   > **Teaching Moment:** This equivalence between a 180° rotation and two perpendicular reflections is a beautiful result in transformation geometry. It shows how different combinations of basic transformations can produce the same effect. This principle is used in the classification of symmetry groups and in understanding the structure of geometric transformations.

### Problem-Solving Approach: Working with Composite Transformations

When applying composite transformations, follow these steps:

1. **Break down the composite transformation**: Identify the sequence of individual transformations.
2. **Apply the transformations in order**: Start with the original figure and apply each transformation sequentially.
3. **Track the coordinates at each step**: Calculate the new coordinates after each transformation.
4. **Verify the final result**: Check that the final image satisfies all the properties of the composite transformation.

**Example Problem:**
Apply the following sequence of transformations to the point (3, 2):
1. Reflection over the x-axis
2. Translation by the vector (1, -1)

**Solution:**
Step 1: Break down the composite transformation.
- First transformation: Reflection over the x-axis
- Second transformation: Translation by the vector (1, -1)

Step 2: Apply the transformations in order.
- Original point: (3, 2)
- After reflection over the x-axis: (3, -2)
- After translation by (1, -1): (3 + 1, -2 + (-1)) = (4, -3)

Step 3: Track the coordinates at each step.
- (3, 2) → (3, -2) → (4, -3)

Step 4: Verify the final result.
- The reflection over the x-axis should negate the y-coordinate: (3, 2) → (3, -2) ✓
- The translation should add the vector components: (3, -2) → (4, -3) ✓

Therefore, the final position of the point after the composite transformation is (4, -3).

> **Teaching Moment:** This problem demonstrates the step-by-step process of applying a composite transformation. Notice that we applied the transformations in the specified order: first the reflection, then the translation. If we had reversed the order (translation first, then reflection), we would have gotten a different result: (3, 2) → (4, 1) → (4, -1). This illustrates the non-commutative nature of geometric transformations—the order matters!

## Section 7: Symmetry

### What is Symmetry?

Symmetry is a property of a figure that remains unchanged under certain transformations.

> **Teaching Moment:** Symmetry is all around us—in the patterns of snowflakes, the structure of flowers, the design of buildings, and even in the laws of physics. When we say a figure has symmetry, we mean that there's a transformation (like a reflection or rotation) that maps the figure onto itself, leaving it looking unchanged. Symmetry is not just aesthetically pleasing; it's a fundamental concept in mathematics, science, and art that helps us understand structure and pattern.

### Types of Symmetry

1. **Reflectional Symmetry (Line Symmetry)**: A figure has reflectional symmetry if there is a line such that the reflection of the figure over that line results in the same figure.

   > **Teaching Moment:** Reflectional symmetry is like folding a paper—if the two halves match perfectly, the figure has line symmetry. The line of symmetry acts like a mirror, with one half of the figure being the reflection of the other half. Many letters have reflectional symmetry: 'A', 'M', 'T', 'U', 'V', 'W', and 'Y' have vertical lines of symmetry, while 'B', 'C', 'D', 'E', and 'K' have horizontal lines of symmetry.

2. **Rotational Symmetry**: A figure has rotational symmetry if there is a point such that a rotation of the figure around that point by a certain angle results in the same figure.

   > **Teaching Moment:** Rotational symmetry is like spinning a figure around a fixed point—if it looks the same at certain angles during the spin, it has rotational symmetry. The order of rotational symmetry is the number of distinct positions in which the figure looks the same during a full 360° rotation. For example, a square has rotational symmetry of order 4 (it looks the same after rotations of 90°, 180°, 270°, and 360°).

3. **Translational Symmetry**: A figure has translational symmetry if there is a translation that maps the figure onto itself.

   > **Teaching Moment:** Translational symmetry typically occurs in patterns that repeat indefinitely, like wallpaper patterns or tilings. A pattern has translational symmetry if you can slide it a certain distance in a certain direction and it matches up with itself. This type of symmetry is fundamental in crystallography, where it describes the regular arrangement of atoms in a crystal lattice.

4. **Point Symmetry**: A figure has point symmetry if there is a point such that a rotation of the figure around that point by 180 degrees results in the same figure.

   > **Teaching Moment:** Point symmetry is a special case of rotational symmetry (specifically, rotational symmetry of order 2). It's also equivalent to central symmetry, where for every point in the figure, there's a corresponding point on the opposite side of the center. Letters like 'N', 'S', and 'Z' have approximate point symmetry. In mathematics, point symmetry is important in the study of functions and graphs.

### Problem-Solving Approach: Identifying Symmetry

When identifying symmetry in a figure, follow these steps:

1. **Check for reflectional symmetry**: Look for lines that divide the figure into mirror-image halves.
2. **Check for rotational symmetry**: Try rotating the figure around its center to see if it looks the same at certain angles.
3. **Check for translational symmetry**: For patterns, see if sliding the pattern a certain distance makes it match up with itself.
4. **Determine the order of symmetry**: Count how many times the figure looks the same during a full rotation (for rotational symmetry) or how many lines of symmetry exist (for reflectional symmetry).

**Example Problem:**
Determine the type of symmetry in the following figures: a square, an equilateral triangle, a regular hexagon.

**Solution:**
For a square:
- Reflectional symmetry: Yes, 4 lines of symmetry (horizontal, vertical, and two diagonals)
- Rotational symmetry: Yes, order 4 (looks the same after rotations of 90°, 180°, 270°, and 360°)
- Point symmetry: Yes (equivalent to rotational symmetry of order 2)

For an equilateral triangle:
- Reflectional symmetry: Yes, 3 lines of symmetry (from each vertex to the midpoint of the opposite side)
- Rotational symmetry: Yes, order 3 (looks the same after rotations of 120°, 240°, and 360°)
- Point symmetry: No (rotating by 180° does not give the same figure)

For a regular hexagon:
- Reflectional symmetry: Yes, 6 lines of symmetry (from each vertex to the opposite vertex, and from the midpoint of each side to the midpoint of the opposite side)
- Rotational symmetry: Yes, order 6 (looks the same after rotations of 60°, 120°, 180°, 240°, 300°, and 360°)
- Point symmetry: Yes (equivalent to rotational symmetry of order 2, which is present since 6 is divisible by 2)

> **Teaching Moment:** This problem illustrates how regular polygons possess both reflectional and rotational symmetry. Notice the pattern: an n-sided regular polygon has n lines of symmetry and rotational symmetry of order n. Also note that point symmetry (180° rotational symmetry) is present in regular polygons with an even number of sides but absent in those with an odd number of sides. These symmetry properties are fundamental in the classification and analysis of geometric figures.

## Practice Problems

1. Translate the triangle with vertices at (1, 2), (3, 4), and (2, 5) by the vector (2, -3).

   > **Problem-Solving Guidance**: Add the components of the translation vector to each vertex coordinate.
   
   > **Step-by-Step Approach**:
   > 1. For each vertex (x, y), calculate (x + h, y + k) where (h, k) = (2, -3)
   > 2. Vertex 1: (1, 2) → (1 + 2, 2 + (-3)) = (3, -1)
   > 3. Vertex 2: (3, 4) → (3 + 2, 4 + (-3)) = (5, 1)
   > 4. Vertex 3: (2, 5) → (2 + 2, 5 + (-3)) = (4, 2)
   > 5. The translated triangle has vertices at (3, -1), (5, 1), and (4, 2)

2. Rotate the point (3, 4) around the origin by 90 degrees counterclockwise.

   > **Problem-Solving Guidance**: Use the rotation formulas x' = x cos(θ) - y sin(θ) and y' = x sin(θ) + y cos(θ), with θ = 90°.
   
   > **Step-by-Step Approach**:
   > 1. For θ = 90°, cos(90°) = 0 and sin(90°) = 1
   > 2. x' = 3 × 0 - 4 × 1 = -4
   > 3. y' = 3 × 1 + 4 × 0 = 3
   > 4. The rotated point is (-4, 3)

3. Reflect the line segment from (1, 2) to (3, 4) over the x-axis.

   > **Problem-Solving Guidance**: For reflection over the x-axis, negate the y-coordinate of each point.
   
   > **Step-by-Step Approach**:
   > 1. For each point (x, y), calculate (x, -y)
   > 2. Point 1: (1, 2) → (1, -2)
   > 3. Point 2: (3, 4) → (3, -4)
   > 4. The reflected line segment goes from (1, -2) to (3, -4)

4. Dilate the rectangle with vertices at (1, 1), (4, 1), (4, 3), and (1, 3) from the origin with a scale factor of 2.

   > **Problem-Solving Guidance**: For dilation from the origin with scale factor k, multiply each coordinate by k.
   
   > **Step-by-Step Approach**:
   > 1. For each point (x, y), calculate (kx, ky) where k = 2
   > 2. Vertex 1: (1, 1) → (2 × 1, 2 × 1) = (2, 2)
   > 3. Vertex 2: (4, 1) → (2 × 4, 2 × 1) = (8, 2)
   > 4. Vertex 3: (4, 3) → (2 × 4, 2 × 3) = (8, 6)
   > 5. Vertex 4: (1, 3) → (2 × 1, 2 × 3) = (2, 6)
   > 6. The dilated rectangle has vertices at (2, 2), (8, 2), (8, 6), and (2, 6)

5. Determine the type of symmetry in the following figures: a square, an equilateral triangle, a regular hexagon.

   > **Problem-Solving Guidance**: Check for lines of symmetry, rotational symmetry, and point symmetry in each figure.
   
   > **Step-by-Step Approach**:
   > For a square:
   > 1. Reflectional symmetry: 4 lines (horizontal, vertical, two diagonals)
   > 2. Rotational symmetry: Order 4 (90°, 180°, 270°, 360°)
   > 3. Point symmetry: Yes
   >
   > For an equilateral triangle:
   > 1. Reflectional symmetry: 3 lines (from each vertex to opposite side)
   > 2. Rotational symmetry: Order 3 (120°, 240°, 360°)
   > 3. Point symmetry: No
   >
   > For a regular hexagon:
   > 1. Reflectional symmetry: 6 lines
   > 2. Rotational symmetry: Order 6 (60°, 120°, 180°, 240°, 300°, 360°)
   > 3. Point symmetry: Yes

## Summary

In this module, we have explored geometric transformations, including translations, rotations, reflections, and dilations. We have learned about the properties of each transformation and how to perform them. We have also studied composite transformations and symmetry in geometric figures.

> **Teaching Moment:** Transformations provide a dynamic perspective on geometry, allowing us to see how shapes can move, turn, flip, and resize while preserving certain properties. This perspective is not just mathematically elegant; it's practically useful in fields ranging from computer graphics to physics, from architecture to biology. The concepts of transformation and symmetry help us understand patterns in nature and create designs in art and engineering. As you continue your geometric journey, remember that transformations connect different areas of mathematics and provide powerful tools for solving a wide range of problems.

## Next Steps

In the next module, we will explore three-dimensional geometry. We'll extend our understanding of geometric shapes and transformations to the third dimension, exploring polyhedra, prisms, pyramids, cylinders, cones, and spheres.

> **Teaching Moment:** As we move from two dimensions to three, many of the transformation concepts we've learned will extend naturally. For example, reflections will occur across planes rather than lines, and rotations will occur around axes rather than points. The added dimension brings new challenges and insights, but the fundamental principles remain the same. This connection between dimensions is a beautiful aspect of geometry that reveals the underlying unity of mathematical concepts.

