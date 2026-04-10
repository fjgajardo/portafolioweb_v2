import * as m from '../../paraglide/messages'

export const ContactInfo = () => {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <p className="font-mono text-primary label-large">
          {m.contact_info_email()}
        </p>
        <h1 className="display-medium font-display text-on-surface">
          fjgajardo@uc.cl
        </h1>
      </div>

      <div className="flex flex-row gap-10">
        <div>
          <p className="font-mono text-primary label-medium">
            {m.contact_info_phone()}
          </p>
          <h1 className="headline-medium font-display text-on-surface">
            +56977092131
          </h1>
        </div>
        <div>
          <p className="font-mono text-primary label-medium">
            {m.contact_info_linkedin()}
          </p>
          <a
            href="https://www.linkedin.com/in/fernando-gajardo/"
            className="headline-medium font-display text-on-surface"
          >
            Perfil de LinkedIn
          </a>
        </div>
      </div>
    </div>
  )
}
