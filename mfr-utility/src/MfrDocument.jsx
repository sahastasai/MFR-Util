// src/MfrDocument.jsx
import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { styles } from './mfrStyles';

const sealSrc = '/dod_seal.png';

const MfrHeader = ({ unit, date, recipient, subject }) => (
  <View style={{ position: 'relative' }}>
    <View style={styles.headerContainer}>
      <View style={styles.headerSeal}>
        <Image src={sealSrc} style={{ width: 80, height: 80 }} />
      </View>
      <View>
        <Text style={styles.headerTitle}>Department of the Air Force</Text>
        <Text style={styles.headerSubtitle}>Air Education and Training Command</Text>
      </View>
    </View>
    <View style={styles.dateLine}>
      <Text>{date}</Text>
    </View>
    <View style={styles.memoLine}>
      <Text style={styles.memoLabel}>MEMORANDUM FOR</Text>
      <Text style={styles.memoContent}>{recipient}</Text>
    </View>
    <View style={styles.memoLine}>
      <Text style={styles.memoLabel}>FROM:</Text>
      <Text style={styles.memoContent}>{unit} / CC</Text>
    </View>
    <View style={styles.memoLine}>
      <Text style={styles.memoLabel}>SUBJECT:</Text>
      <Text style={styles.memoContent}>{subject}</Text>
    </View>
  </View>
);

const MfrParagraph = ({ number, text, level = 0 }) => (
  <View style={[styles.paragraphContainer, { marginLeft: level * 20 }]}>
    <Text style={styles.bulletPoint}>{number}</Text>
    <Text style={styles.paragraphText}>{text}</Text>
  </View>
);

const MfrSignature = ({ firstName, lastName, middleInitial, rank, branch, title }) => {
  // Generate initials: First initial, Middle initial, Last initial
  const firstInitial = firstName ? firstName.charAt(0) : 'X';
  const middle = middleInitial || 'X';
  const lastInitial = lastName ? lastName.charAt(0) : 'X';
  const initials = `${firstInitial}${middle}${lastInitial}`.toUpperCase();
  
  // Format the signature line: FIRSTNAME LASTNAME, RANK/MIDDLE, BRANCH
  const signatureLine = `${firstName} ${lastName}, ${rank}/${middleInitial}, ${branch}`;
  
  // Today's date in format: DD MMM YY (e.g., 27 Jan 26)
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = today.toLocaleString('en-US', { month: 'short' });
  const year = String(today.getFullYear()).slice(-2);
  const dateStr = `${day} ${month} ${year}`;
  
  const signedLine = `//​${initials}/Signed/${dateStr}//`;
  
  return (
    <View style={styles.signatureBlock} minPresenceAhead={100} wrap={false}>
      <Text style={{ marginBottom: 36 }}>{"\n\n\n"}</Text>
      <Text style={{ fontWeight: 'bold' }}>{signedLine}</Text>
      <Text style={{ fontWeight: 'bold' }}>{signatureLine}</Text>
      {title && <Text>{title}</Text>}
    </View>
  );
};

// --- Main Document Component ---

export const MfrDocument = ({ data }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      
      <MfrHeader 
        unit={data.unit}
        date={data.date}
        recipient={data.recipient}
        subject={data.subject}
      />

      <View>
        {data.paragraphs.map((p, i) => (
          <MfrParagraph key={i} number={p.number} text={p.text} level={p.level} />
        ))}
      </View>

      <MfrSignature 
        firstName={data.authorFirstName}
        lastName={data.authorLastName}
        middleInitial={data.authorMiddleInitial}
        rank={data.authorRank}
        branch={data.authorBranch}
        title={data.authorTitle}
      />

      <Text 
        style={styles.pageNumber} 
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} 
        fixed 
      />
      
    </Page>
  </Document>
);