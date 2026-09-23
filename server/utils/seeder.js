const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Question = require('../models/Question');
const Interview = require('../models/Interview');
const Performance = require('../models/Performance');

dotenv.config({ path: __dirname + '/../.env' });

const CATEGORIES = [
  { name: 'Java', slug: 'java', icon: 'Coffee', color: '#f59e0b', description: 'Core Java, Collections, Multithreading, JVM & Streams' },
  { name: 'C++', slug: 'cpp', icon: 'Code2', color: '#3b82f6', description: 'OOPs, Pointers, Memory Management, STL & Modern C++' },
  { name: 'JavaScript', slug: 'javascript', icon: 'FileCode', color: '#eab308', description: 'ES6+, Event Loop, Closures, Promises & Async/Await' },
  { name: 'React', slug: 'react', icon: 'Atom', color: '#06b6d4', description: 'Hooks, Virtual DOM, State Management & Optimization' },
  { name: 'Node.js', slug: 'nodejs', icon: 'Server', color: '#22c55e', description: 'Event-driven I/O, Express, Streams, Libuv & Microservices' },
  { name: 'MongoDB', slug: 'mongodb', icon: 'Database', color: '#10b981', description: 'Document Modeling, Aggregations, Indexing & Sharding' },
  { name: 'SQL', slug: 'sql', icon: 'Table', color: '#6366f1', description: 'Complex Queries, Joins, Window Functions & Subqueries' },
  { name: 'DBMS', slug: 'dbms', icon: 'HardDrive', color: '#8b5cf6', description: 'ACID Properties, Normalization, Transactions & Concurrency' },
  { name: 'Operating Systems', slug: 'operating-systems', icon: 'Cpu', color: '#ec4899', description: 'Processes, Threads, Deadlocks, Paging & Scheduling' },
  { name: 'Computer Networks', slug: 'computer-networks', icon: 'Network', color: '#14b8a6', description: 'OSI Model, TCP/IP, DNS, HTTP/HTTPS & WebSockets' },
  { name: 'DSA', slug: 'dsa', icon: 'Binary', color: '#ef4444', description: 'Arrays, Trees, Graphs, Dynamic Programming & Big-O' },
  { name: 'HR', slug: 'hr', icon: 'UserCheck', color: '#84cc16', description: 'Culture Fit, Goals, Career Aspirations & Soft Skills' },
  { name: 'Behavioral', slug: 'behavioral', icon: 'MessageSquare', color: '#f97316', description: 'STAR Method, Conflict Resolution, Teamwork & Leadership' },
];

