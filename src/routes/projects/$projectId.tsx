import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { getProject } from '../../../lib/post'
import { getLocale } from '#/paraglide/runtime'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import * as m from '#/paraglide/messages'

export const Route = createFileRoute('/projects/$projectId')({
  loader: async ({ params }) => {
    const project = await getProject({ data: params.projectId })
    if (!project) {
      throw notFound()
    }
    return { project }
  },
  component: ProjectPage,
})

function ProjectPage() {
  const { project } = Route.useLoaderData()
  const lang = getLocale()

  return (
    <main className="min-h-screen pt-12 pb-12 px-6 md:px-12 max-w-5xl mx-auto flex flex-col gap-8">
      <Link
        to="/"
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors"
      >
        <ArrowLeft size={20} />
        {m.project_back_to_home()}
      </Link>

      <article className="flex flex-col gap-8 glass_effect p-6 md:p-10 ">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h1 className="display-medium font-display text-on-surface mb-2">
              {project.title[lang]}
            </h1>
            <p className="body-large text-on-surface-variant mb-4">
              {project.shortDescription[lang]}
            </p>
            {project.goTo && (
              <a
                href={project.goTo}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex w-fit items-center gap-2 px-4 py-2 border border-outline text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 font-mono label-medium uppercase tracking-wider "
              >
                <span>{project.leyendaBoton[lang]}</span>
                <ExternalLink
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            )}
          </div>
          <div className="text-secondary body-medium font-mono mt-2 bg-surface-container py-1 px-3 ">
            {project.date}
          </div>
        </div>

        {project.img0 && (
          <>
            <img
              src={project.img0}
              alt={project.title[lang]}
              className="w-full object-cover max-h-[600px] border border-outline-variant dark:hidden"
            />
            <img
              src={project.img0_dark || project.img0}
              alt={project.title[lang]}
              className="w-full object-cover max-h-[600px] border border-outline-variant hidden dark:block"
            />
          </>
        )}

        <div className="flex gap-2 flex-wrap">
          {project.tags[lang].split(',').map((tag: string) => (
            <span
              key={tag.trim()}
              className="px-3 py-1 bg-surface-container border border-outline-variant  text-sm text-on-surface-variant"
            >
              {tag.trim()}
            </span>
          ))}
        </div>

        <div className="body-medium text-on-surface lg:prose-lg max-w-none">
          <ReactMarkdown>{project.body}</ReactMarkdown>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {project.img1 && (
            <>
              <img
                src={project.img1}
                alt="Project detail 1"
                className="w-full object-cover border border-outline-variant dark:hidden"
              />
              <img
                src={project.img1_dark || project.img1}
                alt="Project detail 1 dark"
                className="w-full object-cover border border-outline-variant hidden dark:block"
              />
            </>
          )}
          {project.img2 && (
            <>
              <img
                src={project.img2}
                alt="Project detail 2"
                className="w-full object-cover border border-outline-variant dark:hidden"
              />
              <img
                src={project.img2_dark || project.img2}
                alt="Project detail 2 dark"
                className="w-full object-cover border border-outline-variant hidden dark:block"
              />
            </>
          )}
          {project.img3 && (
            <>
              <img
                src={project.img3}
                alt="Project detail 3"
                className="w-full object-cover border border-outline-variant dark:hidden"
              />
              <img
                src={project.img3_dark || project.img3}
                alt="Project detail 3 dark"
                className="w-full object-cover border border-outline-variant hidden dark:block"
              />
            </>
          )}
          {project.img4 && (
            <>
              <img
                src={project.img4}
                alt="Project detail 4"
                className="w-full object-cover border border-outline-variant dark:hidden"
              />
              <img
                src={project.img4_dark || project.img4}
                alt="Project detail 4 dark"
                className="w-full object-cover border border-outline-variant hidden dark:block"
              />
            </>
          )}
          {project.img5 && (
            <>
              <img
                src={project.img5}
                alt="Project detail 5"
                className="w-full object-cover border border-outline-variant dark:hidden"
              />
              <img
                src={project.img5_dark || project.img5}
                alt="Project detail 5 dark"
                className="w-full object-cover border border-outline-variant hidden dark:block"
              />
            </>
          )}
        </div>
      </article>
    </main>
  )
}
