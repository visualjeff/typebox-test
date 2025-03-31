import { Type } from '@sinclair/typebox'

// Basic Types
const StringSchema = Type.String()
const NumberSchema = Type.Number()
const BooleanSchema = Type.Boolean()
const NullSchema = Type.Null()

// Array Types
const StringArraySchema = Type.Array(Type.String())
const NumberArraySchema = Type.Array(Type.Number())

// Object Types
const UserSchema = Type.Object({
  name: Type.String(),
  age: Type.Number(),
  email: Type.String({ format: 'email' }),
  isActive: Type.Boolean(),
  tags: Type.Array(Type.String())
})

// Union Types
const StatusSchema = Type.Union([
  Type.Literal('active'),
  Type.Literal('inactive'),
  Type.Literal('pending')
])

// Optional Properties
const OptionalUserSchema = Type.Object({
  name: Type.String(),
  age: Type.Optional(Type.Number()),
  email: Type.Optional(Type.String({ format: 'email' }))
})

// Example usage
const user = {
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  isActive: true,
  tags: ['user', 'active']
}

// You can use these schemas for runtime type checking
// and validation using TypeBox's validation functions
console.log('TypeBox Examples:')
console.log('----------------')
console.log('String Schema:', StringSchema)
console.log('User Schema:', UserSchema)
console.log('Status Schema:', StatusSchema) 