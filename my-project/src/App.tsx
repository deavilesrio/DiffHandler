import React, { useState } from "react";
import { diffWordsWithSpace } from "diff";
import './App.css';
interface AppProps {
  oldText: string;
  newText: string;
}

const App: React.FC<AppProps> = () => {
  const [oldText, setOldText] = useState('An audit report is a formal document issued by an independent auditor after examining an organizations financial statements and accounting records. Its primary purpose is to provide an objective assessment of whether the financial statements present a true and fair view of the entity’s financial position in accordance with generally accepted accounting principles (GAAP) or other relevant frameworks. The report is typically addressed to stakeholders such as shareholders, management, or regulatory bodies and serves as a critical tool for decision-making and ensuring financial transparency. A standard audit report includes several key sections: the title, the addressee, the auditor’s opinion, the basis for opinion, and any other relevant sections such as key audit matters or emphasis of matter paragraphs. The most important part is the auditor’s opinion, which can be unqualified (clean), qualified, adverse, or a disclaimer of opinion. An unqualified opinion indicates that the financial statements are free of material misstatements, while other types signal varying degrees of concern or limitations in the audit process');
  const [newText, setNewText] = useState('An audit report is a formal document issued by an independent auditor after examining an organizations financial statements and accounting records. Its primary purpose is to provide an objective assessment of whether the financial statements present a true and fair view of the entity’s financial position in accordance with generally accepted accounting principles (GAAP) or other relevant frameworks. The report is typically addressed to stakeholders such as shareholders, management, or regulatory bodies and serves as a critical tool for decision-making and ensuring financial transparency. A standard audit report includes several key sections: the title, the addressee, the auditor’s opinion, the basis for opinion, and any other relevant sections such as key audit matters or emphasis of matter paragraphs. The most important part is the auditor’s opinion, which can be unqualified (clean), qualified, adverse, or a disclaimer of opinion. An unqualified opinion indicates that the financial statements are free of material misstatements, while other types signal varying degrees of concern or limitations in the audit process');
  // const diff = diffWordsWithSpace(oldText, newText);
  const rawDiff = diffWordsWithSpace(oldText, newText);

type DiffPart = {
  added?: boolean;
  removed?: boolean;
  value: string;
  count?: number;
};

type GroupedDiff = {
  type: "unchanged" | "replacement";
  removed?: string;
  added?: string;
  value?: string;
};

function groupReplacements(diff: DiffPart[]): GroupedDiff[] {
  const result: GroupedDiff[] = [];
  let i = 0;

  while (i < diff.length) {
    const part = diff[i];

    // Case: unchanged
    if (!part.added && !part.removed) {
      result.push({ type: "unchanged", value: part.value });
      i++;
      continue;
    }

    // Case: start of replacement
    if (part.removed) {
      let removedText = part.value;
      let addedText = "";
      i++;

      // scan ahead: collect interleaved added/removed and optional short unchanged parts
      while (i < diff.length) {
        const next = diff[i];

        if (next?.removed) {
          removedText += next.value;
        } else if (next?.added) {
          addedText += next.value;
        } else if (!next.added && !next.removed && next.value.trim().length <= 5) {
          // allow small unchanged fillers like " ", "the ", etc.
          removedText += next.value;
          addedText += next.value;
        } else {
          break;
        }

        i++;
      }

      result.push({
        type: "replacement",
        removed: removedText,
        added: addedText,
      });
    }

    // Case: stray added not paired with a removal
    else if (part.added) {
      result.push({
        type: "replacement",
        removed: "",
        added: part.value,
      });
      i++;
    }
  }

  return result;
}

  const diff = groupReplacements(rawDiff);
  console.log('rawdiff: ', rawDiff);
  console.log('diff: ', diff);
//   const getStyle = (part: typeof diff[number]) => {
//   if (part.added) return "diff-added";
//   if (part.removed) return "diff-removed";
//   if (/<.*?>/.test(part.value)) return "diff-format";
//   return "";
// };


  return (
   <>
    <h2>Paragraph Diff Viewer</h2>

    <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
    <textarea
    value={oldText}
    onChange={(e) => setOldText(e.target.value)}
    rows={6}
    cols={40}
    placeholder="Original paragraph"
    />
    <textarea
    value={newText}
    onChange={(e) => setNewText(e.target.value)}
    rows={6}
    cols={40}
    placeholder="Updated paragraph"
    />
    </div>
    <div className="whitespace-pre-wrap text-base">
      {diff.map((part, index) => {
  if (part.type === "unchanged") {
    return <span key={index}>{part.value}</span>;
  }

  return (
    <span key={index}>
      {part.removed && <span className="diff-removed">{part.removed}</span>}
      {part.added && <span className="diff-added">{part.added}</span>}
    </span>
  );
})}

{/* {diff.map((part, index) => {
  const style = getStyle(part);
  return part.value.split('\n').map((line, i, arr) => (
    <React.Fragment key={`${index}-${i}`}>
      <span className={line === '' ? 'empty-line-class' : style}>
        {line}
      </span>
      {i < arr.length - 1 && (
  <div
    className={`diff-break ${part.added ? 'bg-green-100' : part.removed ? 'bg-red-100' : ''}`}
    key={`break-${index}-${i}`}
  >
    &nbsp;
  </div>
)}

    </React.Fragment>
  ));
})} */}

    </div>
    </>
  );
};

export default App;
