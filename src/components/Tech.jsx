import React from "react";
import styles from "../css/Tech.module.css";

const tools = [
  { name: "Python", detail: "Analysis · services · systems" },
  { name: "JavaScript", detail: "Interfaces · tooling" },
  { name: "React", detail: "Products · visualization" },
  { name: "GraphQL", detail: "APIs · data products" },
  { name: "C++", detail: "Performance · infrastructure" },
  { name: "Data systems", detail: "MySQL · RocksDB" },
];

function Tech() {
  return (
    <div className={styles.technology}>
      <p className="eyebrow">Working set</p>
      <h2 className={styles.title}>
        Tools for<br /><span>making.</span>
      </h2>
      <div className={styles.grid}>
        {tools.map((tool, index) => (
          <article className={styles.tool} key={tool.name}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")} / 06</span>
            <div>
              <h3>{tool.name}</h3>
              <p>{tool.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default Tech;
