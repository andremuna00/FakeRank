# FakeRank
The university needs a software to test their students’ coding skills by proposing programming exercises evaluated with automatic verification.
![architecture](https://github.com/user-attachments/assets/3055e4ef-22a1-4eb7-af84-6b2d361a4b21)

---

## Table of Contents 📋

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [System Requirements](#system-requirements)
4. [Architecture Characteristics](#architecture-characteristics)
5. [Testing & Evaluation](#testing--evaluation)
6. [How to Deploy the System](#how-to-deploy-the-system)
7. [Architecture](#architecture)
8. [Future Work](#future-work)

---

## Overview 🌟

**FakeRank** is designed to help universities test students' coding skills through programming exercises with automatic verification. This system highlights the importance of distributed services, scalability, and modularity, offering a robust framework to explore the nuances of software architecture.

---

## Key Features ✨

### User Roles & Capabilities 👥

- **Professors:**
  - 🛠️ Create coding challenges and test cases.
  - ⏰ Set deadlines after which submissions are rejected.
  - 🎯 Specify custom grading systems with different points per exercise.
  - 📝 Review and adjust students' scores.

- **Students:**
  - 💻 Solve challenges using an integrated code editor.
  - ✅ Execute code against multiple test cases.
  - ✏️ Modify submissions before the deadline.

### General Features 🧩

- **Multi-language Support:** Challenges support various programming languages.
- **Time Constraints:** Strict deadlines enforce submission limits.
- **Automatic Evaluation:** Real-time evaluation of submissions based on provided test cases.
- **Scalability:** Supports hundreds of students and dozens of professors during peak usage.
- **Fault Tolerance:** Maintains functionality even under partial system failures.

---

## System Requirements 📋

- **Users:**
  - Hundreds of students and dozens of professors annually.
  
- **Context:**
  - Primarily used during exam sessions.
  - Designed for internal university use.
  
- **Technology:**
  - Distributed services for elasticity and modularity.
  - High reliability and fault tolerance.

---

## Architecture Characteristics 🏗️

| Characteristic    | Importance ⭐ | Related Features                                                                                           |
|-------------------|------------|-----------------------------------------------------------------------------------------------------------|
| **Deployability** | ★☆☆☆☆      | Support multiple courses and configurations (3-C).                                                       |
| **Elasticity**    | ★★★★☆      | Handles bursts of user activity during submissions (1, 2-c, 3-A).                                         |
| **Evolutionary**  | ★★☆☆☆      | Allows future extension for additional languages and features (3-B).                                     |
| **Fault Tolerance** | ★★★★☆    | Operates effectively under faults; evaluates performance under simulated failures (2-b, 2-f, 2-h).       |
| **Modularity**    | ★★★☆☆      | Components are interchangeable, aiding maintainability (2-a, 2-d, 3-B).                                  |
| **Overall Cost**  | ★★☆☆☆      | Prioritizes cost-efficient deployment strategies (3-C).                                                  |
| **Performance**   | ★★★★☆      | Measures execution time and response under high load (2-b, 2-c).                                         |
| **Reliability**   | ★★★★★      | Ensures robust functionality during exam sessions (2-c, 2-e, 2-f, 2-g).                                  |
| **Scalability**   | ★☆☆☆☆      | Supports user growth with acceptable response times (1).                                                 |
| **Simplicity**    | ★★★☆☆      | User-friendly interface for students and professors (2-a).                                              |
| **Testability**   | ★★☆☆☆      | Simplified testing procedures to validate system reliability (3-C).                                      |

---

## Testing & Evaluation 🧪

### Elasticity 📈
- Simulate bursts of user activity and measure:
  - Average and maximum response times.
  - Number of failed requests under peak load.

### Fault Tolerance ⚙️
- Simulate faults and evaluate:
  - Percentage of functioning subsystems.
  - System behavior under critical errors.

### Reliability 🔒
- Measure:
  - Time to first critical error after system startup.
  - Frequency of errors during a defined period.

### Performance ⚡
- Track spatial and temporal complexity of:
  - User code execution.
  - Overall system behavior during peak load.

### Modularity 🔧
- Evaluate:
  - Mean debugging time when replacing components.
  - Independence of component functionalities.

---

## How to Deploy the System 🚀

To deploy the system, Docker and Docker Compose are needed. After having cloned this repository, execute the following command inside the project root directory:

```bash
docker-compose up
```

Docker will automatically build and deploy all the artifacts of the system, exposing the application on port `3000`. The application is made for a Linux system. If you want to run it on a Windows machine, in the file `judge0/judge0.conf`, you might need to convert EOL to the Linux version using a text editor ([guide](https://medium.com/@woeterman_94/how-to-solve-r-command-not-found-when-using-docker-on-windows-52f9e87cef74)).

**Note:** The first deployment might take some time as Docker downloads all required images from Docker Hub.

---

## Architecture 🏛️

Our application has a service-based architecture with four services related to:

- **Challenges Management:** 🛠️ Provides all the APIs related to the creation and editing of challenges alongside their exercises.
- **Submission Management:** 🗂️ Handles submissions for challenges, including code backups and results assigned to students.
- **User Management:** 👤 Provides services related to user information.
- **Code Execution:** 💻 Executes the code written by users using the Judge0 plug-in for sandboxed code execution.

All these are independent Spring Boot services that share a common database, except for the last one, which uses Judge0 for code execution.

Additionally, there is a user interface written in React that acts as a proxy between the user and all the services. Each component of the application makes use of the authentication and authorization services provided by Auth0.

This type of architecture meets our requirements (modularity, simplicity, fault tolerance, etc.) by leveraging the advantages of a distributed architecture without excessive complexity.

![architecture](./architecture.png)

---

## Future Work 🔮

- 🛠️ Enhance deployability for broader use cases beyond the university.
- 🔄 Introduce advanced fault-tolerance mechanisms.
- ⚙️ Optimize the grading system for better performance under load.
- 🌐 Expand support for additional programming languages and features.

---

Thank you for exploring **FakeRank**! Together, let's build scalable, reliable, and efficient systems. 💻✨
