const fs = require('fs');
const http = require('http');

async function testE2E() {
  console.log('====================================================');
  console.log('🧪 Starting InterviewAI Full-Stack End-to-End Test Suite');
  console.log('====================================================');

  const BASE_URL = 'http://127.0.0.1:5000/api';

  // 1. Health check
  console.log('\n[1/7] Testing Health Check API...');
  const healthRes = await fetch(`${BASE_URL}/health`).then((r) => r.json());
  console.log('✅ Health API:', healthRes);

  // 2. Student Login
  console.log('\n[2/7] Testing Student Authentication...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@interviewai.com',
      password: 'studentpassword123',
    }),
  }).then((r) => r.json());

  if (!loginRes.success) throw new Error('Student login failed');
  const studentToken = loginRes.token;
  console.log(`✅ Student Logged in: ${loginRes.user.name} (${loginRes.user.role})`);

  // 3. Performance Analytics
  console.log('\n[3/7] Testing Performance Analytics API...');
  const perfRes = await fetch(`${BASE_URL}/performance`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  }).then((r) => r.json());
  console.log(`✅ Performance Analytics retrieved: Avg Score = ${perfRes.analytics.averageScore}, Sessions = ${perfRes.analytics.totalInterviews}`);

  // 4. Create and Generate Interview Session
  console.log('\n[4/7] Testing AI Interview Generation (Software Engineer, 3 questions)...');
  const createRes = await fetch(`${BASE_URL}/interviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`,
    },
    body: JSON.stringify({
      jobRole: 'Software Engineer',
      experienceLevel: 'Fresher',
      interviewType: 'Technical',
      difficulty: 'Medium',
      totalQuestions: 3,
      durationMinutes: 30,
    }),
  }).then((r) => r.json());

  if (!createRes.success) throw new Error('Interview generation failed');
  const interview = createRes.interview;
  console.log(`✅ Created Interview ID: ${interview._id}`);
  console.log(`   Questions Generated: ${interview.questions.length}`);
  interview.questions.forEach((q, i) => {
    console.log(`   Q${i + 1} [${q.category}]: ${q.questionText.slice(0, 75)}...`);
  });

  // 5. Test Draft Autosave
  console.log('\n[5/7] Testing Real-Time Draft Autosave...');
  const saveRes = await fetch(`${BASE_URL}/interviews/${interview._id}/autosave`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`,
    },
    body: JSON.stringify({
      questionIndex: 0,
      userAnswer: 'A Hash Map organizes key-value pairs into buckets using hashCode and array index modulo calculation. In Java 8, bucket collisions are chained with linked lists and treeify into Red-Black trees beyond 8 elements.',
      timeSpentSeconds: 120,
    }),
  }).then((r) => r.json());
  console.log('✅ Autosave Response:', saveRes.message);

  // 6. Test Interview Submit and AI Evaluation
  console.log('\n[6/7] Submitting Interview for AI Evaluation...');
  const submitRes = await fetch(`${BASE_URL}/interviews/${interview._id}/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`,
    },
    body: JSON.stringify({
      timeSpentSeconds: 420,
      answers: [
        {
          questionIndex: 0,
          userAnswer: 'A Hash Map organizes key-value pairs into buckets using hashCode and array index modulo calculation. In Java 8, bucket collisions are chained with linked lists and treeify into Red-Black trees beyond 8 elements.',
        },
        {
          questionIndex: 1,
          userAnswer: 'SOLID principles ensure maintainable, decoupled code. Dependency Inversion asserts that high-level modules should depend upon abstractions rather than concrete classes, using dependency injection.',
        },
        {
          questionIndex: 2,
          userAnswer: 'Optimistic locking checks versions on commit for high read systems. Pessimistic locking locks records upfront with SELECT FOR UPDATE to prevent conflicting updates.',
        },
      ],
    }),
  }).then((r) => r.json());

  if (!submitRes.success) throw new Error('Submission failed');
  console.log(`✅ Interview Evaluated Successfully!`);
  console.log(`   Overall Score: ${submitRes.interview.overallScore}/100`);
  console.log(`   Technical Score: ${submitRes.interview.technicalScore}/100`);
  console.log(`   Communication: ${submitRes.interview.communicationScore}/100`);
  console.log(`   Feedback: ${submitRes.interview.overallFeedback}`);
  console.log(`   Topics to Revise: ${submitRes.interview.topicsToRevise.join(', ')}`);

  // 7. Practice Single Question AI Evaluation
  console.log('\n[7/7] Testing Question Bank Single Question Instant Practice AI Grading...');
  const qListRes = await fetch(`${BASE_URL}/questions?limit=1`).then((r) => r.json());
  const sampleQ = qListRes.questions[0];

  const practiceRes = await fetch(`${BASE_URL}/questions/practice-evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`,
    },
    body: JSON.stringify({
      questionId: sampleQ._id,
      userAnswer: 'ConcurrentHashMap provides thread safety using CAS and bucket level synchronization in Java 8 rather than whole table locking.',
    }),
  }).then((r) => r.json());

  console.log(`✅ Practice Question Evaluated: Score = ${practiceRes.evaluation.score}/100`);
  console.log(`   Feedback = ${practiceRes.evaluation.feedback}`);

  console.log('\n====================================================');
  console.log('🎉 ALL END-TO-END TESTS PASSED WITH 100% SUCCESS!');
  console.log('====================================================');
}

testE2E().catch((err) => {
  console.error('❌ E2E Test Failed:', err);
  process.exit(1);
});
