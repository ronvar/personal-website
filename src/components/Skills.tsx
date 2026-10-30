"use client";

import { SectionHead } from "./SectionHead";
import { skillCategories } from "@/data/skills";

export function Skills() {
  return (
    <section
      id="skills"
      className="section band"
      aria-labelledby="skills-title"
    >
      <div className="wrap">
        <SectionHead index="04" name="skills" id="skills-title" title="Tools I reach for" />

        <dl className="rows">
          {skillCategories.map((category) => (
            <div key={category.title} className="split" style={{ padding: "20px 0" }}>
              <dt className="label">{category.title}</dt>
              <dd className="prose" style={{ color: "var(--ink)" }}>
                {category.skills.join(", ")}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
