# Content Delivery Network Design and Implementation

## Overview
This project focuses on the design and implementation of a Content Delivery Network (CDN) to facilitate seamless video streaming across various geographic locations. Using a combination of modern technologies and efficient algorithms, this CDN minimizes latency, enhances data throughput, and ensures a robust streaming experience.

## Features
- **Video Push Capability:** Enables proactive pushing of videos from origin servers to replica servers.
- **Dynamic Replica Server Selection:** Utilizes algorithms like round-robin for optimal selection of replica servers based on user proximity and server load.
- **Efficient Request Routing:** Manages user requests through a central controller to ensure efficient routing to the nearest available replica server.
- **Advanced Streaming Functionality:** Supports efficient streaming protocols such as HTTP/2, ensuring high-performance content delivery.

## Technologies Deployed
- **Backend:** Node.js
- **Frontend:** HTML, CSS, JavaScript
- **Server:** Express.js on Node.js
- **Protocol:** HTTP/2 for improved server communication
- **Database:** MongoDB for data management

## System Architecture
The CDN architecture includes:
- **Controller Server:** Manages request distribution and server load balancing, running on `localhost:3001`.
- **Edge Servers:** Located in Delhi, Germany, and Montreal, these servers handle content delivery to end-users.
- **Main Server:** Hosts the original content and interacts with the CDN for distributing content to edge servers.

## How It Works
1. **Server Initialization:** Upon startup, edge servers synchronize with the main server to update cached content.
2. **Content Delivery Process:**
   - User requests are received by the controller, which selects the appropriate edge server using a round-robin algorithm.
   - If the content is available at the edge server, it is delivered directly to the user.
   - If not, the content is fetched from the main server, cached at the edge server, and then served to the user.

## Additional Functionalities
- **Content Management:** Features for uploading, downloading, and deleting video content.
- **Performance Optimization:** Techniques like load balancing and adaptive streaming enhance user experience and system efficiency.

## Conclusion
This CDN implementation demonstrates how leveraging distributed networks can significantly improve the efficiency of content delivery systems, reducing server load and decreasing content delivery times, making it ideal for real-world applications in high-demand scenarios.

