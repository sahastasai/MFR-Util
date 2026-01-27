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
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  headerSeal: {
    position: 'absolute',
    left: 0,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'Times-Roman',
    textAlign: 'center',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontFamily: 'Times-Roman',
    textAlign: 'center',
    letterSpacing: 1.5,
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
    marginLeft: 'auto',  // Push to the right
    marginRight: 0,
    width: 'auto',       // Only take as much width as needed
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