"use client";

import { SectionHead } from "./SectionHead";

const offline = [
  {
    name: "diy",
    title: "Home renovation",
    body: "I like getting my hands dirty: routing Ethernet through multiple rooms, replacing windows, and redoing bathrooms and kitchen cabinets.",
  },
  {
    name: "cars",
    title: "One-man auto shop",
    body: "I fix and maintain cars myself, for the mechanical puzzle as much as the money it saves.",
  },
  {
    name: "home lab & av",
    title: "Home lab and theater",
    body: "A home server, structured Ethernet, routing and wireless, plus a nine-channel theater I designed and calibrated. I also build and repair PCs and chase down display, projector and connectivity faults.",
  },
];

export function AboutMe() {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead
          index="03"
          name="about"
          id="about-title"
          title={<>I build it, and I keep it running.</>}
        />

        <div className="rows">
          <div className="split">
            <p className="label">engineering</p>
            <div>
              <p className="prose">
                I like software that feels effortless to use and sits on plain,
                readable code. Most of my work has been React, Next.js and
                TypeScript on the front, Node.js, Postgres and AWS behind it,
                and a lot of making slow things fast.
              </p>
            </div>
          </div>

          <div className="split">
            <p className="label">support &amp; consulting</p>
            <div>
              <p className="prose">
                I&apos;m often the first call when something technical fails:
                apps, accounts, laptops or networks. I diagnose under time
                pressure, write docs people can follow, and train non-technical
                colleagues so they can keep going without me.
              </p>
              <p className="prose">
                As a consultant I bring the same approach to clients:
                troubleshooting analytics, tag management and CRM integrations,
                keeping GDPR/CCPA requirements in check, and setting up their team
                to update the site on their own.
              </p>
            </div>
          </div>
        </div>

        <h3 className="label" style={{ margin: "56px 0 0", paddingBottom: 12 }}>
          off the clock
        </h3>
        <ul className="rows">
          {offline.map((item) => (
            <li key={item.name} className="split">
              <p className="h3" style={{ fontSize: "1.125rem" }}>{item.title}</p>
              <p className="prose small">{item.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
