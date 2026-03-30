import { createServerFn } from '@tanstack/react-start'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

// Define the shape of your parsed data
export type Project = {
  slug: string;
  title: string;
  tech: string;
  startDate: string;
  endDate: string;
  content: string;
}



export type Experience = {
    slug: string;
    jobTitle: string;
    organization: string;
    startDate: string;
    endDate: string;
    bulletPoint: string;
}

export const getExperience = createServerFn({ method: 'GET' })
  .handler(async (): Promise<Experience[]> => {
    // 1. Define the path to your content folder
    const projectsDir = path.join(process.cwd(), 'content', 'experience')
    
    // 2. Read all files in the directory
    const filenames = await fs.readdir(projectsDir)
    
    // 3. Loop through files, read content, and parse frontmatter
    const projects = await Promise.all(
      filenames.map(async (filename) => {
        const filePath = path.join(projectsDir, filename)
        const fileContents = await fs.readFile(filePath, 'utf8')
        
        // Parse the frontmatter and the body
        const { data } = matter(fileContents)
        
        return {
          slug: filename.replace(/\.md$/, ''), // Remove .md for the URL
          jobTitle: data.jobTitle,
          organization: data.organization,
          startDate: data.startDate,
          endDate: data.endDate,
          bulletPoint: data.bulletPoint,

        }
      })
    )
    
    // Optional: Sort by date descending
    return projects.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  })


  export const getLastExperience = createServerFn({ method: 'GET' })
  // 1. Updated return type to a single Experience or null
  .handler(async (): Promise<Experience | null> => { 
    const experienceDir = path.join(process.cwd(), 'content', 'experience')
    
    try {
      // 2. Read all files in the directory
      const filenames = await fs.readdir(experienceDir)
      
      // 3. Safety check: if no files exist, return null
      if (filenames.length === 0) return null
      
      const experiences = await Promise.all(
        filenames.map(async (filename) => {
          const filePath = path.join(experienceDir, filename)
          const fileContents = await fs.readFile(filePath, 'utf8')
          
          // Parse the frontmatter
          const { data } = matter(fileContents)
          
          return {
            slug: filename.replace(/\.md$/, ''), // Remove .md for the URL
            jobTitle: data.jobTitle,
            organization: data.organization,
            startDate: data.startDate,
            endDate: data.endDate,
            bulletPoint: data.bulletPoint,
          }
        })
      )
      
      // 4. Sort by startDate descending (newest first)
      experiences.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      
      // 5. Return the single most recent experience
      return experiences[0]

    } catch (error) {
      console.error("Failed to fetch the latest experience:", error)
      return null
    }
  })

export const getProjects = createServerFn({ method: 'GET' })
  .handler(async (): Promise<Project[]> => {
    // 1. Define the path to your content folder
    const projectsDir = path.join(process.cwd(), 'content', 'projects')
    
    // 2. Read all files in the directory
    const filenames = await fs.readdir(projectsDir)
    
    // 3. Loop through files, read content, and parse frontmatter
    const projects = await Promise.all(
      filenames.map(async (filename) => {
        const filePath = path.join(projectsDir, filename)
        const fileContents = await fs.readFile(filePath, 'utf8')
        
        // Parse the frontmatter and the body
        const { data, content } = matter(fileContents)
        
        return {
          slug: filename.replace(/\.md$/, ''), // Remove .md for the URL
          title: data.title,
          tech: data.tech,
          startDate: data.startDate,
          endDate: data.endDate,
          content: content,
        }
      })
    )
    
    // Optional: Sort by date descending
    return projects.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
  })