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

describe('User Validation', () => {
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

  describe('validateUser', () => {
    it('should validate correct user data', () => {
      const result = validateUser(validUserData)
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should detect invalid ID type', () => {
      const invalidData = { ...validUserData, id: 123 }
      const result = validateUser(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('/id: Expected string')
    })

    it('should detect name length violations', () => {
      const invalidData = { ...validUserData, name: 'J' }
      const result = validateUser(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('/name: Expected string length greater or equal to 2')
    })

    it('should detect age range violations', () => {
      const invalidData = { ...validUserData, age: 150 }
      const result = validateUser(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('/age: Expected number to be less or equal to 120')
    })

    it('should detect invalid role', () => {
      const invalidData = { ...validUserData, roles: ['superuser'] }
      const result = validateUser(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('/roles/0: Expected union value')
    })

    it('should detect invalid settings', () => {
      const invalidData = {
        ...validUserData,
        settings: {
          notifications: 'yes',
          theme: 'blue'
        }
      }
      const result = validateUser(invalidData)
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('/settings/notifications: Expected boolean')
      expect(result.errors).toContain('/settings/theme: Expected union value')
    })
  })

  describe('createUser', () => {
    it('should create user with valid data', () => {
      const user = createUser(validUserData)
      expect(user).toEqual(validUserData)
      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('age')
      expect(user).toHaveProperty('roles')
      expect(user).toHaveProperty('settings')
    })

    it('should throw error with invalid data', () => {
      const invalidData = {
        ...validUserData,
        id: 123,
        name: 'J',
        age: 150,
        roles: ['superuser'],
        settings: {
          notifications: 'yes',
          theme: 'blue'
        }
      }

      expect(() => createUser(invalidData)).toThrow('Invalid user data')
    })

    it('should throw error with missing required fields', () => {
      const invalidData = {
        id: '123',
        name: 'John'
        // missing other required fields
      }

      expect(() => createUser(invalidData)).toThrow('Invalid user data')
    })

    it('should handle different valid role combinations', () => {
      const adminUser = { ...validUserData, roles: ['admin'] }
      const guestUser = { ...validUserData, roles: ['guest'] }
      const multiRoleUser = { ...validUserData, roles: ['admin', 'user'] }

      expect(createUser(adminUser)).toBeDefined()
      expect(createUser(guestUser)).toBeDefined()
      expect(createUser(multiRoleUser)).toBeDefined()
    })

    it('should handle different valid theme options', () => {
      const lightThemeUser = { ...validUserData, settings: { ...validUserData.settings, theme: 'light' } }
      const darkThemeUser = { ...validUserData, settings: { ...validUserData.settings, theme: 'dark' } }

      expect(createUser(lightThemeUser)).toBeDefined()
      expect(createUser(darkThemeUser)).toBeDefined()
    })
  })
}) 