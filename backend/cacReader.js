import { execSync } from 'child_process';

// For macOS: Check if OpenSC is installed and CAC reader is present
export async function readCACData() {
  try {
    console.log('Starting CAC detection...');
    
    // Step 1: Check if pkcs11-tool exists
    let pkcs11ToolPath = '';
    try {
      pkcs11ToolPath = execSync('which pkcs11-tool', { 
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();
      console.log('Found pkcs11-tool at:', pkcs11ToolPath);
    } catch (e) {
      console.log('pkcs11-tool not found in PATH');
      return buildErrorResponse('OpenSC not installed', 'Install with: brew install opensc');
    }

    if (!pkcs11ToolPath) {
      return buildErrorResponse('OpenSC not found', 'Install with: brew install opensc');
    }

    // Step 2: Try to list slots
    try {
      console.log('Checking for card readers...');
      const slots = execSync('pkcs11-tool --list-slots 2>&1', { 
        encoding: 'utf-8',
        maxBuffer: 10 * 1024 * 1024
      });
      
      console.log('Slots output:', slots.substring(0, 200));
      
      // Check if any slot has a card
      if (!slots.includes('Slot')) {
        return buildErrorResponse('No card readers found', 'Please ensure your card reader is connected');
      }

      // Check if a card is present in a slot
      const slotLines = slots.split('\n');
      let cardFound = false;
      
      for (const line of slotLines) {
        if (line.includes('Slot') && line.includes('token present')) {
          cardFound = true;
          console.log('Card detected:', line);
          break;
        }
      }

      if (!cardFound && slots.includes('token not present')) {
        return buildErrorResponse('No card inserted', 'Please insert your CAC into the reader');
      }

      // Step 3: Try to read certificates
      console.log('Reading certificates...');
      try {
        const certs = execSync('pkcs11-tool --list-objects --type cert 2>&1', {
          encoding: 'utf-8',
          maxBuffer: 10 * 1024 * 1024
        });
        
        console.log('Certificates found:', certs.substring(0, 300));
        
        // Parse certificate info
        const cardData = parsePKCS11Output(certs);
        
        if (cardData) {
          console.log('Successfully parsed CAC data:', cardData);
          return {
            success: true,
            data: cardData
          };
        }
      } catch (certErr) {
        console.log('Error reading certificates:', certErr.message);
      }

      // Card detected but couldn't read certs
      return buildErrorResponse('Could not read CAC data', 'Check that card reader drivers are installed');

    } catch (slotErr) {
      console.log('Error listing slots:', slotErr.message);
      return buildErrorResponse('Error reading smart card', slotErr.message);
    }

  } catch (err) {
    console.error('Unexpected CAC Reader Error:', err.message);
    return buildErrorResponse('CAC reader error', err.message);
  }
}

function buildErrorResponse(error, message) {
  return {
    success: false,
    error,
    message,
    mockData: {
      name: 'JANE SMITH',
      rank: 'Maj',
      title: 'Deputy Commander',
      affiliation: '652D AIR OPERATIONS CENTER',
      uid: '123456789'
    }
  };
}

function parsePKCS11Output(output) {
  try {
    // Parse pkcs11-tool output to extract certificate subject
    // Looking for lines like:
    // subject:    DN: C=US, O=U.S. Government, OU=DoD, OU=PKI, OU=USAF, CN=SHEKHON.JASKARAN.S.1643478010
    
    const dnMatch = output.match(/DN:\s*(.+?)(?:\n|Certificate|$)/);
    if (!dnMatch) {
      console.log('No DN line found in certificate output');
      return null;
    }

    const dn = dnMatch[1].trim();
    console.log('Parsed DN:', dn);
    
    // Extract CN (Common Name)
    const cnMatch = dn.match(/CN=([^,]+)/);
    let cnValue = cnMatch ? cnMatch[1].trim() : 'Unknown';
    
    // Parse CN which is typically: LASTNAME.FIRSTNAME.MIDDLE or LASTNAME.FIRSTNAME.M
    let firstName = '';
    let lastName = '';
    let middleInitial = '';
    let uid = cnValue;
    
    if (cnValue.includes('.')) {
      const parts = cnValue.split('.');
      if (parts.length >= 2) {
        // Format: LASTNAME.FIRSTNAME.M.NUMBERS
        lastName = parts[0] || '';
        firstName = parts[1] || '';
        middleInitial = parts[2] || '';
        
        // Remove any numeric suffixes from middle initial
        if (middleInitial && middleInitial.match(/^\d/)) {
          // Numeric part, skip
        } else if (middleInitial.length > 1) {
          // If it's longer than 1 char, it might be part of UID, take first char
          middleInitial = middleInitial.charAt(0);
        }
      }
    }

    // Extract branch (should be in OU field)
    const ouMatches = dn.match(/OU=([^,]+)/g);
    let branch = '';
    if (ouMatches && ouMatches.length > 0) {
      // The last OU before the military branch is usually the branch name (e.g., USAF, USA, USN)
      for (let i = ouMatches.length - 1; i >= 0; i--) {
        const ou = ouMatches[i].replace('OU=', '').trim();
        if (['USAF', 'USA', 'USN', 'USMC', 'USCG'].includes(ou)) {
          branch = ou;
          break;
        }
      }
    }
    
    // Extract organizational info
    const oMatch = dn.match(/O=([^,]+)/);

    return {
      firstName: firstName,
      lastName: lastName,
      middleInitial: middleInitial,
      fullName: `${firstName} ${lastName}`.trim(),
      branch: branch,
      affiliation: oMatch ? oMatch[1].trim() : '',
      uid: uid
    };
  } catch (err) {
    console.error('Error parsing PKCS11 output:', err);
    return null;
  }
}
