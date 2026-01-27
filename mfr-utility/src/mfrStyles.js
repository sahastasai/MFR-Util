// src/mfrStyles.js
import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    paddingTop: 72,      // 1.0 inch
    paddingBottom: 72,   // 1.0 inch
    paddingLeft: 72,     // 1.0 inch
    paddingRight: 72,    // 1.0 inch
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 1.15,
  },
  headerContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  headerUnit: {
    fontSize: 12,
    marginTop: 2,
  },
  // 1.75 in from top = 126pt. Page padding is 72pt.
  // We need 54pt more margin to hit 126pt.
  dateLine: {
    position: 'absolute',
    right: 0,
    top: 54, 
  },
  memoLine: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  memoLabel: {
    width: 140, // Fixed width for alignment
    fontWeight: 'bold',
  },
  memoContent: {
    flex: 1,
  },
  paragraphContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    textAlign: 'justify',
  },
  bulletPoint: {
    width: 35,
  },
  paragraphText: {
    flex: 1,
  },
  signatureBlock: {
    marginTop: 36,
    marginLeft: 280, // Offset to right
  },
  signatureText: {
    fontSize: 12,
    textTransform: 'uppercase',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 36,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  }
});