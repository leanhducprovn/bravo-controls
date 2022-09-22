export class BravoPermissionException extends Error {
   constructor(message?: string) {
      super(message);

      this.name = 'BravoPermissionException';

      const actualProto = new.target.prototype;

      Object.setPrototypeOf(this, BravoPermissionException.prototype);
   }
}