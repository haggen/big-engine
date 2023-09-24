/**
 * Components are tags used to query and index entity data.
 */
export class Component<T = {}> {
  constructor(data?: Partial<T>) {
    Object.assign(this, data);
  }
}
