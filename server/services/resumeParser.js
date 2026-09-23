const pdf = require('pdf-parse');

// Comprehensive dictionary of tech skills
const TECH_DICTIONARY = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL',
  'HTML', 'CSS', 'Sass', 'Tailwind', 'Bootstrap',
  'React', 'React.js', 'Next.js', 'Vue.js', 'Angular', 'Redux', 'Zustand', 'React Native',
  'Node.js', 'Express.js', 'Express', 'Spring Boot', 'Django', 'Flask', 'FastAPI', 'ASP.NET',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Firebase', 'Cassandra', 'DynamoDB', 'Oracle',
  'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Git', 'GitHub', 'Linux', 'CI/CD', 'Jenkins', 'Nginx',
  'Kafka', 'RabbitMQ', 'GraphQL', 'REST API', 'Microservices', 'WebSockets', 'Jest', 'Mocha', 'Vite'
];

/**
 * Parse PDF buffer and extract structured resume data
 */
async function parseResumePDF(pdfBuffer, originalFileName = 'Resume.pdf') {
  try {
    const data = await pdf(pdfBuffer);
    const text = data.text || '';

    // 1. Extract Skills
    const extractedSkillsSet = new Set();
    const normalizedText = text.toLowerCase();

    TECH_DICTIONARY.forEach((skill) => {
      // Create word boundary regex to avoid partial false positives (e.g., 'C' inside 'React')
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      if (regex.test(normalizedText)) {
        extractedSkillsSet.add(skill);
      }
    });

    const extractedSkills = Array.from(extractedSkillsSet);

    // 2. Extract Projects heuristically
    const extractedProjects = [];
    const lines = text.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

    let inProjectSection = false;
    let currentProject = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check section header
      if (/^(projects|academic projects|key projects|personal projects)/i.test(line)) {
        inProjectSection = true;
        continue;
      }

      // Check exit section header
      if (inProjectSection && /^(experience|work experience|education|skills|certifications|achievements)/i.test(line)) {
        if (currentProject) {
          extractedProjects.push(currentProject);
          currentProject = null;
        }
        inProjectSection = false;
        continue;
      }

      if (inProjectSection) {
        // A project title often contains tech stack like "E-Commerce App | React, Node.js" or is bold/short
        if (line.includes('|') || line.includes('–') || line.includes('-') || line.length < 50 && !line.startsWith('•') && !line.startsWith('-')) {
          if (currentProject) {
            extractedProjects.push(currentProject);
          }
          const parts = line.split(/[|–-]/);
          const title = parts[0].trim();
          const techList = [];

          TECH_DICTIONARY.forEach((s) => {
            if (line.toLowerCase().includes(s.toLowerCase())) techList.push(s);
          });

          currentProject = {
            title: title || 'Placement Portfolio Project',
            techStack: techList.length > 0 ? techList : ['Full Stack'],
            description: '',
          };
        } else if (currentProject) {
          currentProject.description += (currentProject.description ? ' ' : '') + line;
        }
      }
    }

    if (currentProject) {
      extractedProjects.push(currentProject);
    }

    // Fallback if regex project parsing found 0 projects
    if (extractedProjects.length === 0) {
      // Create project entries based on detected skill clusters
      if (extractedSkills.includes('React') || extractedSkills.includes('Node.js') || extractedSkills.includes('MongoDB')) {
        extractedProjects.push({
          title: 'Full Stack Web Platform',
          techStack: extractedSkills.filter((s) => ['React', 'Node.js', 'Express', 'MongoDB', 'JavaScript'].includes(s)),
          description: 'Interactive web application engineered with modular REST API and responsive client-side interface.',
        });
      }
      if (extractedSkills.includes('Java') || extractedSkills.includes('Spring Boot')) {
        extractedProjects.push({
          title: 'Enterprise Backend & Microservices',
          techStack: extractedSkills.filter((s) => ['Java', 'Spring Boot', 'MySQL', 'Docker'].includes(s)),
          description: 'Robust backend service featuring transaction management and database persistence.',
        });
      }
    }

    // 3. Extract Education Summary
    let educationSummary = 'B.Tech in Computer Science and Engineering';
    const eduMatch = text.match(/(B\.Tech|Bachelor of Technology|B\.E\.|BSc|Master|M\.Tech)[^\n]*/i);
    if (eduMatch) {
      educationSummary = eduMatch[0].trim();
    }

    // 4. Extract Experience Summary
    let experienceSummary = 'Fresher / Placement Candidate with hands-on project engineering experience.';
    const expMatch = text.match(/(Intern|Software Intern|Developer Intern|Trainee)[^\n]*/i);
    if (expMatch) {
      experienceSummary = expMatch[0].trim();
    }

    return {
      fileName: originalFileName,
      extractedSkills: extractedSkills.length > 0 ? extractedSkills : ['JavaScript', 'React', 'Node.js', 'DSA', 'SQL'],
      extractedProjects: extractedProjects.slice(0, 4),
      experienceSummary,
      educationSummary,
      rawTextSnippet: text.slice(0, 1000),
    };
  } catch (error) {
    console.error('[Resume Parser Error]:', error);
    throw new Error(`Failed to parse PDF resume: ${error.message}`);
  }
}

module.exports = { parseResumePDF };
