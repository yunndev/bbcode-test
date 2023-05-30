// Police ranks
export type Rank =
  | 'Cadet'
  | 'Officier de premier échelon'
  | 'Officier de second échelon'
  | 'Officier de troisième échelon'
  | 'Officier Senior'
  | 'Sergent'
  | 'Sergent-Chef'
  | 'Lieutenant'
  | 'Capitaine'
  | 'Deputy Chief'
  | 'Chief'
  | 'Assistant-Sheriff'
  | 'Undersheriff'
  | 'Sheriff'
export const ranks = [
  'Cadet',
  'Officier de premier échelon',
  'Officier de second échelon',
  'Officier de troisième échelon',
  'Officier Senior',
  'Sergent',
  'Sergent-Chef',
  'Lieutenant',
  'Capitaine',
  'Deputy Chief',
  'Chief',
  'Assistant-Sheriff',
  'Undersheriff',
  'Sheriff',
]

// Districts
export type District = 'Truenorth' | 'Townsend'
export const districts = ['Truenorth', 'Townsend']

// User profile type
export interface UserProfile {
  name: string
  rank: Rank
  district: District
}

// Profile-related utility functions
export const profile: {
  get: () => UserProfile | null
  set: (values: [string | null, Rank | null, District | null]) => boolean
  exists: () => boolean
} = {
  get: () => {
    if (typeof window === 'undefined') return null
    if (localStorage.getItem('bbcode-profile'))
      // If the profile exists, parse it
      return JSON.parse(localStorage.getItem('bbcode-profile'))

    // If not, return null
    return null
  },
  set: (values: [string | null, Rank | null, District | null]) => {
    // Get the current profile
    const currentProfile = profile.get() ?? { name: '', rank: '', district: '' }

    // Set the values into the current profile
    if (currentProfile) {
      if (values[0]) currentProfile.name = values[0]
      if (values[1]) currentProfile.rank = values[1]
      if (values[2]) currentProfile.district = values[2]
    }

    // Set the local memory of the profile to the updated profile
    localStorage.setItem('bbcode-profile', JSON.stringify(currentProfile))

    // Return that the operation was a success
    return true
  },
  exists: () => {
    // Return if the profile exists
    return typeof window === 'undefined'
      ? false
      : !!localStorage.getItem('bbcode-profile')
  },
}
