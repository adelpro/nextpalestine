import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsUser(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isUser',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value && typeof value === 'object' && Object.keys(value).length > 0;
        },
        defaultMessage() {
          return `Property "${propertyName}" must contain a non-empty object`;
        },
      },
    });
  };
}
