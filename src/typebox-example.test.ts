import { Type } from '@sinclair/typebox'
import { TypeCompiler } from '@sinclair/typebox/compiler'

describe('TypeBox Examples', () => {
  // Basic Types
  const StringSchema = Type.String()
  const NumberSchema = Type.Number()
  const BooleanSchema = Type.Boolean()

  // Object Type
  const UserSchema = Type.Object({
    name: Type.String(),
    age: Type.Number(),
    email: Type.String(),
    isActive: Type.Boolean(),
    tags: Type.Array(Type.String())
  })

  it('should validate basic types', () => {
    expect(TypeCompiler.Compile(StringSchema).Check('hello')).toBe(true)
    expect(TypeCompiler.Compile(NumberSchema).Check(42)).toBe(true)
    expect(TypeCompiler.Compile(BooleanSchema).Check(true)).toBe(true)
  })

  it('should validate user object', () => {
    const validUser = {
      name: 'John Doe',
      age: 30,
      email: 'john@example.com',
      isActive: true,
      tags: ['user', 'active']
    }

    const invalidUser = {
      name: 'John Doe',
      age: '30', // Should be a number
      email: 'invalid-email',
      isActive: true,
      tags: ['user', 'active']
    }

    const C = TypeCompiler.Compile(UserSchema)
    expect(C.Check(validUser)).toBe(true)
    expect(C.Check(invalidUser)).toBe(false)
  })
}) 