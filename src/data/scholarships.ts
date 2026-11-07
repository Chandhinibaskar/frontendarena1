import type { Level, Scholarship } from '../types'

export const LEVELS: Level[] = ['Undergraduate', 'Postgraduate', 'PhD']
export const FIELDS = ['Any', 'Engineering', 'Medicine', 'Arts', 'Business', 'Science']
export const COUNTRIES = ['Global', 'USA', 'UK', 'India', 'Germany', 'Canada', 'Australia']

const BASE_DOCS = ['Academic transcripts', 'Government ID', 'Statement of purpose']
const STEPS = ['Create an account on the provider portal', 'Upload the required documents', 'Write your essay or statement', 'Review and submit before the deadline']

// `days` = days from today until the deadline (so the demo data is always fresh)
const S = (id: string, name: string, provider: string, country: string, level: Level, field: string,
  amount: number, days: number, minGpa: number, maxIncome: number, description: string, extra: string[] = []): Scholarship =>
  ({ id, name, provider, country, level, field, amount, days, minGpa, maxIncome, description, docs: [...BASE_DOCS, ...extra], steps: STEPS })

export const SCHOLARSHIPS: Scholarship[] = [
  S('s1', 'Aurora Global Excellence', 'Aurora Foundation', 'Global', 'Postgraduate', 'Any', 25000, 4, 3.5, 999999, 'Full-tuition support for high-achieving graduate students anywhere in the world.', ['Two recommendation letters']),
  S('s2', 'Bright Minds STEM Grant', 'Nova Trust', 'USA', 'Undergraduate', 'Engineering', 12000, 9, 3.0, 80000, 'Funds first- and second-year engineering students who show strong problem-solving skills.', ['Project portfolio']),
  S('s3', 'Thames Scholars Award', 'Thames Education Council', 'UK', 'Postgraduate', 'Business', 18000, 15, 3.3, 999999, 'Supports one-year business master’s programmes at partner UK universities.', ['CV', 'Admission letter']),
  S('s4', 'Rising India Merit Scholarship', 'Bharat Learning Fund', 'India', 'Undergraduate', 'Any', 3000, 6, 3.0, 40000, 'Merit-cum-means support for undergraduates studying in India.', ['Income certificate']),
  S('s5', 'MedCare Future Doctors', 'HealthBridge Org', 'Global', 'Postgraduate', 'Medicine', 20000, 28, 3.4, 70000, 'For postgraduate medical students committed to community healthcare.', ['Clinical experience letter']),
  S('s6', 'Creative Canvas Fellowship', 'Artisan Collective', 'Germany', 'Undergraduate', 'Arts', 8000, 21, 2.8, 60000, 'Helps emerging artists and designers study at German art academies.', ['Portfolio (10 works)']),
  S('s7', 'Maple Leaf Research Grant', 'Northern Lights Fund', 'Canada', 'PhD', 'Science', 30000, 35, 3.6, 999999, 'Three-year stipend for doctoral research in natural sciences.', ['Research proposal', 'Supervisor letter']),
  S('s8', 'Southern Cross Opportunity Award', 'Coral Education Trust', 'Australia', 'Undergraduate', 'Any', 9000, 12, 3.0, 50000, 'Open to any field; focus on students from low-income households.', ['Income certificate']),
  S('s9', 'First Gen Scholars', 'OpenDoor Alliance', 'USA', 'Undergraduate', 'Any', 6000, 3, 2.5, 35000, 'For first-generation college students.', ['Family declaration']),
  S('s10', 'Women in Tech Scholarship', 'CodeBloom', 'Global', 'Undergraduate', 'Engineering', 7500, 18, 3.0, 90000, 'Encourages women pursuing computing and engineering degrees.', ['Code sample']),
  S('s11', 'Green Future PhD Fellowship', 'Terra Institute', 'Germany', 'PhD', 'Science', 28000, 45, 3.5, 999999, 'Climate and sustainability research fellowship.', ['Research proposal']),
  S('s12', 'Global Business Leaders MBA Award', 'Summit Capital Foundation', 'USA', 'Postgraduate', 'Business', 22000, 40, 3.4, 999999, 'Partial MBA funding for future leaders.', ['CV', 'Leadership essay']),
  S('s13', 'Southern Scholars Aid', 'Kaveri Trust', 'India', 'Postgraduate', 'Any', 4000, 24, 3.0, 30000, 'Needs-based aid for postgraduate students in India.', ['Income certificate']),
  S('s14', 'Digital Storytellers Grant', 'Pixel Press', 'UK', 'Undergraduate', 'Arts', 5000, 30, 2.7, 70000, 'For students in film, animation and digital media.', ['Showreel link']),
  S('s15', 'Rural Health Pathways', 'Wellspring Fund', 'India', 'Undergraduate', 'Medicine', 5500, 11, 3.0, 25000, 'Supports medical students who plan to serve rural communities.', ['Income certificate', 'Community service letter']),
  S('s16', 'Innovators Seed Scholarship', 'Launchpad Labs', 'Canada', 'Postgraduate', 'Engineering', 15000, 60, 3.3, 100000, 'For master’s students building a startup prototype.', ['Project pitch']),
]
