import { createServerFn } from '@tanstack/react-start'
import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'

export type LocalizedString = {
  es: string
  en: string
}
// Define the shape of your parsed data
export type Project = {
  slug: string
  date: string
  goTo: string
  img0: string
  img1: string
  img2: string
  img3: string
  img4: string
  img5: string

  tags: LocalizedString
  title: LocalizedString
  shortDescription: LocalizedString
  content: LocalizedString
  leyendaBoton: LocalizedString
}

export type Experience = {
  slug: string

  empresa: string
  location: string
  dateStart: LocalizedString
  dateEnd: LocalizedString
  title: LocalizedString
  tag1: LocalizedString
  tag2: LocalizedString
  tag3: LocalizedString
  content: LocalizedString
}

export type Studies = {
  slug: string
  institution: string
  location: string
  date: LocalizedString
  degree: LocalizedString
}

export const getExperience = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Experience[]> => {
    // 1. Define the path to your content folder
    const experienceDir = path.join(process.cwd(), 'content', 'experience')

    // 2. Read all files in the directory
    const filenames = await fs.readdir(experienceDir)

    // 3. Loop through files, read content, and parse frontmatter
    const experience = await Promise.all(
      filenames.map(async (filename) => {
        const filePath = path.join(experienceDir, filename)
        const fileContents = await fs.readFile(filePath, 'utf8')

        // Parse the frontmatter and the body
        const { data } = matter(fileContents)

        return {
          slug: filename.replace(/\.md$/, ''), // Remove .md for the URL

          empresa: data.empresa,
          location: data.location,

          dateStart: { es: data.dateStart.es, en: data.dateStart.en },
          dateEnd: { es: data.dateEnd.es, en: data.dateEnd.en },
          title: { es: data.title.es, en: data.title.en },
          tag1: { es: data.tag1.es, en: data.tag1.en },
          tag2: { es: data.tag2.es, en: data.tag2.en },
          tag3: { es: data.tag3.es, en: data.tag3.en },
          content: { es: data.content.es, en: data.content.en },
        }
      }),
    )

    // Optional: Sort by date descending
    return experience
  },
)

export const getEducation = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Studies[]> => {
    // 1. Define the path to your content folder
    const studiesDir = path.join(process.cwd(), 'content', 'studies')

    // 2. Read all files in the directory
    const filenames = await fs.readdir(studiesDir)

    // 3. Loop through files, read content, and parse frontmatter
    const study = await Promise.all(
      filenames.map(async (filename) => {
        const filePath = path.join(studiesDir, filename)
        const fileContents = await fs.readFile(filePath, 'utf8')

        // Parse the frontmatter and the body
        const { data } = matter(fileContents)

        return {
          slug: filename.replace(/\.md$/, ''), // Remove .md for the URL
          institution: data.institution,
          location: data.location,
          date: { es: data.date.es, en: data.date.en },
          degree: { es: data.degree.es, en: data.degree.en },
        }
      }),
    )

    // Optional: Sort by date descending
    return study
  },
)

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

            empresa: data.empresa,
            location: data.location,
            dateStart: { es: data.dateStart.es, en: data.dateStart.en },
            dateEnd: { es: data.dateEnd.es, en: data.dateEnd.en },
            title: { es: data.title.es, en: data.title.en },
            tag1: { es: data.tag1.es, en: data.tag1.en },
            tag2: { es: data.tag2.es, en: data.tag2.en },
            tag3: { es: data.tag3.es, en: data.tag3.en },
            content: { es: data.content.es, en: data.content.en },
          }
        }),
      )

      // 4. Sort by startDate descending (newest first)

      // 5. Return the single most recent experience
      return experiences[0]
    } catch (error) {
      console.error('Failed to fetch the latest experience:', error)
      return null
    }
  })

export const getProjects = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Project[]> => {
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
        const { data } = matter(fileContents)

        return {
          slug: filename.replace(/\.md$/, ''), // Remove .md for the URL
          date: data.date,
          goTo: data.goTo,
          img0: data.img0,
          img1: data.img1,
          img2: data.img2,
          img3: data.img3,
          img4: data.img4,
          img5: data.img5,

          tags: { es: data.tags.es, en: data.tags.en },
          title: { es: data.title.es, en: data.title.en },
          shortDescription: {
            es: data.shortDescription.es,
            en: data.shortDescription.en,
          },
          content: { es: data.content.es, en: data.content.en },
          leyendaBoton: { es: data.leyendaBoton.es, en: data.leyendaBoton.en },
        }
      }),
    )

    // Optional: Sort by date descending
    return projects.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
  },
)
