// src/MfrDocument.jsx
import React from 'react';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import { styles } from './mfrStyles';

// --- Sub-Components ---

const MfrHeader = ({ unit, date, recipient, subject }) => (
  <View>
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Department of the Air Force</Text>
      <Text style={styles.headerUnit}>{unit}</Text>
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

const MfrSignature = ({ name, rank, title }) => (
  <View style={styles.signatureBlock} minPresenceAhead={100} wrap={false}>
    <Text style={{ marginBottom: 36 }}>{"\n\n\n"}</Text>
    <Text style={{ fontWeight: 'bold' }}>{name}, {rank}, USAF</Text>
    <Text>{title}</Text>
  </View>
);

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
        name={data.authorName}
        rank={data.authorRank}
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