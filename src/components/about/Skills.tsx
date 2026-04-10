import React from 'react'
import skillsData from '../../../content/data/skills.json'

export const Skills = () => {
  return (
    <div>
      {/* 2. Use Object.entries to map over the keys and values */}
      {Object.entries(skillsData).map(([category, skillsArray]) => (
        <div key={category} className="mb-4">
          {/* Render the Category Name (e.g., "Development", "Design") */}
          <h3 className="font-display label-large text-on-surface-variant">
            {category}
          </h3>

          <ul className="flex gap-2 flex-wrap">
            {/* 3. Map over the specific skills inside that category */}
            {skillsArray.map((skill, index) => (
              <li
                key={index}
                className="bg-surface-container-highest text-on-surface font-mono label-medium px-3 py-1"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
