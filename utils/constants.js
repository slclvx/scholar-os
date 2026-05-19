export const PRIORITIES = ['Low', 'Medium', 'High'];
export const ASSIGNMENT_STATUSES = ['Not Started', 'In Progress', 'Done'];
export const EXAM_STATUSES = ['Upcoming', 'Studying', 'Done'];
export const COLLEGE_TIERS = ['Dream', 'Target', 'Safety'];
export const COLLEGE_STATUSES = ['Researching','Applying','Applied','Accepted','Rejected','Waitlisted','Enrolled'];
export const ESSAY_STATUSES = ['Not Started','Brainstorming','Drafting','Revising','Final'];
export const GOAL_STATUSES = ['Active','Completed','Paused'];
export const BOOK_STATUSES = ['Want to Read','Reading','Completed'];
export const PROJECT_STATUSES = ['Planning','In Progress','Completed','On Hold'];
export const MILESTONE_STATUSES = ['Todo','In Progress','Done'];
export const SPENDING_CATEGORIES = ['Food','Transport','Books','Entertainment','Clothing','Tech','Health','Other'];
export const ACTIVITY_CATEGORIES = ['Athletics','Arts','Community Service','Student Government','Academic Club','Research','Work/Internship','Religious/Cultural','Family Responsibilities','Other'];
export const TEST_TYPES = ['SAT','ACT','AP Exam','PSAT','SAT Subject','IB Exam'];
export const AWARD_LEVELS = ['School','Regional','State','National','International'];
export const MOODS = ['😔','😕','😐','🙂','😊'];
export const HABIT_ICONS = ['📚','🏃','💧','🧘','📵','✏️','🎯','🥗','😴','🎸','⭐','💪','🧹','🌅','📝','🎨','🧠','🌿','☀️','🔥'];
export const CLASS_COLORS = ['#6366f1','#ec4899','#14b8a6','#f97316','#eab308','#22c55e','#3b82f6','#a855f7','#ef4444','#06b6d4'];

export const TIER_COLORS = { Dream: '#ec4899', Target: '#6366f1', Safety: '#22c55e' };
export const AWARD_COLORS = { School: '#6366f1', Regional: '#14b8a6', State: '#f59e0b', National: '#ec4899', International: '#ef4444' };

export const PRIORITY_STYLES = {
  High:   { bg: '#1a0a0a', text: '#ef4444' },
  Medium: { bg: '#1a1400', text: '#f59e0b' },
  Low:    { bg: '#0a1a0a', text: '#22c55e' },
};

export const STATUS_STYLES = {
  'Not Started':   { bg: '#111',    text: '#6b7280' },
  'In Progress':   { bg: '#16173a', text: '#6366f1' },
  'Done':          { bg: '#0a1a0a', text: '#22c55e' },
  'Completed':     { bg: '#0a1a0a', text: '#22c55e' },
  'Upcoming':      { bg: '#1a1400', text: '#f59e0b' },
  'Studying':      { bg: '#16173a', text: '#6366f1' },
  'Researching':   { bg: '#16173a', text: '#6366f1' },
  'Applying':      { bg: '#1a1400', text: '#f59e0b' },
  'Applied':       { bg: '#001a18', text: '#14b8a6' },
  'Accepted':      { bg: '#0a1a0a', text: '#22c55e' },
  'Rejected':      { bg: '#1a0a0a', text: '#ef4444' },
  'Waitlisted':    { bg: '#1a0d00', text: '#f97316' },
  'Enrolled':      { bg: '#1a0018', text: '#ec4899' },
  'Won':           { bg: '#0a1a0a', text: '#22c55e' },
  'Want to Read':  { bg: '#111',    text: '#6b7280' },
  'Reading':       { bg: '#16173a', text: '#6366f1' },
  'Active':        { bg: '#16173a', text: '#6366f1' },
  'Paused':        { bg: '#1a1400', text: '#f59e0b' },
  'Brainstorming': { bg: '#1a1400', text: '#f59e0b' },
  'Drafting':      { bg: '#16173a', text: '#6366f1' },
  'Revising':      { bg: '#001a18', text: '#14b8a6' },
  'Final':         { bg: '#0a1a0a', text: '#22c55e' },
  'Planning':      { bg: '#1a1400', text: '#f59e0b' },
  'On Hold':       { bg: '#111',    text: '#6b7280' },
  'Todo':          { bg: '#111',    text: '#6b7280' },
};

