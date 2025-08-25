---
title: "Subdomain Event Detection"
description: "Learn how the system automatically detects event codes from subdomains for seamless user registration"
---

# Subdomain Event Detection

This feature automatically detects event codes from subdomains, making it easier for users to sign up for specific events without manually entering event codes.

## How It Works

### Production URLs
When users access URLs like:
- `osday25.tanglecat.dev` → Event code: `osday25`
- `hackathon2024.tanglecat.dev` → Event code: `hackathon2024`
- `summer2024.tanglecat.dev` → Event code: `summer2024`

The system automatically:
1. Extracts the subdomain as the event code
2. Pre-fills the signup form
3. Shows a confirmation message
4. Provides a seamless registration experience

### Localhost Development
When running locally (`localhost:3000`):
- Event code input field is shown
- Users can manually enter any event code for testing
- Development mode information is displayed
- No automatic detection occurs

## Implementation Details

### Utility Functions
- `getEventCodeFromSubdomain()` - Extracts event code from current hostname
- `isLocalhost()` - Checks if running on localhost
- `getCurrentHostname()` - Gets current hostname for debugging
- `getCurrentUrl()` - Gets current full URL for debugging

### Form Behavior
1. **Auto-detection**: Automatically fills event code from subdomain
2. **Read-only display**: Shows detected code in a read-only input field
3. **Validation**: Ensures event code format is correct (alphanumeric only)
4. **Fallback**: Allows manual entry when no code is detected

### User Experience
- **Green banner**: Shows when event code is successfully detected
- **Yellow banner**: Shows development mode information on localhost
- **Orange banner**: Shows when no event code can be detected
- **Clear messaging**: Provides helpful guidance for all scenarios

## Edge Cases Handled

- Invalid subdomains (www, api, admin, staging, dev, test)
- Single-part hostnames
- Localhost and development environments
- Manual event code entry with validation
- Graceful fallback when detection fails

## Testing

### Manual Testing
1. Access `localhost:3000` → Should show manual input
2. Access `osday25.tanglecat.dev` → Should auto-detect `osday25`
3. Access `hackathon.tanglecat.dev` → Should auto-detect `hackathon`

### Test File
Run `getEventCodeFromSubdomain.test.ts` to verify utility functions work correctly.

## Configuration

No additional configuration is required. The feature works automatically based on the current hostname.

## Benefits

- **Improved UX**: Users don't need to remember or type event codes
- **Reduced Errors**: Eliminates typos in event code entry
- **Brand Consistency**: Each event gets its own subdomain
- **Easy Testing**: Developers can test with any event code locally
- **Scalable**: Works with any number of events without code changes

## Future Enhancements

- Event code validation against database
- Support for custom domains
- Event-specific branding and styling
- Analytics for event code usage
- Multi-language support for event names