const QUESTIONS = [
  // Java
  {
    categoryName: 'Java',
    role: 'Java Developer',
    difficulty: 'Medium',
    type: 'Technical',
    questionText: 'Explain the difference between HashMap and ConcurrentHashMap in Java. How does ConcurrentHashMap achieve thread safety in Java 8?',
    idealAnswer: 'HashMap is not synchronized and allows one null key and multiple null values; it is not thread-safe. ConcurrentHashMap provides thread-safe operations without locking the whole map. In Java 8, it uses synchronized blocks on the head node of each bucket (or CAS operations) rather than segment-level locking, allowing multiple threads to read concurrently and write to distinct buckets with high throughput.',
    keyPoints: ['Thread safety differences', 'CAS (Compare-And-Swap) in Java 8', 'Treeification into Red-Black trees', 'No lock during get() operations'],
    tags: ['Java', 'Concurrency', 'Collections', 'Thread-Safety'],
  },
  {
    categoryName: 'Java',
    role: 'Java Developer',
    difficulty: 'Hard',
    type: 'Technical',
    questionText: 'What are Java Memory Leak symptoms and how do you diagnose them using tools like VisualVM or Eclipse Memory Analyzer (MAT)?',
    idealAnswer: 'Memory leaks in Java occur when objects that are no longer needed remain reachable from GC Roots (e.g., unclosed resources, static collections, listeners, or thread-locals). Symptoms include growing heap usage, frequent Full GCs, and OutOfMemoryError. Diagnosis involves capturing a heap dump (.hprof), opening it in VisualVM/MAT, inspecting the Dominator Tree, and identifying retained heap sizes and shortest paths to GC roots.',
    keyPoints: ['GC Roots reachability', 'Static references and unclosed listeners', 'Heap dump analysis (.hprof)', 'Dominator tree in MAT'],
    tags: ['Java', 'Memory Management', 'JVM', 'Profiling'],
  },
  // C++
  {
    categoryName: 'C++',
    role: 'Software Engineer',
    difficulty: 'Medium',
    type: 'Technical',
    questionText: 'What is RAII (Resource Acquisition Is Initialization) in C++? Contrast std::unique_ptr and std::shared_ptr.',
    idealAnswer: 'RAII binds the lifecycle of a resource (heap memory, file handle, socket) to the lifetime of a stack-allocated object, ensuring cleanup in destructors even on exceptions. std::unique_ptr maintains exclusive ownership of a dynamic pointer with zero runtime overhead and cannot be copied (only moved). std::shared_ptr provides reference-counted shared ownership, freeing memory when the reference count reaches zero.',
    keyPoints: ['RAII and exception safety', 'std::unique_ptr exclusive ownership and std::move', 'std::shared_ptr atomic reference counting', 'std::weak_ptr to break circular references'],
    tags: ['C++', 'Smart Pointers', 'Memory Management', 'RAII'],
  },
  // JavaScript
  {
    categoryName: 'JavaScript',
    role: 'Frontend Developer',
    difficulty: 'Hard',
    type: 'Technical',
    questionText: 'Explain Closures in JavaScript and how they interact with lexical scoping. Describe a practical scenario where closures are critical.',
    idealAnswer: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment. A closure gives an inner function access to its outer scope even after the outer function has finished executing. Practical scenarios include data privacy/encapsulation (creating private variables in factory functions), currying/partial application, memoization caches, and event handler state capture.',
    keyPoints: ['Lexical scoping chain', 'Outer function execution context retention', 'Private state emulation', 'Debouncing and throttling handlers'],
    tags: ['JavaScript', 'Closures', 'Lexical Scope', 'Advanced JS'],
  },
  // React
  {
    categoryName: 'React',
    role: 'Frontend Developer',
    difficulty: 'Medium',
    type: 'Technical',
    questionText: 'What is the React Virtual DOM and how does the Fiber reconciler optimize updates?',
    idealAnswer: 'The Virtual DOM is an in-memory lightweight representation of the real DOM tree. When component state changes, React renders a new virtual tree and runs a diffing algorithm against the previous tree. React Fiber broke the synchronous recursive reconciliation into incremental units of work (fibers) that can be paused, prioritized, and aborted. This ensures high-priority interactions (typing, animations) stay smooth while background renders proceed without jank.',
    keyPoints: ['Diffing heuristic O(n)', 'Fiber incremental rendering', 'Render phase vs Commit phase', 'Priority lanes and scheduling'],
    tags: ['React', 'Virtual DOM', 'Reconciliation', 'Fiber'],
  },
  {
    categoryName: 'React',
    role: 'Frontend Developer',
    difficulty: 'Medium',
    type: 'Technical',
    questionText: 'Differentiate useEffect, useLayoutEffect, and useMemo. When should you avoid overusing useMemo?',
    idealAnswer: 'useEffect runs asynchronously after the DOM mutations have been painted to the screen, suitable for data fetching, subscriptions, and timers. useLayoutEffect runs synchronously immediately after DOM mutations but before the browser paints, ideal for measuring DOM layout or preventing visual flicker. useMemo caches computed values between re-renders based on a dependency array. Overusing useMemo introduces memory overhead and dependency array comparison costs that often outweigh trivial recalculations.',
    keyPoints: ['Paint timing differences', 'Layout measurement with useLayoutEffect', 'Premature optimization pitfall with useMemo', 'Dependency array hygiene'],
    tags: ['React', 'Hooks', 'Performance'],
  },
  // Node.js
  {
    categoryName: 'Node.js',
    role: 'Backend Developer',
    difficulty: 'Medium',
    type: 'Technical',
    questionText: 'Explain the Libuv thread pool in Node.js. Which asynchronous operations use the thread pool vs OS kernel non-blocking mechanisms?',
    idealAnswer: 'Node.js runs single-threaded JavaScript, but delegates asynchronous I/O to libuv. Network I/O (TCP, UDP, HTTP) is handled using OS non-blocking primitives (epoll on Linux, kqueue on macOS, IOCP on Windows) without thread pool overhead. The libuv worker thread pool (default 4 threads, configurable via UV_THREADPOOL_SIZE) is reserved for file system operations (fs), DNS lookups (dns.lookup), compression (zlib), and CPU-intensive crypto operations (crypto.pbkdf2, bcrypt).',
    keyPoints: ['Single threaded JS call stack', 'Libuv event loop phases', 'epoll/kqueue for network sockets', 'UV_THREADPOOL_SIZE for file system and crypto'],
    tags: ['Node.js', 'Libuv', 'Asynchronous', 'System Architecture'],
  },
  // MongoDB
  {
    categoryName: 'MongoDB',
    role: 'Backend Developer',
    difficulty: 'Medium',
    type: 'Technical',
    questionText: 'Explain Compound Indexes and the ESR (Equality, Sort, Range) rule in MongoDB query optimization.',
    idealAnswer: 'A compound index indexes multiple fields in a document. The ESR rule is a guideline for ordering fields in a compound index to maximize efficiency: 1) Equality fields first (exact matches that filter out large subsets), 2) Sort fields next (ensures in-index sorting without costly in-memory sorts), 3) Range fields last (operators like $gt, $lt, $in). Following ESR allows MongoDB to satisfy the query entirely within the index B-Tree without scanning unneeded index keys.',
    keyPoints: ['Compound index prefix rule', 'ESR ordering: Equality -> Sort -> Range', 'Preventing SORT_KEY_GENERATOR stage in explain()', 'Index selectivity'],
    tags: ['MongoDB', 'Indexing', 'Performance', 'Database'],
  },
  // SQL & DBMS
  {
    categoryName: 'DBMS',
    role: 'Software Engineer',
    difficulty: 'Hard',
    type: 'Technical',
    questionText: 'Explain ACID properties in Database Management Systems and how WAL (Write-Ahead Logging) guarantees durability and atomicity.',
    idealAnswer: 'ACID stands for Atomicity (all-or-nothing), Consistency (preserves database constraints), Isolation (concurrent transactions do not interfere), and Durability (committed changes persist across crashes). Write-Ahead Logging (WAL) ensures that log records describing data page changes are flushed to non-volatile disk before the actual database pages are written to disk. On recovery after a crash, the database replays the WAL (Redo) to restore committed transactions and rolls back uncommitted ones (Undo).',
    keyPoints: ['Atomicity, Consistency, Isolation, Durability', 'Write-Ahead Logging (WAL)', 'Redo and Undo logs for crash recovery', 'Isolation levels (Read Committed, Serializable)'],
    tags: ['DBMS', 'ACID', 'Transactions', 'Storage Engines'],
  },
  // Operating Systems
  {
    categoryName: 'Operating Systems',
    role: 'Software Engineer',
    difficulty: 'Medium',
    type: 'Technical',
    questionText: 'What are the four necessary Coffman conditions for a Deadlock to occur in an Operating System? How can deadlocks be prevented?',
    idealAnswer: 'The four Coffman conditions are: 1) Mutual Exclusion (resources cannot be shared), 2) Hold and Wait (process holds resource while requesting another), 3) No Preemption (resources cannot be forcibly taken), 4) Circular Wait (closed chain of processes waiting for next resource). Deadlocks can be prevented by breaking at least one condition: enforcing total resource ordering to eliminate circular wait, requiring all resources upfront to eliminate hold-and-wait, or using Banker algorithm for avoidance.',
    keyPoints: ['Mutual Exclusion', 'Hold and Wait', 'No Preemption', 'Circular Wait', 'Resource allocation graph & Banker algorithm'],
    tags: ['Operating Systems', 'Deadlock', 'Concurrency'],
  },
  // Computer Networks
  {
    categoryName: 'Computer Networks',
    role: 'Software Engineer',
    difficulty: 'Medium',
    type: 'Technical',
    questionText: 'What is the TCP Three-Way Handshake and the Four-Way Wave (Teardown)? Why does TIME_WAIT state exist?',
    idealAnswer: 'TCP Handshake establishes a reliable full-duplex connection: 1) Client sends SYN with initial seq number, 2) Server replies SYN-ACK, 3) Client replies ACK. Connection teardown uses 4 steps: FIN -> ACK -> FIN -> ACK. The TIME_WAIT state (typically 2x Maximum Segment Lifetime, 2MSL) ensures the final ACK reached the peer (retransmitting if lost) and prevents delayed duplicate packets from an old connection interfering with a new incarnation on the same port.',
    keyPoints: ['SYN, SYN-ACK, ACK sequence', 'FIN teardown sequence', 'TIME_WAIT purpose and 2MSL duration', 'Preventing socket incarnation conflicts'],
    tags: ['Computer Networks', 'TCP/IP', 'Sockets'],
  },
  // DSA
  {
    categoryName: 'DSA',
    role: 'Software Engineer',
    difficulty: 'Hard',
    type: 'Technical',
    questionText: 'How would you detect and remove a cycle in a Singly Linked List in O(n) time and O(1) auxiliary space? Explain Floyd Cycle-Finding Algorithm.',
    idealAnswer: 'Use Floyd Cycle-Finding Algorithm (Tortoise and Hare). Maintain two pointers: slow moves 1 node at a time, fast moves 2 nodes. If they meet, a cycle exists. To find the cycle entrance, reset slow to head while keeping fast at meeting point, then move both 1 step at a time; they will meet exactly at the cycle head. To remove the cycle, traverse until fast.next equals slow, then set fast.next = null.',
    keyPoints: ['Tortoise and Hare pointer speeds', 'Proof of meeting point and cycle head distance', 'O(n) time and O(1) space guarantee', 'Breaking the loop pointer'],
    tags: ['DSA', 'Linked List', 'Algorithms', 'Pointers'],
  },
  // HR
  {
    categoryName: 'HR',
    role: 'Software Engineer',
    difficulty: 'Easy',
    type: 'HR',
    questionText: 'Tell me about yourself, your academic background, and why you are enthusiastic about beginning your career with our engineering team.',
    idealAnswer: 'Structure the response with Present-Past-Future: Start with your current status as a final year B.Tech CSE student passionate about distributed systems and full-stack software development. Highlight notable technical projects (e.g. MERN applications, algorithms practice, hackathon participation). Conclude with your motivation to join this specific engineering culture where you can solve scalable customer problems and collaborate with top engineers.',
    keyPoints: ['Present-Past-Future structure', 'Highlighting concrete technical projects', 'Company culture alignment', 'Enthusiastic and concise delivery'],
    tags: ['HR', 'Self Introduction', 'Campus Placement'],
  },
  // Behavioral
  {
    categoryName: 'Behavioral',
    role: 'Software Engineer',
    difficulty: 'Medium',
    type: 'Behavioral',
    questionText: 'Describe a situation where you had a tight project deadline with ambiguous technical requirements. How did you deliver successfully?',
    idealAnswer: 'Adopt the STAR framework: Situation (describe project scope and vague requirements), Task (identifying user needs and delivering on time), Action (proactively reached out to stakeholders/mentors, drafted architectural specs, broke development into minimum viable increments, and implemented automated tests), Result (delivered on schedule, prevented scope creep, and received positive peer feedback).',
    keyPoints: ['Situation, Task, Action, Result (STAR)', 'Proactive stakeholder clarification', 'Iterative prioritization', 'Measurable outcome and reflection'],
    tags: ['Behavioral', 'STAR Method', 'Problem Solving', 'Leadership'],
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/interviewai');
    console.log('[Seeder] Connected to MongoDB.');

    // Clear existing collections
    await User.deleteMany();
    await Category.deleteMany();
    await Question.deleteMany();
    await Interview.deleteMany();
    await Performance.deleteMany();
    console.log('[Seeder] Cleared previous records.');

    // 1. Create Default Users
    const admin = await User.create({
      name: 'Platform Admin',
      email: 'admin@interviewai.com',
      password: 'adminpassword123',
      role: 'admin',
      targetRole: 'Engineering Manager',
      experienceLevel: 'Senior',
      bio: 'InterviewAI Platform Administrator and Senior Tech Interviewer.',
    });

    const student = await User.create({
      name: 'Sarvendra Vikram Singh',
      email: 'student@interviewai.com',
      password: 'studentpassword123',
      role: 'user',
      targetRole: 'Software Engineer',
      experienceLevel: 'Fresher',
      college: 'Institute of Engineering & Technology',
      branch: 'Computer Science and Engineering',
      graduationYear: 2026,
      bio: 'B.Tech CSE student preparing for tier-1 tech placements. Passionate about Full-Stack, System Architecture, and Algorithms.',
    });

    console.log('[Seeder] Seeded Admin (admin@interviewai.com) and Student (student@interviewai.com).');

    // 2. Create Categories
    const categoryDocs = await Category.insertMany(CATEGORIES);
    console.log(`[Seeder] Seeded ${categoryDocs.length} Categories.`);

    // 3. Create Questions
    const questionsWithMeta = QUESTIONS.map((q) => {
      const cat = categoryDocs.find((c) => c.name.toLowerCase() === q.categoryName.toLowerCase());
      return {
        ...q,
        category: cat ? cat._id : null,
        isSystemSeeded: true,
        createdBy: admin._id,
      };
    });

    const questionDocs = await Question.insertMany(questionsWithMeta);
    console.log(`[Seeder] Seeded ${questionDocs.length} Question Bank Questions.`);

    // Update Category counts
    for (const cat of categoryDocs) {
      const count = await Question.countDocuments({ categoryName: cat.name });
      cat.questionCount = count;
      await cat.save();
    }


    // 4. Create Initial Completed Mock Interviews for Student
    // Interview 1: Software Engineer Technical Interview
    const interview1 = await Interview.create({
      user: student._id,
      title: 'Software Engineer — Campus Placement Mock',
      jobRole: 'Software Engineer',
      experienceLevel: 'Fresher',
      interviewType: 'Technical',
      difficulty: 'Medium',
      totalQuestions: 4,
      durationMinutes: 30,
      timeSpentSeconds: 1140,
      status: 'completed',
      overallScore: 84,
      technicalScore: 88,
      communicationScore: 82,
      problemSolvingScore: 82,
      overallFeedback: 'Strong candidate with clear fundamental knowledge in data structures and operating systems. Answer articulation was structured and concise.',
      strongAreas: ['Data Structures & Hashing', 'System Architecture Fundamentals', 'Structured Communication'],
      weakAreas: ['Edge-case analysis in distributed systems', 'Production monitoring metrics'],
      topicsToRevise: ['Concurrency & Lock Contention', 'Database Indexing B+ Trees'],
      recommendations: [
        'State Big-O time and space complexity at the start of every technical explanation.',
        'Use concrete real-world production analogies when describing system trade-offs.',
      ],
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      questions: [
        {
          questionIndex: 0,
          questionText: 'Explain the internal workings of a Hash Map in Java or JavaScript. How are collisions resolved?',
          category: 'Data Structures',
          difficulty: 'Medium',
          type: 'Technical',
          idealAnswerHint: 'Buckets, hash function, separate chaining, linked lists to treeification in Java 8.',
        },
        {
          questionIndex: 1,
          questionText: 'What are the SOLID design principles in software engineering? Explain the Dependency Inversion Principle.',
          category: 'Software Engineering',
          difficulty: 'Medium',
          type: 'Technical',
          idealAnswerHint: 'Single responsibility, open-closed, Liskov, interface segregation, dependency inversion.',
        },
        {
          questionIndex: 2,
          questionText: 'Explain the difference between Optimistic Concurrency Control and Pessimistic Concurrency Control.',
          category: 'Database Management',
          difficulty: 'Hard',
          type: 'Technical',
          idealAnswerHint: 'Versioning in optimistic locks vs row locks in pessimistic locks.',
        },
        {
          questionIndex: 3,
          questionText: 'Tell me about a challenging technical bug you encountered in a project. How did you diagnose and resolve it?',
          category: 'Behavioral',
          difficulty: 'Medium',
          type: 'Behavioral',
          idealAnswerHint: 'STAR method, logging, root cause analysis, prevention.',
        },
      ],
      answers: [
        {
          questionIndex: 0,
          questionText: 'Explain the internal workings of a Hash Map in Java or JavaScript. How are collisions resolved?',
          userAnswer: 'A HashMap works with an array of buckets. When a key is inserted, its hashCode is calculated and mapped to an index using modulo operation. If two keys produce the same index, a collision happens. In Java, collisions are handled via Separate Chaining with linked lists. In Java 8, when a bucket exceeds 8 elements, it converts to a Red-Black tree for O(log n) worst-case lookup instead of O(n).',
          evaluation: {
            score: 92,
            technicalScore: 95,
            relevanceScore: 92,
            completenessScore: 90,
            communicationScore: 90,
            problemSolvingScore: 92,
            feedback: 'Exceptional answer with accurate mention of Java 8 treeification and time complexities.',
            strengths: ['Accurate hash code calculation mechanism', 'Mentioned Java 8 Red-Black tree threshold'],
            improvements: ['Could briefly mention load factor and rehashing trigger (0.75 default).'],
            topicsToRevise: ['Rehashing and memory allocation'],
            suggestedIdealAnswer: 'A HashMap uses an array of Node objects. A hash is computed via key.hashCode() and spread to fit the bucket table size. Collisions are handled via separate chaining. When the bucket length reaches TREEIFY_THRESHOLD (8) and capacity >= 64, nodes transform into TreeNode (Red-Black tree) guaranteeing O(log N) worst-case lookup.',
          },
        },
        {
          questionIndex: 1,
          questionText: 'What are the SOLID design principles in software engineering? Explain the Dependency Inversion Principle.',
          userAnswer: 'SOLID principles are guidelines for maintainable OOP design: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. DIP states that high-level modules should not depend on low-level modules; both should depend on abstractions. Also abstractions should not depend on details; details depend on abstractions. For example, using interfaces for repository layers instead of direct database classes.',
          evaluation: {
            score: 88,
            technicalScore: 90,
            relevanceScore: 90,
            completenessScore: 85,
            communicationScore: 88,
            problemSolvingScore: 85,
            feedback: 'Clear definitions and good practical repository interface example.',
            strengths: ['Covered all 5 acronyms correctly', 'Clear code design example for DIP'],
            improvements: ['Can mention how dependency injection frameworks (Spring, NestJS) implement DIP.'],
            topicsToRevise: ['Inversion of Control (IoC) containers'],
            suggestedIdealAnswer: 'DIP states that high-level business logic must be decoupled from low-level implementation details through interfaces. Instead of UserService directly instantiating MongoUserRepository, it receives an interface UserRepository via constructor injection.',
          },
        },
        {
          questionIndex: 2,
          questionText: 'Explain the difference between Optimistic Concurrency Control and Pessimistic Concurrency Control.',
          userAnswer: 'Optimistic locking assumes conflicts are rare. It uses a version number or timestamp column. During update, it checks if the version matches. If someone updated it first, the transaction fails and retries. Pessimistic locking assumes conflicts will happen, so it locks the record upfront using SELECT FOR UPDATE until commit. Optimistic is best for high-read web apps; pessimistic is best for financial apps with frequent conflicts.',
          evaluation: {
            score: 85,
            technicalScore: 86,
            relevanceScore: 88,
            completenessScore: 82,
            communicationScore: 85,
            problemSolvingScore: 82,
            feedback: 'Solid explanation of mechanisms and accurate use-case comparison.',
            strengths: ['Version column mechanism', 'Good real-world trade-off contrast'],
            improvements: ['Mention deadlocks that can arise from pessimistic locks.'],
            topicsToRevise: ['Database isolation levels & Deadlocks'],
            suggestedIdealAnswer: 'OCC checks for conflicts only at commit time using version tags (ideal for low conflict, web-scale reads). PCC acquires exclusive row/table locks upfront (SELECT FOR UPDATE) preventing any concurrent modification at the cost of throughput and potential deadlocks.',
          },
        },
        {
          questionIndex: 3,
          questionText: 'Tell me about a challenging technical bug you encountered in a project. How did you diagnose and resolve it?',
          userAnswer: 'In my full-stack MERN application, users reported that authentication was randomly dropping on page refresh. I inspected network requests and saw a CORS cookie issue where the SameSite attribute was set to Strict while the API was on a different subdomain. I used Chrome DevTools Application tab, reviewed Express cookie options, and set SameSite to None with Secure true and proper credentials headers. The issue was permanently resolved.',
          evaluation: {
            score: 78,
            technicalScore: 80,
            relevanceScore: 85,
            completenessScore: 75,
            communicationScore: 78,
            problemSolvingScore: 76,
            feedback: 'Good troubleshooting story adhering to real-world browser security policies.',
            strengths: ['Diagnosed root cause using DevTools', 'Addressed CORS and cookie security headers'],
            improvements: ['Structure more explicitly with Situation, Task, Action, Result (STAR).'],
            topicsToRevise: ['Web Security Headers (CORS, CSRF, SameSite)'],
            suggestedIdealAnswer: 'Using the STAR method: Situation (auth token drop), Task (isolate root cause without disrupting active sessions), Action (network trace, diagnosed cross-site cookie blocking, updated CORS headers & SameSite flag), Result (zero auth dropped, learned browser security boundaries).',
          },
        },
      ],
    });


    // Interview 2: Full Stack Developer Interview (Recent)
    const interview2 = await Interview.create({
      user: student._id,
      title: 'Full Stack Developer — Placement Round',
      jobRole: 'Full Stack Developer',
      experienceLevel: 'Fresher',
      interviewType: 'Technical',
      difficulty: 'Medium',
      totalQuestions: 3,
      durationMinutes: 30,
      timeSpentSeconds: 960,
      status: 'completed',
      overallScore: 90,
      technicalScore: 92,
      communicationScore: 88,
      problemSolvingScore: 90,
      overallFeedback: 'Superb performance demonstrating holistic full-stack fluency, API security best practices, and clean architecture understanding.',
      strongAreas: ['JWT Authentication & Cookie Security', 'React Virtual DOM Optimization', 'Database Performance Tuning'],
      weakAreas: ['WebSockets horizontal scaling'],
      topicsToRevise: ['Redis Pub/Sub for WebSockets'],
      recommendations: ['Keep sharpening distributed systems scaling patterns.'],
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      questions: [
        {
          questionIndex: 0,
          questionText: 'Explain how full-stack authentication works using JWTs with Access and Refresh tokens. How do you prevent XSS and CSRF attacks?',
          category: 'Full Stack & Security',
          difficulty: 'Hard',
          type: 'Technical',
          idealAnswerHint: 'Access token in memory, refresh token in httpOnly Secure SameSite cookie.',
        },
        {
          questionIndex: 1,
          questionText: 'What causes unnecessary re-renders in React applications, and what strategies do you use to optimize performance?',
          category: 'React.js',
          difficulty: 'Medium',
          type: 'Technical',
          idealAnswerHint: 'State placement, reference equality, React.memo, useMemo, useCallback.',
        },
        {
          questionIndex: 2,
          questionText: 'How do you optimize a slow database query in production? Explain EXPLAIN plans and indexing.',
          category: 'Databases',
          difficulty: 'Medium',
          type: 'Technical',
          idealAnswerHint: 'EXPLAIN execution plan, COLLSCAN vs IXSCAN, compound indexing, covering index.',
        },
      ],
      answers: [
        {
          questionIndex: 0,
          questionText: 'Explain how full-stack authentication works using JWTs with Access and Refresh tokens. How do you prevent XSS and CSRF attacks?',
          userAnswer: 'Short-lived access tokens (15m) are stored in application memory to prevent XSS attacks because malicious scripts cannot read in-memory variables. Long-lived refresh tokens (7d) are stored in an httpOnly, Secure, SameSite=Strict cookie so JavaScript cannot access it, blocking XSS, while SameSite blocks CSRF. When access token expires, client calls /refresh endpoint silently.',
          evaluation: {
            score: 95,
            technicalScore: 96,
            relevanceScore: 95,
            completenessScore: 94,
            communicationScore: 94,
            problemSolvingScore: 95,
            feedback: 'Mastery of web security and modern token architecture demonstrated.',
            strengths: ['Storage security boundaries clearly stated', 'Addressed both XSS and CSRF mitigations'],
            improvements: ['Can mention token rotation and blacklisting on logout.'],
            topicsToRevise: ['Refresh Token Rotation'],
            suggestedIdealAnswer: 'Store short-lived access tokens in JavaScript memory. Store refresh tokens in httpOnly, Secure, SameSite=Lax/Strict cookies with Refresh Token Rotation to invalidate stolen tokens.',
          },
        },
        {
          questionIndex: 1,
          questionText: 'What causes unnecessary re-renders in React applications, and what strategies do you use to optimize performance?',
          userAnswer: 'Unnecessary re-renders occur when a parent re-renders and re-creates object or function references passed as props to children, or when global context changes frequently. Optimizations include: 1) Colocating state down to only the components that need it, 2) React.memo for pure presentation components, 3) useCallback for stable callback references, 4) useMemo for expensive calculations.',
          evaluation: {
            score: 90,
            technicalScore: 92,
            relevanceScore: 90,
            completenessScore: 88,
            communicationScore: 88,
            problemSolvingScore: 90,
            feedback: 'Accurate distinction between state lifting and colocation.',
            strengths: ['Identified reference equality issue', 'Balanced optimization strategies'],
            improvements: ['Can mention virtualized lists (react-window) for long arrays.'],
            topicsToRevise: ['DOM Virtualization'],
            suggestedIdealAnswer: 'Re-renders stem from state changes, parent renders, or new prop references. Optimize by colocating state, splitting contexts, wrapping pure children in React.memo with useCallback/useMemo, and virtualizing long lists.',
          },
        },
        {
          questionIndex: 2,
          questionText: 'How do you optimize a slow database query in production? Explain EXPLAIN plans and indexing.',
          userAnswer: 'First, enable database profiling or slow query logs to identify queries taking > 100ms. Run EXPLAIN on the slow query to examine the execution plan. If execution shows COLLSCAN (full table scan), create an index. For multiple filter fields, use compound indexes following the ESR rule. Ensure queries use covering indexes where all requested fields come directly from index without fetching full documents.',
          evaluation: {
            score: 86,
            technicalScore: 88,
            relevanceScore: 90,
            completenessScore: 82,
            communicationScore: 85,
            problemSolvingScore: 86,
            feedback: 'Solid practical approach with correct stages of DB query optimization.',
            strengths: ['Mentioned slow query log and profiling', 'Explained COLLSCAN vs index scan and ESR rule'],
            improvements: ['Can mention database connection pooling and caching layers (Redis).'],
            topicsToRevise: ['Redis cache-aside pattern'],
            suggestedIdealAnswer: 'Use profiling to identify slow queries, inspect execution stages using EXPLAIN (look for COLLSCAN or in-memory sorts), add compound indexes adhering to ESR rule, use projection to achieve covering indexes, and cache read-heavy results with Redis.',
          },
        },
      ],
    });


    // 5. Seed Performance Records
    await Performance.create([
      {
        user: student._id,
        interview: interview1._id,
        jobRole: interview1.jobRole,
        interviewType: interview1.interviewType,
        difficulty: interview1.difficulty,
        overallScore: interview1.overallScore,
        technicalScore: interview1.technicalScore,
        communicationScore: interview1.communicationScore,
        problemSolvingScore: interview1.problemSolvingScore,
        strongAreas: interview1.strongAreas,
        weakAreas: interview1.weakAreas,
        date: interview1.completedAt,
      },
      {
        user: student._id,
        interview: interview2._id,
        jobRole: interview2.jobRole,
        interviewType: interview2.interviewType,
        difficulty: interview2.difficulty,
        overallScore: interview2.overallScore,
        technicalScore: interview2.technicalScore,
        communicationScore: interview2.communicationScore,
        problemSolvingScore: interview2.problemSolvingScore,
        strongAreas: interview2.strongAreas,
        weakAreas: interview2.weakAreas,
        date: interview2.completedAt,
      },
    ]);

    console.log('[Seeder] Seeded student mock interviews and performance records.');
    console.log('====================================================');
    console.log('✅ Database seeded successfully!');
    console.log('====================================================');
    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
}

seedDatabase();