export const HUBS = [
  { id: 'academic', label: 'Academic',  icon: '🎓', color: '#6366f1' },
  { id: 'college',  label: 'College',   icon: '🏛️', color: '#ec4899' },
  { id: 'life',     label: 'Life',      icon: '🌱', color: '#22c55e' },
  { id: 'mission',  label: 'Mission',   icon: '🚀', color: '#f97316' },
  { id: 'tools',    label: 'Tools',     icon: '⚡', color: '#14b8a6' },
];

export const NAV_SECTIONS = {
  academic: [
    { id: 'dashboard',   label: 'Dashboard',   icon: '⚡' },
    { id: 'schedule',    label: 'Schedule',    icon: '📅' },
    { id: 'assignments', label: 'Assignments',  icon: '📄' },
    { id: 'exams',       label: 'Exams',        icon: '📜' },
    { id: 'classes',     label: 'Classes',      icon: '📚' },
    { id: 'notes',       label: 'Notes',        icon: '📔' },
    { id: 'flashcards',  label: 'Flashcards',   icon: '🃏' },
    { id: 'study',       label: 'Study Room',   icon: '🎶' },
  ],
  college: [
    { id: 'colleges',     label: 'Colleges',     icon: '🏛️' },
    { id: 'essays',       label: 'Essays',       icon: '✍️' },
    { id: 'scores',       label: 'Scores',       icon: '📈' },
    { id: 'awards',       label: 'Awards',       icon: '🏆' },
    { id: 'activities',   label: 'Activities',   icon: '⭐' },
    { id: 'scholarships', label: 'Scholarships', icon: '💵' },
    { id: 'stanford',     label: 'Stanford Prep',icon: '🔴' },
  ],
  life: [
    { id: 'habits',   label: 'Habits',   icon: '🔥' },
    { id: 'goals',    label: 'Goals',    icon: '🎯' },
    { id: 'skills',   label: 'Skills',   icon: '🎨' },
    { id: 'books',    label: 'Books',    icon: '📖' },
    { id: 'spending', label: 'Spending', icon: '💳' },
    { id: 'journal',  label: 'Journal',  icon: '📓' },
  ],
  mission: [
    { id: 'mission',   label: 'Mission Control', icon: '🚀' },
    { id: 'projects',  label: 'Projects',        icon: '💻' },
  ],
  tools: [
    { id: 'calendar',  label: 'Calendar',  icon: '📅' },
    { id: 'analytics', label: 'Analytics', icon: '📊' },
    { id: 'search',    label: 'Search',    icon: '🔍' },
  ],
};

