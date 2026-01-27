import ActiveDirectory from 'activedirectory2';

let adClient = null;

// Initialize AD client if configured
export function initializeAD() {
  const adUrl = process.env.AD_URL;
  const adUsername = process.env.AD_USERNAME;
  const adPassword = process.env.AD_PASSWORD;
  const adBaseDN = process.env.AD_BASE_DN;

  if (!adUrl || !adUsername || !adPassword || !adBaseDN) {
    console.log('Active Directory not configured. Rank lookup disabled.');
    return false;
  }

  try {
    const config = {
      url: adUrl,
      baseDN: adBaseDN,
      username: adUsername,
      password: adPassword,
      attributes: {
        user: ['displayName', 'sAMAccountName', 'title', 'department', 'mail', 'telephoneNumber', 'mobile']
      }
    };

    adClient = new ActiveDirectory(config);
    console.log('Active Directory client initialized successfully');
    return true;
  } catch (err) {
    console.error('Failed to initialize Active Directory:', err.message);
    return false;
  }
}

// Look up user in Active Directory to get rank/title
export async function lookupUserInAD(name, uid) {
  if (!adClient) {
    return null;
  }

  try {
    console.log(`Looking up user in AD: ${name} (UID: ${uid})`);

    // Try to find user by various attributes
    const searchFilters = [
      `(displayName=${name})`,
      `(sAMAccountName=${uid})`,
      `(cn=${name})`
    ];

    for (const filter of searchFilters) {
      try {
        const users = await new Promise((resolve, reject) => {
          adClient.findUsers(filter, (err, users) => {
            if (err) reject(err);
            else resolve(users || []);
          });
        });

        if (users && users.length > 0) {
          const user = users[0];
          console.log(`Found user in AD:`, {
            displayName: user.displayName,
            title: user.title,
            department: user.department,
            mail: user.mail
          });

          // Extract rank from title field (e.g., "Col" from "Col, USAF")
          const rank = extractRankFromTitle(user.title);

          return {
            displayName: user.displayName || name,
            title: user.title || '',
            rank: rank,
            department: user.department || '',
            email: user.mail || ''
          };
        }
      } catch (err) {
        console.log(`AD lookup failed for filter ${filter}:`, err.message);
        // Try next filter
      }
    }

    console.log('User not found in Active Directory');
    return null;
  } catch (err) {
    console.error('Active Directory lookup error:', err.message);
    return null;
  }
}

function extractRankFromTitle(title) {
  if (!title) return '';

  // Common military rank abbreviations to look for
  const ranks = [
    'BGen', 'Col', 'Lt Col', 'Maj', 'Capt', '1stLt', '2ndLt',
    'MSgt', 'TSgt', 'SSgt', 'SrA', 'A1C', 'Amn', 'Cpl', 'LCpl'
  ];

  for (const rank of ranks) {
    if (title.includes(rank)) {
      return rank;
    }
  }

  return '';
}
