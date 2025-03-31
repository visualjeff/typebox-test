import { Type, Static } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

// Define a schema for a User
const UserSchema = Type.Object({
  id: Type.String(),
  name: Type.String({ minLength: 2, maxLength: 50 }),
  email: Type.String(),
  age: Type.Number({ minimum: 0, maximum: 120 }),
  roles: Type.Array(Type.Union([
    Type.Literal('admin'),
    Type.Literal('user'),
    Type.Literal('guest')
  ])),
  settings: Type.Object({
    notifications: Type.Boolean(),
    theme: Type.Union([
      Type.Literal('light'),
      Type.Literal('dark')
    ])
  })
})

// Create a type from the schema
type User = Static<typeof UserSchema>

// Compile the schema for better performance
const UserValidator = TypeCompiler.Compile(UserSchema)

// Validation function with error details
function validateUser(data: unknown): { isValid: boolean; errors: string[] } {
  const isValid = UserValidator.Check(data)
  
  if (!isValid) {
    // Get detailed validation errors
    const errors = [...UserValidator.Errors(data)].map(error => 
      `${error.path}: ${error.message}`
    )
    return { isValid: false, errors }
  }

  return { isValid: true, errors: [] }
}

// Example usage
function createUser(userData: unknown): User {
  const validation = validateUser(userData)
  
  if (!validation.isValid) {
    throw new Error(`Invalid user data:\n${validation.errors.join('\n')}`)
  }
  
  // TypeScript now knows this is a valid User
  return userData as User
}

// Example valid data
const validUserData = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  roles: ['user'],
  settings: {
    notifications: true,
    theme: 'dark'
  }
}

// Example invalid data
const invalidUserData = {
  id: 123, // should be string
  name: 'J', // too short
  email: 'not-an-email',
  age: 150, // exceeds maximum
  roles: ['superuser'], // invalid role
  settings: {
    notifications: 'yes', // should be boolean
    theme: 'blue' // invalid theme
  }
}

// Test the validation
console.log('Validating valid user:')
console.log(validateUser(validUserData))

console.log('\nValidating invalid user:')
console.log(validateUser(invalidUserData))

// Example of using in a try-catch
try {
  const user = createUser(invalidUserData)
  console.log('User created:', user)
} catch (error: any) {
  console.error('Failed to create user:', error.message)
} 