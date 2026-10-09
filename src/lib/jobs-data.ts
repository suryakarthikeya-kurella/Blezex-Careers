import type { Job } from './types'

/** Built-in listings used until Supabase is connected. Keep in sync with supabase/schema.sql. */
export const fallbackJobs: Job[] = [
  {
    "id": "fallback-1",
    "title": "Business Development Associate",
    "department": "Sales & Business Development",
    "employment_type": "Full-time",
    "location": "Remote / Hybrid",
    "duration": "Permanent role",
    "stipend": "Performance-linked incentives; details shared at interview",
    "status": "active",
    "description": "Drive new business for BlezeX by identifying prospects, pitching our AI, web and automation solutions, and building long-term client relationships.",
    "responsibilities": [
      "Identify and research potential clients across target industries",
      "Reach out through calls, email and LinkedIn to start conversations",
      "Present BlezeX services and understand each client's needs",
      "Maintain the lead pipeline and follow up consistently",
      "Work with the delivery team to prepare proposals"
    ],
    "requirements": [
      "Strong spoken and written communication",
      "Interest in sales, technology and business growth",
      "Comfortable working towards targets",
      "Freshers with the right attitude are welcome"
    ],
    "qualification": [
      "BBA, B.Com, BCA, B.Tech, BA, or any relevant bachelor's degree.",
      "Fresh graduates are eligible.",
      "Students in their final year may also apply."
    ],
    "benefits": [
      "Direct mentorship from company leadership",
      "Performance-linked incentives",
      "Real client and industry exposure",
      "Clear career growth path"
    ],
    "created_at": "2026-10-01T00:00:00.000Z"
  },
  {
    "id": "fallback-2",
    "title": "Business Growth Consultant",
    "department": "Business Growth",
    "employment_type": "Full-time",
    "location": "Remote / Hybrid",
    "duration": "Permanent role",
    "stipend": "Performance-linked incentives; details shared at interview",
    "status": "active",
    "description": "Work with clients to find growth opportunities and recommend practical digital, automation and AI-led solutions that deliver measurable results.",
    "responsibilities": [
      "Understand client businesses, goals and challenges",
      "Analyse processes and recommend suitable solutions",
      "Prepare proposals, presentations and growth plans",
      "Coordinate between clients and the delivery team",
      "Track results and report on measurable impact"
    ],
    "requirements": [
      "Analytical thinking and problem solving",
      "Clear communication and presentation skills",
      "Understanding of business basics such as sales, marketing or operations",
      "Curiosity about AI, automation and digital tools"
    ],
    "qualification": [
      "BBA, B.Com, BCA, B.Tech, MBA, or any relevant degree.",
      "Open to final-year students, recent graduates, and eligible postgraduate students."
    ],
    "benefits": [
      "Work closely with company leadership",
      "Hands-on consulting exposure",
      "Learning across AI, web and automation",
      "Growth into senior consulting roles"
    ],
    "created_at": "2026-10-01T00:00:00.000Z"
  },
  {
    "id": "fallback-3",
    "title": "Digital Marketing Intern",
    "department": "Marketing",
    "employment_type": "Internship",
    "location": "Remote",
    "duration": "3 months",
    "stipend": "Performance-based stipend",
    "status": "active",
    "description": "Support BlezeX marketing by creating content, running social campaigns and learning how digital growth works in a real technology company.",
    "responsibilities": [
      "Create and schedule social media posts",
      "Support campaigns and track performance",
      "Research keywords and basic SEO opportunities",
      "Design simple creatives using tools such as Canva",
      "Prepare weekly reports on reach and engagement"
    ],
    "requirements": [
      "Good writing skills and creativity",
      "Familiarity with social media platforms",
      "Basic Canva or similar design skills",
      "Willingness to learn and take feedback"
    ],
    "qualification": [
      "BBA, B.Com, BCA, BA, B.Tech, or any relevant degree.",
      "Students specializing in Marketing, Communications, or Digital Media are preferred.",
      "Open to students and fresh graduates."
    ],
    "benefits": [
      "Internship certificate on completion",
      "Mentorship from the marketing lead",
      "Portfolio-ready campaign work",
      "PPO consideration for strong performers"
    ],
    "created_at": "2026-10-01T00:00:00.000Z"
  },
  {
    "id": "fallback-4",
    "title": "Campus Representative",
    "department": "Campus Outreach",
    "employment_type": "Part-time",
    "location": "On campus (your college)",
    "duration": "3 months",
    "stipend": "Performance-based incentives",
    "status": "active",
    "description": "Represent BlezeX at your college, spread the word about our programs and opportunities, and build a community of motivated students.",
    "responsibilities": [
      "Promote BlezeX programs and openings on campus",
      "Connect with student clubs and communities",
      "Help organise sessions and awareness activities",
      "Share student feedback with the BlezeX team",
      "Report progress regularly"
    ],
    "requirements": [
      "Currently enrolled student",
      "Active in campus communities or clubs",
      "Confident communicator",
      "A few hours per week to commit"
    ],
    "qualification": [
      "Must be currently enrolled in a recognized college or university.",
      "Open to students pursuing B.Tech, BCA, BBA, B.Com, BA, MCA, MBA, or any other degree."
    ],
    "benefits": [
      "Certificate and recognition",
      "Leadership and networking experience",
      "Incentives linked to performance",
      "PPO consideration for top representatives"
    ],
    "created_at": "2026-10-01T00:00:00.000Z"
  },
  {
    "id": "fallback-5",
    "title": "AI Engineer Intern",
    "department": "Engineering (AI)",
    "employment_type": "Internship",
    "location": "Remote",
    "duration": "To be announced",
    "stipend": null,
    "status": "future",
    "description": "Build and test AI-powered solutions and automations for client projects alongside the BlezeX engineering team.",
    "responsibilities": [
      "Prototype AI features and automation workflows",
      "Work with APIs and language models",
      "Test and document solutions",
      "Support client project delivery"
    ],
    "requirements": [
      "Python or JavaScript basics",
      "Interest in AI and machine learning",
      "Problem-solving mindset",
      "Willingness to learn quickly"
    ],
    "qualification": [],
    "benefits": [
      "Work on real AI projects",
      "Mentorship from engineers",
      "Internship certificate",
      "PPO consideration"
    ],
    "created_at": "2026-10-01T00:00:00.000Z"
  },
  {
    "id": "fallback-6",
    "title": "Full Stack Developer Intern",
    "department": "Engineering",
    "employment_type": "Internship",
    "location": "Remote",
    "duration": "To be announced",
    "stipend": null,
    "status": "future",
    "description": "Help design, build and ship web applications for BlezeX and its clients across the front end and back end.",
    "responsibilities": [
      "Build responsive interfaces with React or Next.js",
      "Develop APIs and database integrations",
      "Fix bugs and improve performance",
      "Write clean, documented code"
    ],
    "requirements": [
      "HTML, CSS and JavaScript fundamentals",
      "Familiarity with React or a similar framework",
      "Basic understanding of databases",
      "Portfolio or GitHub projects preferred"
    ],
    "qualification": [],
    "benefits": [
      "Real client project experience",
      "Code reviews and mentorship",
      "Internship certificate",
      "PPO consideration"
    ],
    "created_at": "2026-10-01T00:00:00.000Z"
  }
]