export const STANFORD_CHECKLIST = {
  9: {
    'Academic Rigor': [
      'Enroll in the most rigorous courses available to you',
      'Establish strong study habits and a consistent routine early',
      'Explore a wide range of subjects before specializing',
      'Seek help immediately if struggling — do not wait',
      'Aim for top grades in every course you take',
    ],
    'Extracurricular Foundation': [
      'Try multiple activities to discover genuine interests',
      'Pursue activities you are truly passionate about, not just for college',
      'Look for ways to contribute and lead, even at entry level',
      'Document your involvement and achievements from day one',
    ],
    'Planning & Awareness': [
      "Learn what Stanford values: intellectual vitality, demonstrated impact, authentic voice",
      'Start a brag sheet and achievement log now',
      'Understand the difference between weighted and unweighted GPA',
      'Research Stanford\'s financial aid: they meet 100% of demonstrated need',
    ],
  },
  10: {
    'Academic Rigor': [
      'Begin taking AP or IB courses where appropriate',
      'Develop a deep interest in at least one subject area',
      'Consider summer academic programs (RSI, PRIMES, Stanford OHS)',
      'Start independent reading in your areas of interest',
    ],
    'Testing': [
      'Take the PSAT in October — this is the qualifying exam for National Merit',
      'Begin light SAT/ACT preparation',
      'Take SAT Subject Tests in strong subject areas (if still offered)',
    ],
    'Extracurricular Development': [
      'Increase commitment to 1–2 core activities you love',
      'Begin seeking leadership roles or create your own initiative',
      'Start independent research, projects, or community impact work',
    ],
    'College Planning': [
      'Create a four-year course plan',
      'Research financial aid processes and FAFSA/CSS Profile',
      'Visit college campuses — in person or virtually',
      'Begin learning about Stanford\'s academic programs and research',
    ],
  },
  11: {
    'Academic Excellence': [
      'Take the most rigorous course load reasonable for your situation',
      'Junior year grades are most heavily weighted — maximize performance',
      'Pursue independent study, research, or mentorship in your spike area',
      'Maintain strong grades — this is the most important academic year',
    ],
    'Testing': [
      'Take the SAT or ACT — aim for first attempt by March',
      'Target 1500+ SAT or 34+ ACT for Stanford\'s range',
      'Take AP exams in May — aim for 4s and 5s',
      'Retake tests if needed; focus on highest single sitting score',
    ],
    'Extracurricular Peak': [
      'Reach leadership positions in key activities',
      'Demonstrate measurable impact, not just participation',
      'Enter competitions, submit work for publication, seek external recognition',
      'Develop a clear personal narrative: what do you uniquely contribute?',
    ],
    'College Research': [
      'Build your initial college list (10–15 schools across tiers)',
      'Visit schools — in person or virtually',
      'Research Stanford-specific programs, professors, labs, and communities',
      'Request teacher recommendations — choose teachers who know you deeply',
      'Provide recommenders with your brag sheet and personal context',
    ],
    'Essays': [
      'Brainstorm Common App essay topics over the school year',
      'Read and study Stanford\'s specific essay prompts carefully',
      'Draft your main Common App essay over the summer before 12th grade',
      "Stanford asks: 'What is meaningful to you and why?' — start reflecting now",
    ],
  },
  12: {
    'Critical Deadlines': [
      'Stanford Restrictive Early Action deadline: November 1',
      'Regular Decision deadline: January 2',
      'CSS Profile + FAFSA: submit as early as October 1',
      'Submit ALL materials at least one week before deadlines',
      'Confirm all recommendation letters are submitted on time',
    ],
    'Essays & Application': [
      'Finalize Common App personal statement',
      'Complete all Stanford short answer and essay prompts',
      'Have multiple trusted readers review every essay',
      'Essays must reveal your authentic voice — not what you think they want',
      'Avoid generic themes: be specific, personal, and intellectually alive',
      'Show intellectual curiosity and depth in your writing',
    ],
    'Academic Finish': [
      'Do NOT senioritis — Stanford can and does rescind offers for grade drops',
      'Take the most rigorous senior schedule available',
      'Complete final AP or IB assessments',
    ],
    'Recommendations': [
      'Confirm counselor recommendation is complete',
      'Follow up politely with teacher recommenders',
      'Submit any optional additional materials thoughtfully',
    ],
    'Financial Aid': [
      'Stanford meets 100% of demonstrated financial need — no loans in aid packages',
      'Complete FAFSA after October 1',
      'Complete CSS Profile (required by Stanford)',
      'Students from families earning under $75K: free tuition',
      'Students from families earning under $150K: minimal cost',
    ],
  },
};

export const SM2_DEFAULTS = {
  ease_factor: 2.5,
  interval_days: 1,
  review_count: 0,
};
